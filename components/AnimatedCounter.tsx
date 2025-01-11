'use client';

import React from 'react';
import CountUp from 'react-countup';

const AnimatedCounter = ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) => {
  const formatValue = (value: number) => {
    // Format the number with 2 decimal places (or 0 for ₩) and use comma as the decimal separator
    const formattedValue = value.toLocaleString('nl-NL', {
      minimumFractionDigits: currency === '₩' ? 0 : 2,
      maximumFractionDigits: currency === '₩' ? 0 : 2,
    });
    if (currency === '%') {
      return value < 0
        ? `${formattedValue}${currency}`
        : `${formattedValue}${currency}`;
    }
    return value < 0
      ? `${currency}${formattedValue}`
      : `${currency}${formattedValue}`;
  };

  return (
    <div>
      <CountUp
        duration={0.75}
        decimals={currency === '₩' ? 0 : 2} // Set decimals to 0 if currency is ₩, otherwise 2
        end={amount}
        formattingFn={formatValue} // Custom formatting with thousand separators
      />
    </div>
  );
};

export default AnimatedCounter;
