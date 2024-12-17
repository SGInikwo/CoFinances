'use client'

import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios"
import { create_JWT, getLoggedInUser } from "@/lib/actions/user.actions";
import { get_cookie, isJWTExpired } from "@/lib/auth";



interface RowData {
  [key: string]: string | number | boolean; // Dynamic row structure
}

const Transactions = () => {
  const [data, setData] = useState<RowData[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer; // Read the file as an ArrayBuffer
        const data = new Uint8Array(arrayBuffer); // Convert the ArrayBuffer to Uint8Array
        const workbook = XLSX.read(data, { type: "array" }); // Use type 'array' for XLSX
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData: RowData[] = XLSX.utils.sheet_to_json<RowData>(sheet); // Convert the sheet to JSON
        console.log(parsedData);
        setData(parsedData);
        
        // Send parsed data to the FastAPI backend
        try {
          const user = await getLoggedInUser();
          if (!user) {
              throw new Error("No active session found for the user.");
          }

          console.log("Logged-in User:", user); // Debugging

          let jwt = await get_cookie()

          if( await isJWTExpired(jwt)){
            console.log("JWT is expired, generating a new one...");
            await create_JWT()
            jwt = await get_cookie()
            console.log("New JWT", jwt);
          }else{
            console.log("JWT is valid", jwt);

          }

          const response = await axios.post("http://localhost:8000/api/transactions/", 
            parsedData,
            {
              headers: {
                Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
              },
                withCredentials: true, // Ensures session cookies are sent
            }

          );
          console.log("Server Response:", response.data);
        } catch (error) {
          console.error("Error sending data to server:", error);
        }
      };

      reader.readAsArrayBuffer(file); // Use readAsArrayBuffer instead of readAsBinaryString
    }
  }

  return (
    <div>
      <input 
        type="file" 
        accept=".xlsx, .xls, .csv" 
        onChange={handleFileUpload} 
      />

      {data.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Transactions