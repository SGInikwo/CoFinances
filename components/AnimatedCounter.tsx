'use client';

import React from 'react';
import CountUp from 'react-countup';

const AnimatedCounter = ({ amount, currency }: { amount: number, currency: string }) => {
  const formatValue = (value: number) => {
    // Format the number with 2 decimal places and use comma as the decimal separator
    const formattedValue = value.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return value < 0 ? `${currency}${formattedValue}` : `${currency}${formattedValue}`;
  };

  return (
    <div>
      <CountUp
        duration={0.75}
        decimals={2}
        end={amount}
        formattingFn={formatValue} // Custom formatting with thousand separators
      />
    </div>
  );
};

export default AnimatedCounter;
