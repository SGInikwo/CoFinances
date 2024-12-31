import axios from "axios";


export async function convert_currency(base, target){
  const amount = await axios.get(`http://localhost:8000/api/currency/${base}-${target}`,
  );
  
  return amount.data
}

export async function push_data(jwt){
  const response = await axios.post(`http://localhost:8000/api/summary/`,
    null,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session cookies are sent
    }
  );
  
  return response.data
}

export async function get_summary(jwt){
  const response = await axios.get(`http://localhost:8000/api/summary/summary`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session cookies are sent
    }
  );
  
  return response.data
}

export async function get_all_summary(jwt){
  const response = await axios.get(`http://localhost:8000/api/summary/list`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      },
      withCredentials: true, // Ensures session cookies are sent
    }
  );
  
  return response.data
}