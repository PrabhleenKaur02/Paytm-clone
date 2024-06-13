import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Balance = () => {
  const [balance, setBalance] = useState("");

  useEffect(() => {
  const fetchBalance = async() =>{
    try {
      await axios.get("http://localhost:3000/api/v1/account/balance", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
      }
      }).then(response => {
        setBalance(response.data.balance)
      })
      
    } catch (error) {
      console.log("Error fetching balance: ", error)
    }
  };

  fetchBalance();
}, []);

console.log(balance);

  return (
    <div className='flex'>
        <div className='font-bold text-lg'>
            Your balance
        </div>
        <div className='font-semibold ml-4 text-lg'>
            Rs {balance != null ? balance: 'Loading...'}
        </div>
    </div>
  )
}

export default Balance