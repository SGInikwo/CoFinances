import CurrentBalanceBox from '@/components/CurrentBalanceBox'
import HeaderBox from '@/components/HeaderBox'
import TransactionTable from '@/components/TransactionTable'
import { convert_currency } from '@/lib/actions/currency.actions'
import { create_JWT, get_transactionList, getLoggedInUser } from '@/lib/actions/user.actions'
import { get_cookie, get_jwt, isJWTExpired, send_jwt } from '@/lib/auth'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React from 'react'

const Home = async () => {
  const loggedIn = await getLoggedInUser();

  let jwt = await get_jwt(loggedIn["$id"])

  console.log("this is the current jwt", jwt)

  if( await isJWTExpired(jwt)){ 
    console.log("it is expired!")

    jwt = await create_JWT()

    await send_jwt(jwt)
    jwt = await get_jwt(loggedIn["$id"])

    console.log("new jwt", jwt)
  }

  const transactions = await get_transactionList(jwt)

  // const cc = await convert_currency(0,1)
  // console.log(cc)
  
  return (
    <section className='home'>
      <div className='home-content'>
        <HeaderBox 
          type='greeting'
          title='Welcome'
          user={loggedIn?.firstName || 'Guest'}
          subtext= 'Access and manage your spending and savings'
        />

        <div className='flex gap-1 w-full max-md:flex-col'>
          <CurrentBalanceBox
            type = 'Balance'
            image_name = 'icons/money_balance.svg'
            totalCurrentBalance={435.60}
            totalPreviousBalance = {520.54}
            totalTransactions = {30}
          />

          <CurrentBalanceBox
            type = 'Expense'
            image_name = 'icons/expens.svg'
            totalCurrentBalance={220.60}
            totalPreviousBalance = {100.54}
            totalTransactions = {30}
          />

          <CurrentBalanceBox
            type = 'Savings'
            image_name = 'icons/bank.svg'
            totalCurrentBalance={100050.00}
            totalPreviousBalance = {500.20}
            totalTransactions = {1}
          />

          <div className='hidden'>
            <CurrentBalanceBox
              type = 'Savings'
              image_name = 'icons/invest.svg'
              totalCurrentBalance={100050.00}
              totalPreviousBalance = {500.20}
              totalTransactions = {1}
            />
          </div>
          
        </div>
        <TransactionTable transactions={transactions}/>
      </div>
    </section>
  )
}

export default Home