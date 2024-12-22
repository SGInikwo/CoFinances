// 'use server';

// import { get_cookie, isJWTExpired } from "./auth";
// import { create_JWT } from "./createJWT";

// export async function validateAndFetchJWT() {
//   // Get the JWT cookie
//   let jwt = await get_cookie();

//   // If the JWT is missing or expired, create a new one
//   if (!jwt || (await isJWTExpired(jwt))) {
//     console.log("JWT is expired or missing, generating a new one...");
//     jwt = await create_JWT();
//   }

//   return jwt;
// }