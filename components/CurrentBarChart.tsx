// @ts-nocheck

'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const CurrentBarChart = ({ transactions, currency }) => {
  const current_currency =
    currency === 0
      ? '€'
      : currency === 1
        ? '₩'
        : currency === 2
          ? 'KES'
          : currency === 3
            ? '£'
            : '$';

  const groupedTransactions = transactions
    .filter((item) => item.amount < 0) // Filter expenses
    .reduce((acc, item) => {
      const formattedDate = new Date(item.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      });
      if (!acc[formattedDate]) {
        acc[formattedDate] = 0;
      }
      acc[formattedDate] += Math.abs(Number(item.amount)); // Use absolute values
      return acc;
    }, {});

  // Convert grouped data to an array of objects and sort by date
  const orderedTransactions = Object.entries(groupedTransactions)
    .map(([date, amount]) => ({ x: date, y: amount })) // Convert to array of objects
    .sort((a, b) => {
      const dateA = new Date(a.x.split(' ').reverse().join(' ')); // Convert '1 Jan' to 'Jan 1'
      const dateB = new Date(b.x.split(' ').reverse().join(' '));

      // Ensure you compare date values by getting their timestamp values
      return dateA.getTime() - dateB.getTime(); // Sort by ascending date
    });

  const data = {
    datasets: [
      {
        label: 'Expenses',
        data: orderedTransactions,
        borderColor: '#50b545',
        backgroundColor: '#F3FFF1',
        borderWidth: 2,
        borderRadius: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Current month expenses',
      },
      legend: {
        position: 'top' as const, // Valid type
      },
    },
    scales: {
      x: {
        type: 'category' as const, // Explicitly set x-axis type to 'category'
        ticks: {
          align: 'center' as const,
          crossAlign: 'center' as const, // Valid value
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        type: 'linear' as const, // Explicitly set y-axis type to 'linear'
        reverse: false,
        ticks: {
          callback: function (value: number) {
            return `${current_currency}${value}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CurrentBarChart;
