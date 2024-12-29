import CurrentBalanceBox from '@/components/CurrentBalanceBox'
import HeaderBox from '@/components/HeaderBox'
import TransactionTable from '@/components/TransactionTable'
import Calendar from '@/components/Calender'
import { get_summary } from '@/lib/actions/transaction.actions'
import { create_JWT, get_transactionList, getLoggedInUser } from '@/lib/actions/user.actions'
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth'
import React from 'react'

const Home = async () => {
  const loggedIn = await getLoggedInUser();

  let jwt = await get_jwt(loggedIn["$id"])

  if( await isJWTExpired(jwt)){ 

    jwt = await create_JWT()

    await send_jwt(jwt)
    jwt = await get_jwt(loggedIn["$id"])

  }

  const transactions = await get_transactionList(jwt)

  const transactionSummary = await get_summary(jwt)
  // console.log(transactionSummary["monthlyBalance"])

  return (
    <section className='home'>
      <div className='home-content'>
        <HeaderBox 
          type='greeting'
          title='Welcome'
          user={loggedIn?.firstName || 'Guest'}
          userInfo={loggedIn.$id}
          subtext= 'Access and manage your spending and savings'
          currency={String(loggedIn.currency)}
        />

        <div className='flex gap-1 w-full max-md:flex-col'>
          <CurrentBalanceBox
            type = 'Balance'
            image_name = 'icons/money_balance.svg'
            totalCurrentBalance={Number(transactionSummary["monthlyBalance"])}
            totalPreviousBalance = {520.54}
            totalTransactions = {30}
            user_currency = {loggedIn.currency}
          />

          <CurrentBalanceBox
            type = 'Expense'
            image_name = 'icons/expens.svg'
            totalCurrentBalance={Number(transactionSummary["monthlyExpenses"])}
            totalPreviousBalance = {100.54}
            totalTransactions = {30}
            user_currency = {loggedIn.currency}
          />

          <CurrentBalanceBox
            type = 'Savings'
            image_name = 'icons/bank.svg'
            totalCurrentBalance={Number(transactionSummary["monthlySavings"])}
            totalPreviousBalance = {500.20}
            totalTransactions = {1}
            user_currency = {loggedIn.currency}
          />

          <div className='hidden'>
            <CurrentBalanceBox
              type = 'Savings'
              image_name = 'icons/invest.svg'
              totalCurrentBalance={100050.00}
              totalPreviousBalance = {500.20}
              totalTransactions = {1}
              user_currency = {loggedIn.currency}
            />
          </div>
          
        </div>
        <div>
          <TransactionTable transactions={transactions} currency={loggedIn.currency}/>
        </div>
        <Calendar />
      </div>
      
      
    </section>
  )
}

export default Home