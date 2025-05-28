import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartBar,
  FaChartPie,
  FaTachometerAlt, // Changed from FaGauge
  FaLeaf,
  FaRecycle,
  FaDollarSign,
  FaSyncAlt,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';

import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// --- Mock Data for Efficiency & Waste ---
const mockEfficiencyData = [
  {
    date: '2025-01',
    fabricConsumedKg: 12000,
    fabricWasteKg: 1800,
    utilizationRate: 85, // %
    wasteByReason: { defects: 600, markerErrors: 400, endBits: 500, other: 300 },
  },
  {
    date: '2025-02',
    fabricConsumedKg: 11500,
    fabricWasteKg: 1600,
    utilizationRate: 86,
    wasteByReason: { defects: 550, markerErrors: 350, endBits: 450, other: 250 },
  },
  {
    date: '2025-03',
    fabricConsumedKg: 13000,
    fabricWasteKg: 1950,
    utilizationRate: 85,
    wasteByReason: { defects: 700, markerErrors: 450, endBits: 500, other: 300 },
  },
  {
    date: '2025-04',
    fabricConsumedKg: 12500,
    fabricWasteKg: 1500,
    utilizationRate: 88, // Improved
    wasteByReason: { defects: 400, markerErrors: 300, endBits: 500, other: 300 },
  },
  {
    date: '2025-05', // Current month
    fabricConsumedKg: 10000,
    fabricWasteKg: 1300,
    utilizationRate: 87,
    wasteByReason: { defects: 450, markerErrors: 250, endBits: 400, other: 200 },
  },
];

const CuttingEfficiencyWaste = () => {
  const [data, setData] = useState(mockEfficiencyData);
  const [selectedPeriod, setSelectedPeriod] = useState('All Time'); // Could be 'Monthly', 'Quarterly' etc.
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calculate aggregated data for summary cards
  const totalFabricConsumed = data.reduce((sum, item) => sum + item.fabricConsumedKg, 0);
  const totalFabricWaste = data.reduce((sum, item) => sum + item.fabricWasteKg, 0);
  const averageUtilizationRate = (totalFabricConsumed > 0)
    ? ((totalFabricConsumed - totalFabricWaste) / totalFabricConsumed * 100).toFixed(2)
    : 0;
  const costPerKgWaste = 5; // Example: $5 per KG of waste fabric
  const estimatedCostOfWaste = (totalFabricWaste * costPerKgWaste).toLocaleString();

  // Chart Data preparation
  const utilizationChartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Fabric Utilization Rate (%)',
        data: data.map(item => item.utilizationRate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const wasteChartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Total Fabric Waste (KG)',
        data: data.map(item => item.fabricWasteKg),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const currentMonthWasteReasons = data[data.length - 1]?.wasteByReason || {};
  const wasteReasonsPieChartData = {
    labels: Object.keys(currentMonthWasteReasons).map(key => {
      switch(key) {
        case 'defects': return 'Fabric Defects';
        case 'markerErrors': return 'Marker Errors';
        case 'endBits': return 'End Bits / Remnants';
        case 'other': return 'Other';
        default: return key;
      }
    }),
    datasets: [
      {
        label: 'Waste Reasons (KG)',
        data: Object.values(currentMonthWasteReasons),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0', // Tailwind gray-200
        },
      },
      title: {
        display: false, // Title moved to h3
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString() + (context.dataset.label.includes('%') ? '%' : ' KG');
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' }, // Tailwind gray-400
        grid: { color: 'rgba(100, 100, 100, 0.2)' },
      },
      y: {
        ticks: { color: '#94a3b8' }, // Tailwind gray-400
        grid: { color: 'rgba(100, 100, 100, 0.2)' },
        beginAtZero: true,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right', // Place legend on the right for pie chart
        labels: {
          color: '#e2e8f0', // Tailwind gray-200
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += context.parsed.toLocaleString() + ' KG';
            }
            return label;
          }
        }
      }
    }
  };


  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 text-white font-sans p-8"
    >
      {/* Header with Title and Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Efficiency & Waste</h1>
          <p className="text-lg text-gray-400 mt-1">Monitor cutting department performance and material utilization.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FaSyncAlt className="w-4 h-4 mr-2" /> Refresh Data
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaTachometerAlt className="w-8 h-8 text-teal-400 mb-3" /> {/* Changed to FaTachometerAlt */}
          <p className="text-sm text-gray-400">Avg. Utilization Rate</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{averageUtilizationRate}%</h2>
          <span className={`text-xs mt-2 px-2 py-0.5 rounded-full ${averageUtilizationRate >= 85 ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300'}`}>
            {averageUtilizationRate >= 85 ? <FaArrowUp className="inline-block mr-1" /> : <FaArrowDown className="inline-block mr-1" />} Target 85%+
          </span>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaRecycle className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-sm text-gray-400">Total Fabric Waste</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{totalFabricWaste.toLocaleString()} KG</h2>
          <span className="text-xs mt-2 px-2 py-0.5 rounded-full bg-red-600/30 text-red-300">
            Higher than target
          </span>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaDollarSign className="w-8 h-8 text-yellow-400 mb-3" />
          <p className="text-sm text-gray-400">Estimated Cost of Waste</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">${estimatedCostOfWaste}</h2>
          <span className="text-xs mt-2 px-2 py-0.5 rounded-full bg-yellow-600/30 text-yellow-300">
            Impacts profitability
          </span>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaLeaf className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-sm text-gray-400">Sustainability Impact</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">Reduced Landfill</h2>
          <span className="text-xs mt-2 px-2 py-0.5 rounded-full bg-green-600/30 text-green-300">
            Positive environmental effect
          </span>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Rate Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartBar className="mr-2" /> Fabric Utilization Rate Trend</h3>
          <div className="h-80"> {/* Fixed height for chart */}
            <Line data={utilizationChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Total Waste Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaRecycle className="mr-2" /> Total Fabric Waste Trend</h3>
          <div className="h-80"> {/* Fixed height for chart */}
            <Bar data={wasteChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Waste Reasons Pie Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6 lg:col-span-2 flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartPie className="mr-2" /> Breakdown of Waste Reasons (Current Period)</h3>
          <div className="h-96 w-full max-w-lg"> {/* Fixed height and max-width for pie chart */}
            <Pie data={wasteReasonsPieChartData} options={pieChartOptions} />
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default CuttingEfficiencyWaste;