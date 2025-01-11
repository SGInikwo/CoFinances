// @ts-nocheck

'use client';

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
  Filler,
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
  Filler,
);

const ExpensesGraph = ({ transactions, currency }) => {
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
  // Group transactions by date and sum their amounts
  const groupedData = transactions
    .filter((transaction) => {
      const amount = parseFloat(transaction.amount);
      // Include only if the amount is negative and recipient doesn't contain "Revolut"
      // return amount < 0 && !transaction.recipient.includes('Revolut');
      return amount < 0;
    })
    .reduce((acc, transaction) => {
      const date = transaction.date;
      const amount = parseFloat(transaction.amount);

      if (!acc[date]) {
        acc[date] = 0;
      }

      acc[date] += amount; // Add the amount to the total for this date
      return acc;
    }, {});

  // Transform grouped data into the {x, y} format and sort by date
  const result = Object.entries(groupedData)
    .map(([date, amount]) => ({
      x: new Date(date), // Convert to Date object for sorting
      y: amount,
    }))
    .sort((a, b) => a.x - b.x) // Sort by date
    .map(({ x, y }) => ({
      x: x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), // Format date as "2 Jan"
      y: y,
    }));

  const data = {
    datasets: [
      {
        label: 'Monthly Expenses',
        data: result,
        tension: 0.3,
        fill: true,
        borderColor: '#50b545',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            context.chart.height,
          );
          gradient.addColorStop(0, '#50b545'); // Green with opacity
          gradient.addColorStop(1, 'rgba(80, 181, 69, 0)'); // Fully transparent green
          return gradient;
        },
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Expenses Over Time',
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
        grid: {
          drawOnChartArea: false, // Disable vertical grid lines
        },
      },
      y: {
        max: 0,
        reverse: true, // Invert the y-axis
        title: {
          display: true,
          text: 'Expenses',
        },
        ticks: {
          callback: function (value) {
            return `${current_currency}${value}`; // Add a "£" prefix to the Y-axis labels
          },
        },
      },
    },
    animation: {
      duration: 240, // Animation duration in milliseconds
      easing: 'easeInElastic', // Adjust easing here
    },
  };
  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default ExpensesGraph;
