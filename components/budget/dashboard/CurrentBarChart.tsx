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

const CurrentBarChart = ({ budgetSummary, currency }) => {
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

  // Extract category labels
  const labels = budgetSummary.map((item) => item.categoryName);

  // Extract datasets
  const budgetData = budgetSummary.map((item) => Number(item.budgetCategory));
  const actualData = budgetSummary.map((item) => Number(item.actualCategory));

  const data = {
    labels,
    datasets: [
      {
        label: 'Budget',
        data: budgetData,
        backgroundColor: '#BFD7EA',
        borderColor: '#5A8EAB',
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: 'Actual',
        data: actualData,
        backgroundColor: '#F3FFF1',
        borderColor: '#50b545',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Budget vs Actual by Category',
      },
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        type: 'linear' as const,
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
