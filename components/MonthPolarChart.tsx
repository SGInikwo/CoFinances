// @ts-nocheck

'use client';

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const MonthPolarChart = ({ transactions, currency }) => {
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
        label: formattedDate, // Use as the label for PolarArea chart
        value: Math.abs(amount), // Absolute value for the chart
      };
    })
    .sort((a, b) => new Date(a.label) - new Date(b.label)); // Sort by date

  // Extract labels and data from the output
  const labels = output.map((item) => item.label); // Extract formatted dates as labels
  const dataValues = output.map((item) => item.value); // Extract values for the chart

  const colors = [
    '#50b545', // Base Green
    '#F3FFF1', // Base Light Green
    '#74d66d', // Light Green
    '#37a137', // Darker Green
    '#c6f4c6', // Pastel Green
    '#f8ffe6', // Soft Yellow-Green
    '#b54550', // Muted Red
    '#ff595e', // Vibrant Coral
    '#ffe4e6', // Soft Pink
    '#5e72b5', // Blue with Purple Hints
    '#ffffff', // White
    '#e6e6e6', // Light Gray
    '#3d3d3d', // Charcoal Gray
    '#f5e7c8', // Beige
    '#f7b53b', // Golden Yellow
    '#6b5cf7', // Bright Indigo
    '#ffa500', // Vibrant Orange
    '#87ceeb', // Sky Blue
    '#ffd700', // Golden Yellow
    '#a0522d', // Earthy Brown
    '#6495ed', // Cornflower Blue
  ];

  const data = {
    labels, // Labels for each section of the PolarArea chart
    datasets: [
      {
        label: 'Expenses',
        data: dataValues, // Corresponding data values
        backgroundColor: colors, // Use different colors for each section
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to fill its container
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 3 expenses of the last 5 month',
      },
    },
  };

  return (
    <div className="relative w-full h-80">
      <PolarArea data={data} options={options} />
    </div>
  );
};

export default MonthPolarChart;
