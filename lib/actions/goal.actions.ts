'use server';

import axios from 'axios';

const { NEXT_PUBLIC_FASTAPI_URL: API_URL } = process.env;

export async function get_goals(jwt) {
  const response = await axios.get(`${API_URL}/api/goals/`, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}

export async function update_goals_currency(jwt, clientCurrency) {
  const response = await axios.post(
    `${API_URL}/api/goals/update_goals-${clientCurrency}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session are sent
    },
  );

  return response.data;
}
