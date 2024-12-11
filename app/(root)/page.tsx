import CurrentBalanceBox from '@/components/CurrentBalanceBox'
import HeaderBox from '@/components/HeaderBox'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'

const Home = async () => {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) redirect('/sign-in')

  return (
    <section className='home'>
      <div className='home-content'>
        <HeaderBox 
          type='greeting'
          title='Welcome'
          user={loggedIn?.name || 'Guest'}
          subtext= 'Access and manage your spending and savings'
        />

        <CurrentBalanceBox
          type = 'Balance'
          totalCurrentBalance={435.60}
          totalPreviousBalance = {520.54}
          totalTransactions = {30}
        />
      </div>
    </section>
  )
}

export default Home