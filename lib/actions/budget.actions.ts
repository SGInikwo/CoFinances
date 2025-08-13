'use server';

import axios from 'axios';

const { NEXT_PUBLIC_FASTAPI_URL: API_URL } = process.env;

export async function add_budget(jwt, parsedData) {
  const payload = {
    budget: parsedData, // Ensure parsedData matches the format of Transactions_ing
  };
  console.log('seee', parsedData);
  const response = await axios.post(`${API_URL}/api/budget/`, payload, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}

export async function get_all_budget(jwt) {
  const response = await axios.get(`${API_URL}/api/budget/`, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}

export async function get_all_summary(jwt) {
  const response = await axios.get(`${API_URL}/api/budgetSummary/list`, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}

export async function update_budget_currency(jwt, clientCurrency) {
  const response = await axios.post(
    `${API_URL}/api/budget/update_balances-${clientCurrency}`,
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

export async function update_budget_summary_currency(jwt, clientCurrency) {
  const response = await axios.post(
    `${API_URL}/api/budgetSummary/update_balances-${clientCurrency}`,
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

export async function push_budget_data(jwt) {
  const response = await axios.post(`${API_URL}/api/budgetSummary/`, null, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}
