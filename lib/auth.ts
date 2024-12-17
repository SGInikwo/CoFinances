'use server'

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function isJWTExpired(token: string) {
  try {
    const decodedToken: any = jwtDecode(token);
    const expirationTime = decodedToken.exp;

    if (!expirationTime) {

      throw new Error("Token does not have an expiration time.");
    }

    const currentTime = Math.floor(Date.now() / 1000);

    return expirationTime < currentTime;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return true;
  }
}

export async function get_cookie(){
  const jwt = cookies().get("jwt")

  return jwt?.value
}
