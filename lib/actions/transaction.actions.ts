'use server'

import axios from "axios";

const{
  NEXT_PUBLIC_FASTAPI_URL: API_URL,
} = process.env

export async function convert_currency(base, target){
  const amount = await axios.get(`${API_URL}/api/currency/${base}-${target}`,
  );

  return amount.data
}

export async function push_data(jwt){
  const response = await axios.post(`${API_URL}/api/summary/`,
    null,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session are sent
    }
  );
  
  return response.data
}

export async function get_summary(jwt){
  const response = await axios.get(`${API_URL}/api/summary/summary`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session are sent
    }
  );
  
  return response.data
}

export async function get_all_summary(jwt){
  const response = await axios.get(`${API_URL}/api/summary/list`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session are sent
    }
  );
  
  return response.data
}

export async function send_transactions(jwt, parsedData){
  const response = await axios.post(`${API_URL}/api/transactions/`,
    parsedData,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session are sent
    }
  );
  
  return response.data
}