import axios from "axios";


export async function convert_currency(base, target){
  const amount = await axios.get(`http://localhost:8000/api/currency/${base}-${target}`,
  );
  
  return amount.data
}