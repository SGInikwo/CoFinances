'use server';

import { ID, Query, Permission, Role } from 'node-appwrite';
import { createAdminClient, createSessionClient } from '../appwrite';
import { cookies } from 'next/headers';
import { parseStringify } from '../utils';
import bcrypt from 'bcryptjs';
import { delete_jwt, initiate_jwt } from '../auth';
import axios from 'axios';

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  NEXT_PUBLIC_FASTAPI_URL: API_URL,
} = process.env;

export const getAllUsers = async () => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      // [Query.notEqual('authLevel', [-1])],
    );

    return parseStringify(user.documents);
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])],
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account, database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('email', [email])],
    );

    const databasePassword = user.documents[0]['password'];
    const databaseAuthLevel = user.documents[0]['authLevel'];

    const isMatch = await bcrypt.compare(password, databasePassword);

    if (isMatch && databaseAuthLevel === -1) {
      const session = await account.createEmailPasswordSession(
        email,
        databasePassword,
      );

      // Check for existing `appwrite-session` cookie
      const existingSessionCookie = cookies().get('appwrite-session');

      if (!existingSessionCookie) {
        // Set `appwrite-session` cookie if not already set
        cookies().set('appwrite-session', session.secret, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
        });
      }

      const user = await getUserInfo({ userId: session.userId });

      const jwt = await create_JWT();

      await initiate_jwt(jwt);

      return parseStringify(user);
    } else {
      console.error('Error Logging in');
      return null;
    }
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

export const signUp = async ({
  confirmPassword,
  ...userData
}: SignUpParams) => {
  const { email, password, firstName, lastName, currency } = userData;

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    const id = ID.unique();

    newUserAccount = await account.create(
      id,
      email,
      password,
      `${firstName} ${lastName}`,
    );

    if (!newUserAccount) throw new Error('Error creating user');

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      newUserAccount.$id,
      {
        ...userData,
        userId: newUserAccount.$id,
        authLevel: 1,
        isSwapped: 0,
        swapCode: 0,
      },
      [Permission.read(Role.user(newUserAccount.$id))],
    );

    await create_JWT();

    return parseStringify(newUser);
  } catch (error) {
    console.error('Error', error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    console.error('Error', error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const user = await getLoggedInUser();

    if (user.isSwapped === 1) {
      await swapLogout();
    }

    await delete_jwt(user['$id']);

    const { account } = await createSessionClient();

    await account.deleteSession('current');

    cookies().delete('appwrite-session');

    return true;
  } catch (error) {
    console.error('Error', error);
  }
};

export const swapUsers = async ({ code, swapUser }) => {
  try {
    const { account } = await createAdminClient();
    const user = await getLoggedInUser();
    const newCode = Number(code);

    if (newCode === swapUser.swapCode && swapUser.authLevel === -1) {
      if (user.isSwapped === 1) {
        await returnSwap({ userId: user.$id });
      } else {
        await fromSwapId({ swapUserId: swapUser.$id });
      }

      await logoutAccount();
      console.log('User logged out successfully');

      await new Promise((resolve) => setTimeout(resolve, 500));

      const session = await account.createEmailPasswordSession(
        swapUser.email,
        swapUser.password,
      );

      return session;
    } else {
      console.error('Error Logging in');
      return null;
    }
  } catch (error) {
    console.error('Error', error);
    return null;
  }
};

export const swapForward = async ({ session }) => {
  // Check for existing `appwrite-session` cookie
  const existingSessionCookie = cookies().get('appwrite-session');

  if (!existingSessionCookie) {
    console.log('I want to see');
    // Set `appwrite-session` cookie if not already set
    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });
  }

  const user = await getUserInfo({ userId: session.userId });
  const jwt = await create_JWT();

  await initiate_jwt(jwt);

  return parseStringify(user);
};

export const fromSwapId = async ({ swapUserId }: { swapUserId: string }) => {
  const { database } = await createAdminClient();

  // Fetch the current user document
  const swapUser = await database.getDocument(
    DATABASE_ID!,
    USER_COLLECTION_ID!,
    swapUserId,
  );

  // Remove internal fields like $databaseId
  const { $databaseId, $collectionId, ...userData } = swapUser;

  // Update the user document with the new currency value
  const updatedUser = await database.updateDocument(
    DATABASE_ID!,
    USER_COLLECTION_ID!,
    swapUserId,
    {
      ...userData,
      isSwapped: 1,
      fromSwapId: (await getLoggedInUser()).firstName, // Update swapCode field
    },
  );

  return parseStringify(updatedUser); // Returning the updated document
};

