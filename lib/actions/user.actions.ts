'use server'

import { ID, Query, Permission, Role } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { parseStringify } from "../utils"

const{
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  // APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID
} = process.env

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);
  
    // Check for existing `appwrite-session` cookie
    const existingSessionCookie = cookies().get("appwrite-session");

    if (!existingSessionCookie) {
      // Set `appwrite-session` cookie if not already set
      cookies().set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
      console.log("New session cookie set.");
    } else {
      console.log("Existing session cookie detected. Not overwriting.");
    }

    const user = await getUserInfo({ userId: session.userId });

    await create_JWT()

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error)
  }
}

export const signUp = async ({ confirmPassword, ...userData}: SignUpParams) => {
  const { email, password, firstName, lastName, currency } = userData;

  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    const id = ID.unique()

    newUserAccount =  await account.create(
      id, 
      email, password, 
      `${firstName} ${lastName}`
    );

    if(!newUserAccount) throw new Error('Error creating user');

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      newUserAccount.$id,
      {
        ...userData,
        userId: newUserAccount.$id,
      },
      [
        Permission.read(Role.user(newUserAccount.$id))
      ]
    );

    const session = await account.createEmailPasswordSession(email, password);
  
    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    await create_JWT()

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id })

    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    await account.deleteSession('current')

    cookies().delete('appwrite-session');

    return true
  } catch (error) {
    console.error("Error", error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function create_JWT(account?: any) {
  try {
    if (!account) {
      const { account: newAccount } = await createSessionClient();
      account = newAccount;
    }

    const jwtResponse = await account.createJWT();
    const jwt = jwtResponse.jwt;

    cookies().set("jwt", jwt, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    console.log("JWT created and stored in cookie:", jwt);

    return jwt;

  } catch (error) {
    console.error("Error", error);
  }
}