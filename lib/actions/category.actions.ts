'use server';

import axios from 'axios';

const { NEXT_PUBLIC_FASTAPI_URL: API_URL } = process.env;

export async function add_category(jwt, parsedData) {
  const payload = {
    category: parsedData, // Ensure parsedData matches the format of Transactions_ing
  };
  console.log('seee', parsedData);
  const response = await axios.post(`${API_URL}/api/category/`, payload, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}

export async function get_category_name(jwt) {
  const response = await axios.get(`${API_URL}/api/category/category_name`, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}
