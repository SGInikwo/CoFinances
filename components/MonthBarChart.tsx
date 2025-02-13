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

const MonthBarChart = ({ transactions, currency }) => {
  if (!transactions || typeof transactions !== 'object') {
    return <p>No transaction data available.</p>; // Handle missing data gracefully
  }
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

  // Transform and sort the data
  const output = Object.entries(transactions)
    .map(([date, amount]) => {
      // Parse the date string into a Date object (using the first day of the month)
      const parsedDate = new Date(`${date}-01`);

      // Format the date using toLocaleDateString
      const formattedDate = parsedDate.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
      });

      return {
        x: formattedDate, // Formatted as 'Nov 2024' or similar
        y: Math.abs(amount), // Use the absolute value for y
        date: parsedDate, // Include the Date object for sorting
      };
    })
    .sort((a, b) => a.date - b.date) // Sort by the Date object
    .map(({ x, y }) => ({ x, y })); // Remove the 'date' field after sorting

  const data = {
    datasets: [
      {
        label: 'Expenses',
        data: output,
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
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Last 5 month expenses',
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
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthBarChart;
