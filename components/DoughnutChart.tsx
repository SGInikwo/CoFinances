"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Title, Legend);

const DoughnutChart = ({ transactions, currency }) => {
  // Extract recipients and amounts from transactions
  const recipientsAndAmounts = transactions.map(item => ({
    recipient: item.recipient,
    amount: item.amount // Use absolute values for chart data
  }));
  const date = new Date(transactions[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })

  console.log(date)
  // Map the recipients and amounts into separate arrays
  const labels = recipientsAndAmounts.map(item => item.recipient);
  const amounts = recipientsAndAmounts.map(item => item.amount);

  // console.log("Recipients:", labels);
  // console.log("Amounts:", amounts);

  const data = {
    datasets: [
      {
        label: "Banks",
        data: amounts,
        backgroundColor: ["#0747b6", "#2265d8", "#2f91fa"],
      },
    ],
    labels: labels,
  };

  const options = {
    // cutout: "60%",
    plugins: {
      title: {
        display: true,
        text: `Day most spend: ${date}`
      },
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
