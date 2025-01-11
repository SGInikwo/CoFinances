"use client"

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
  Legend
);

const CurrentBarChart = ({ transactions, currency }) => {
  const current_currency = currency === 0 ? '€' : currency === 1 ? '₩' : currency === 2 ? 'KES' : currency === 3 ? '£' : '$';

  const groupedTransactions = transactions
  .filter(item => item.amount < 0) // Filter expenses
  .reduce((acc, item) => {
    const formattedDate = new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    if (!acc[formattedDate]) {
      acc[formattedDate] = 0;
    }
    acc[formattedDate] += Math.abs(item.amount); // Use absolute values
    return acc;
  }, {});

// Convert grouped data to an array of objects and sort by date
const orderedTransactions = Object.entries(groupedTransactions)
  .map(([date, amount]) => ({ x: date, y: amount })) // Convert to array of objects
  .sort((a, b) => {
    const dateA = new Date(a.x.split(' ').reverse().join(' ')); // Convert '1 Jan' to 'Jan 1'
    const dateB = new Date(b.x.split(' ').reverse().join(' '));
    return dateA - dateB; // Sort by ascending date
  });

  const data = {
    datasets: [
      {
        label: 'Expenses',
        data: orderedTransactions,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Current month expenses',
      },
    },
    scales: {
      x: {
        ticks: {
          align: 'center', // Center align the labels
          crossAlign: 'center', // Ensure alignment relative to the axis
          maxRotation: 0, // No rotation
          minRotation: 0, // No rotation
        },
      },
      y: {
        reverse: false,
        ticks: {
          callback: function (value) {
            return `${current_currency}-${value}`; // Add currency prefix to the Y-axis labels
          },
        },
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options}/>
    </div>
  );
};

export default CurrentBarChart;
