import React, { useContext, useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement, // Required for points on the line
  Tooltip,
  Legend,
} from "chart.js";
import { AppContent } from '../Context/AppContext';
import axios from "axios";

// Register the required Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = () => {
  const [transactions, setTransactions] = useState([])
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)

  const {backendUrl, userData} = useContext(AppContent);

  useEffect(() => {
    const fetchData = async () => {
      const {data} = await axios.get(backendUrl + "/api/trans/get-trans/" + userData.name);
      setTransactions(data);
    }

    fetchData();
  }, []);

  // Calculate income, expense, and savings whenever transactions change
      useEffect(() => {
        const calculateTotals = () => {
            let totalIncome = 0;
            let totalExpense = 0;

            transactions.forEach((transaction) => {
                if (transaction.type === "income") {
                    totalIncome += transaction.amount;
                } else if (transaction.type === "expense") {
                    totalExpense += transaction.amount;
                }
            });

            setIncome(totalIncome);
            setExpense(totalExpense);
        };

        calculateTotals();
    }, [transactions]);

  const data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Monthly Expenses",
        data: [0 , expense],
        borderColor: "red",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Monthly Income",
        data: [0, income],
        borderColor: "#66BB6A",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "600px", height: "300px" }}>
        <Line data={data} options={options} />
      </div>
  );
};

export default LineChart;
