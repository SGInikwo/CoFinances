'use server';

import axios from 'axios';

const { NEXT_PUBLIC_FASTAPI_URL: API_URL } = process.env;

export async function convert_currency(base, target) {
  const amount = await axios.get(`${API_URL}/api/currency/${base}-${target}`);

  return amount.data;
}

export async function push_data(jwt) {
  const response = await axios.post(`${API_URL}/api/summary/`, null, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}

export async function get_all_summary(jwt) {
  const response = await axios.get(`${API_URL}/api/summary/list`, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}

export async function get_summary_months(jwt) {
  const response = await axios.get(`${API_URL}/api/summary/months`, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}

export async function get_summary(jwt, month, year) {
  const response = await axios.get(
    `${API_URL}/api/summary/summary-${month}-${year}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session are sent
    },
  );

  return response.data;
}

export async function send_transactions(jwt, parsedData, clientCurrency) {
  const payload = {
    transactions: parsedData, // Ensure parsedData matches the format of Transactions_ing
    clientCurrency: String(clientCurrency), // Ensure clientCurrency is valid (string)
  };
  console.log(payload);
  const response = await axios.post(`${API_URL}/api/transactions/`, payload, {
    headers: {
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    },
    withCredentials: true, // Ensures session are sent
  });

  return response.data;
}

export async function update_transaction_currency(jwt, clientCurrency) {
  const response = await axios.post(
    `${API_URL}/api/transactions/update_balances-${clientCurrency}`,
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

export async function get_current_analysis(jwt, month, year) {
  const response = await axios.get(
    `${API_URL}/api/transactions/analysis-current-${month}-${year}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session are sent
    },
  );

  return response.data;
}

export async function get_past_analysis(jwt, month, year) {
  const response = await axios.get(
    `${API_URL}/api/transactions/analysis-past-${month}-${year}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session are sent
    },
  );

  return response.data;
}