export const returnSwap = async ({ userId }: { userId: string }) => {
  const { database } = await createAdminClient();

  // Fetch the current user document
  const swapUser = await database.getDocument(
    DATABASE_ID!,
    USER_COLLECTION_ID!,
    userId,
  );

  // Remove internal fields like $databaseId
  const { $databaseId, $collectionId, ...userData } = swapUser;

  // Update the user document with the new currency value
  const updatedUser = await database.updateDocument(
    DATABASE_ID!,
    USER_COLLECTION_ID!,
    userId,
    {
      ...userData,
      isSwapped: 0,
      fromSwapId: '', // Update swapCode field
    },
  );

  return parseStringify(updatedUser); // Returning the updated document
};

export const swapLogout = async () => {
  try {
    const { database } = await createAdminClient();
    const user = await getLoggedInUser();

    // Fetch the current user document
    const swapUser = await database.getDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      user.$id,
    );

    // Remove internal fields like $databaseId
    const { $databaseId, $collectionId, ...userData } = swapUser;

    // Update the user document with the new currency value
    const updatedUser = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      user.$id,
      {
        ...userData,
        isSwapped: 0,
        fromSwapId: '', // Update swapCode field
      },
    );

    return parseStringify(updatedUser); // Returning the updated document
  } catch (error) {
    console.error('Error', error);
  }
};

export const updateUserSwapCode = async ({ newCode }: { newCode: string }) => {
  const { database } = await createAdminClient();
  const user = await getLoggedInUser();

  // Convert to a number if needed (or you can keep it as a string if that’s the format)
  const newCodeNumber = Number(newCode);

  // Fetch the current user document
  const currentUser = await database.getDocument(
    DATABASE_ID!,
    USER_COLLECTION_ID!,
    user.$id,
  );

  // Remove internal fields like $databaseId
  const { $databaseId, $collectionId, ...userData } = currentUser;
  console.log('lets see', newCodeNumber);
  // Update the user document with the new currency value
  const updatedUser = await database.updateDocument(
    DATABASE_ID!,
    USER_COLLECTION_ID!,
    user.$id,
    {
      ...userData,
      swapCode: newCodeNumber, // Update swapCode field
    },
  );

  return parseStringify(updatedUser); // Returning the updated document
};

export const updateuserCurrency = async ({
  newCurrency,
}: {
  newCurrency: string;
}) => {
  const { account, database } = await createAdminClient();
  const user = await getLoggedInUser();

  // Convert to a number if needed (or you can keep it as a string if that’s the format)
  const newCurrencyNumber = Number(newCurrency);

  // Fetch the current user document
  const currentUser = await database.getDocument(
    DATABASE_ID!,
    USER_COLLECTION_ID!,
    user.$id,
  );

  // Remove internal fields like $databaseId
  const { $databaseId, $collectionId, ...userData } = currentUser;

  // Update the user document with the new currency value
  const updatedUser = await database.updateDocument(
    DATABASE_ID!,
    USER_COLLECTION_ID!,
    user.$id,
    {
      ...userData,
      currency: newCurrencyNumber, // Update currency field
    },
  );

  return parseStringify(updatedUser); // Returning the updated document
};

export async function create_JWT(account?: any) {
  try {
    if (!account) {
      const { account: newAccount } = await createSessionClient();
      account = newAccount;
    }

    const jwtResponse = await account.createJWT();
    const jwt = jwtResponse.jwt;

    return jwt;
  } catch (error) {
    console.error('Error', error);
  }
}

export async function get_all_transactionList(jwt) {
  try {
    const get_transactions = await axios.get(
      `${API_URL}/api/transactions/list-all`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
        },
        withCredentials: true, // Ensures session cookies are sent
      },
    );

    return get_transactions.data;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
}

export async function get_transactionList(jwt, month, year) {
  try {
    const get_transactions = await axios.get(
      `${API_URL}/api/transactions/list-${month}-${year}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
        },
        withCredentials: true, // Ensures session cookies are sent
      },
    );

    return get_transactions.data;
  } catch (error) {
    console.error('Error', error);
    return null;
  }
}
