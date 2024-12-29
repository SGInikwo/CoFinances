'use client';

import React from 'react';
import CountUp from 'react-countup';

const AnimatedCounter = ({ amount, currency }: { amount: number, currency: string }) => {
  const formatValue = (value: number) => {
    const absoluteValue = Math.abs(value).toFixed(2).replace('.', ',');
    const parts = absoluteValue.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add spaces as thousand separators
    const formattedNumber = parts.join(',');
    return value < 0 ? `${currency}-${formattedNumber}` : `${currency}${formattedNumber}`;
  };

  return (
    <div>
      <CountUp
        duration={0.75}
        end={amount}
        formattingFn={formatValue} // Custom formatting with thousand separators
      />
    </div>
  );
};

export default AnimatedCounter;
