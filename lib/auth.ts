'use server';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

const { NEXT_PUBLIC_FASTAPI_URL: API_URL } = process.env;

export async function isJWTExpired(token: string) {
  try {
    const decodedToken: any = jwtDecode(token);
    const expirationTime = decodedToken.exp;

    if (!expirationTime) {
      throw new Error('Token does not have an expiration time.');
    }

    const currentTime = Math.floor(Date.now() / 1000);

    return expirationTime < currentTime;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return true;
  }
}

export async function get_cookie() {
  const jwt = cookies().get('jwt');

  return jwt?.value;
}

export async function initiate_jwt(jwt) {
  const response = await axios.post(`${API_URL}/api/usertoken/`, null, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}

export async function send_jwt(jwt) {
  const response = await axios.post(
    `${API_URL}/api/usertoken/updateauth/`,
    null,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session are sent
    },
  );

  // console.log("Server Response:", response.data);

  return response.data;
}

export async function get_jwt(userId) {
  const get_jwt = await axios.get(`${API_URL}/api/usertoken/get/${userId}`);

  return get_jwt.data;
}

export async function delete_jwt(jwt, userId) {
  const get_jwt = await axios.delete(
    `${API_URL}/api/usertoken/delete/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      withCredentials: true, // Ensures session are sent
    },
  );
}
