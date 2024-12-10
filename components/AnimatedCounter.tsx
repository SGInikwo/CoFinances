'use client';

import React from 'react'
import CountUp from 'react-countup';

const AnimatedCounter = ({ amount }: { amount:number }) => {
  return (
    <div>
      <CountUp className='w-full'
        duration={2.75}
        decimals={2}
        decimal=","
        prefix="€" //₩$ 
        end={amount} 
      />
      
      {/* {formatAmount(totalCurrentBalance, 'EUR')} */}
    </div>
  )
}

export default AnimatedCounter