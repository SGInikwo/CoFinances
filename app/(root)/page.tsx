import CurrentBalanceBox from '@/components/CurrentBalanceBox'
import HeaderBox from '@/components/HeaderBox'
import React from 'react'

const Home = () => {
  const loggedIn = { firstName: 'Gloria', lastName: 'Whunsun'}

  return (
    <section className='home'>
      <div className='home-content'>
        <HeaderBox 
          type='greeting'
          title='Welcome'
          user={loggedIn?.firstName || 'Guest'}
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