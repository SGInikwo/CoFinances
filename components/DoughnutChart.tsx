'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Title, Legend);

const DoughnutChart = ({ transactions, currency }) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return <p>No transaction data available.</p>; // Handle empty transactions gracefully
  }
  // Extract recipients and amounts from transactions
  const recipientsAndAmounts = transactions.map((item) => ({
    recipient: item.recipient,
    amount: item.amount, // Use absolute values for chart data
  }));
  const date = new Date(transactions[0]?.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
  });

  // Map the recipients and amounts into separate arrays
  const labels = recipientsAndAmounts.map((item) => item.recipient);
  const amounts = recipientsAndAmounts.map((item) => item.amount);

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
    datasets: [
      {
        label: 'Banks',
        data: amounts,
        backgroundColor: colors,
      },
    ],
    labels: labels,
  };

  const options = {
    // cutout: "60%",
    plugins: {
      title: {
        display: true,
        text: `Day most spend: ${date}`,
      },
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
