'use client';

import React from 'react'
import CountUp from 'react-countup';

const AnimatedCounter = ({ amount, currency,  }: { amount:number, currency:string }) => {
  return (
    <div>
      <CountUp
        duration={.75}
        decimals={2}
        decimal=","
        prefix={currency} //₩$€
        suffix=''
        end={amount} 
      />
      
      {/* {formatAmount(totalCurrentBalance, 'EUR')} */}
    </div>
  )
}

export default AnimatedCounter