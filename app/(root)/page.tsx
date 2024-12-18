import CurrentBalanceBox from '@/components/CurrentBalanceBox'
import HeaderBox from '@/components/HeaderBox'
import Transactions from '@/components/Transactions'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import React from 'react'

const Home = async () => {
  const loggedIn = await getLoggedInUser();

  // if (!loggedIn) redirect('/sign-in')

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
        {/* <Transactions /> */}
      </div>
    </section>
  )
}

export default Home