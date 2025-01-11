"use client"

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ExpensesCompareGraph = ({ transactions, currency }) => {
  const current_currency = currency === 0 ? '€' : currency === 1 ? '₩' : currency === 2 ? 'KES' : currency === 3 ? '£' : '$';

  const groupedTransactions = transactions
  .filter(item => item.amount > 0) // Filter expenses
  .reduce((acc, item) => {
    const formattedDate = new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const existingEntry = acc.find(entry => entry.x === formattedDate);

    if (existingEntry) {
      existingEntry.y += Math.abs(item.amount); // Sum amounts
    } else {
      acc.push({ x: formattedDate, y: Math.abs(item.amount) }); // Create new entry
    }

    return acc;
  }, [])
  .sort((a, b) => {
    const dateA = new Date(a.x.split(' ').reverse().join(' ')); // Convert '1 Jan' to 'Jan 1'
    const dateB = new Date(b.x.split(' ').reverse().join(' ')); 
    return dateA - dateB; // Sort by ascending date
  });

  const groupedTransactions2 = transactions
  .filter(item => item.amount < 0) // Filter expenses
  .reduce((acc, item) => {
    const formattedDate = new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const existingEntry = acc.find(entry => entry.x === formattedDate);

    if (existingEntry) {
      existingEntry.y += Math.abs(item.amount); // Sum amounts
    } else {
      acc.push({ x: formattedDate, y: Math.abs(item.amount) }); // Create new entry
    }

    return acc;
  }, [])
  .sort((a, b) => {
    const dateA = new Date(a.x.split(' ').reverse().join(' ')); // Convert '1 Jan' to 'Jan 1'
    const dateB = new Date(b.x.split(' ').reverse().join(' ')); 
    return dateA - dateB; // Sort by ascending date
  });

  const allDates = [
    ...groupedTransactions.map(item => item.x), 
    ...groupedTransactions2.map(item => item.x)
  ];
  
  // Remove duplicates and sort the combined dates
  const combinedDates = [...new Set(allDates)]
    .sort((a, b) => {
      const dateA = new Date(a.split(' ').reverse().join(' ')); // Convert '1 Jan' to 'Jan 1'
      const dateB = new Date(b.split(' ').reverse().join(' '));
      return dateA - dateB; // Sort by ascending date
    });

  const data = {
    datasets: [
      {
        label: 'Income',
        data: groupedTransactions,
        borderColor: '#50b545',
        backgroundColor: '#50b545',
        fill: false,
      },
      {
        label: 'Expenses',
        data: groupedTransactions2,
        borderColor: 'red',
        backgroundColor: 'red',
        fill: false,
      },
    ],
    labels: combinedDates,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Income and Expenses graph',
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
        grid: {
          drawOnChartArea: false, // Disable vertical grid lines
        },
      },
      y: {
        reverse: false,
        ticks: {
          callback: function (value) {
            return `${current_currency}${value}`; // Add currency prefix to the Y-axis labels
          },
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options}/>
    </div>
  );
};

export default ExpensesCompareGraph;
