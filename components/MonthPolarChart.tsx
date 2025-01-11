"use client"

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale, 
  ArcElement, 
  Tooltip, 
  Legend
);

const MonthPolarChart = ({ transactions, currency }) => {
  const current_currency = currency === 0 ? '€' : currency === 1 ? '₩' : currency === 2 ? 'KES' : currency === 3 ? '£' : '$';

  // Transform and sort the data
  const output = Object.entries(transactions)
    .map(([date, amount]) => {
      // Parse the date string into a Date object (using the first day of the month)
      const parsedDate = new Date(`${date}-01`);
      
      // Format the date using toLocaleDateString
      const formattedDate = parsedDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' });
      
      return {
        label: formattedDate, // Use as the label for PolarArea chart
        value: Math.abs(amount), // Absolute value for the chart
      };
    })
    .sort((a, b) => new Date(a.label) - new Date(b.label)); // Sort by date

  // Extract labels and data from the output
  const labels = output.map(item => item.label); // Extract formatted dates as labels
  const dataValues = output.map(item => item.value); // Extract values for the chart

  const data = {
    labels, // Labels for each section of the PolarArea chart
    datasets: [
      {
        label: 'Expenses',
        data: dataValues, // Corresponding data values
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ], // Use different colors for each section
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
        text: 'Current month expenses',
      },
    },
  };

  return (
    <div className="relative w-full h-80">
      <PolarArea data={data} options={options}/>
    </div>
  );
};

export default MonthPolarChart;
