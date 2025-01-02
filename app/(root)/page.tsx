import CurrentBalanceBox from '@/components/CurrentBalanceBox'
import HeaderBox from '@/components/HeaderBox'
import TransactionTable from '@/components/TransactionTable'
import Calendar from '@/components/Calender'
import { get_all_summary, get_summary } from '@/lib/actions/transaction.actions'
import { create_JWT, get_transactionList, getLoggedInUser } from '@/lib/actions/user.actions'
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth'
import React from 'react'

const Home = async () => {
  const loggedIn = await getLoggedInUser();

  let transactions = [];
  let summaries = [];
  let monthlyBalance = 0;
  let monthlyExpenses = 0;
  let monthlySavings = 0;

  if (loggedIn){
    let jwt = await get_jwt(loggedIn?.$id)

    if (await isJWTExpired(jwt)) {
      jwt = await create_JWT()
      await send_jwt(jwt)
      jwt = await get_jwt(loggedIn?.$id)
    }

    const [transactionList, allSummaries, transactionSummary] = await Promise.all([
      get_transactionList(jwt),
      get_all_summary(jwt),
      get_summary(jwt).catch(() => null), // Safely handle potential error
    ]);

    transactions = transactionList;
    summaries = allSummaries;
    monthlyBalance = transactionSummary?.monthlyBalance ? Number(transactionSummary.monthlyBalance) : 0;
    monthlyExpenses = transactionSummary?.monthlyExpenses ? Number(transactionSummary.monthlyExpenses) : 0;
    monthlySavings = transactionSummary?.monthlySavings ? Number(transactionSummary.monthlySavings) : 0;
  }

  return (
    <section className='home'>
      <div className='home-content'>
        <HeaderBox 
          type='greeting'
          title='Welcome'
          user={loggedIn?.firstName || 'Guest'}
          userInfo={loggedIn?.$id}
          subtext='Access and manage your spending and savings'
          currency={String(loggedIn?.currency)}
        />

        <div className='flex gap-1 w-full max-md:flex-col'>
          <CurrentBalanceBox
            type='Balance'
            image_name='icons/money_balance.svg'
            totalCurrentBalance={monthlyBalance}
            totalPreviousBalance={520.54}
            totalTransactions={30}
            user_currency={loggedIn?.currency}
          />

          <CurrentBalanceBox
            type='Expense'
            image_name='icons/expens.svg'
            totalCurrentBalance={monthlyExpenses}
            totalPreviousBalance={100.54}
            totalTransactions={30}
            user_currency={loggedIn?.currency}
          />

          <CurrentBalanceBox
            type='Savings'
            image_name='icons/bank.svg'
            totalCurrentBalance={monthlySavings}
            totalPreviousBalance={500.20}
            totalTransactions={1}
            user_currency={loggedIn?.currency}
          />

          <div className='hidden'>
            <CurrentBalanceBox
              type='Savings'
              image_name='icons/invest.svg'
              totalCurrentBalance={100050.00}
              totalPreviousBalance={500.20}
              totalTransactions={1}
              user_currency={loggedIn?.currency}
            />
          </div>
          
        </div>
        <div>
          <TransactionTable transactions={transactions} currency={loggedIn?.currency}/>
        </div>
        <Calendar summaries={summaries}currency={loggedIn?.currency}/>
      </div>
    </section>
  )
}

export default Home
