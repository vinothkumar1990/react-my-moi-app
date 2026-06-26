import React, { useEffect, useState } from 'react';
import data from "../assets/mois.json";
import { OrbitProgress } from 'react-loading-indicators';
import "./Home.css";

import { Bar } from 'react-chartjs-2';
import { Doughnut  } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export const Chart = () => {
  const [mois, setMois] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMois(data);
      setLoading(false);
    }, 1000); // simulate loading
    return () => clearTimeout(timer);
  }, []);

  const colorMap = {
  "வினோத் திருமணம்": "rgba(21, 56, 153, 0.7)",    // Red
  "விக்னேஷ் திருமணம்": "rgba(21, 128, 53, 0.7)",   // Blue
  "விஜய் திருமணம்": "rgba(184, 35, 35, 0.7)",     // Teal
  "Others": "rgba(201, 203, 207, 0.7)"               // Grey fallback
};


  // ✅ Filter only pending entries
  const filteredMois = mois.filter(item => item.status === "pending");

  // ✅ Group total new_amount by function name (all)
  const groupedByFunction = mois.reduce((acc, item) => {
    const func = item.function_name || "Others";
    const amount = Number(item.new_amount);
    if (!acc[func]) acc[func] = 0;
    acc[func] += amount;
    return acc;
  }, {});

  // ✅ Group total new_amount by function name (only pending)
  const groupedByPendingFunction = filteredMois.reduce((acc, item) => {
    const func = item.function_name || "Others";
    const amount = Number(item.new_amount);
    if (!acc[func]) acc[func] = 0;
    acc[func] += amount;
    return acc;
  }, {});

 

  // ✅ Chart Data
  const chartData = {
    labels: Object.keys(groupedByFunction),
    datasets: [
      {
        label: 'Total New Amount by Function',
        data: Object.values(groupedByFunction),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };
const pendingLabels = Object.keys(groupedByPendingFunction);
const pendingColors = pendingLabels.map(label =>
  colorMap[label.toLowerCase()] || 'rgba(153, 102, 255, 0.7)' // fallback color
);

  const chartDataPending = {
  labels: pendingLabels,
  datasets: [
    {
      label: 'Total New Amount by Function (Pending only)',
      data: Object.values(groupedByPendingFunction),
      backgroundColor: pendingColors,
      borderColor: pendingColors.map(c => c.replace('0.7', '1')), // make border solid
      borderWidth: 1
    }
  ]
};



  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };



  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <center><OrbitProgress color="#32cd32" size="medium" text="" textColor="" /></center>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center', color: '#0275d8' }}>திருமண விழா - புதிய பணம் (Chart)</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ textAlign: 'center', color: 'rgb(10, 68, 25)' }}>
            திருமண விழா - புதிய பணம் (Pending Status Only)
          </h3>
          <Doughnut data={chartDataPending} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};
