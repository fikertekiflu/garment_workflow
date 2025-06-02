import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaTachometerAlt,    // Overall performance/efficiency
  FaTools,            // Active lines
  FaChartLine,        // Production trend
  FaCheckCircle,      // Quality pass rate
  FaExclamationTriangle, // Defect rate
  FaChartBar,         // Utilization
  FaUsers,            // Workforce
  FaHourglassHalf,    // OEE (Overall Equipment Effectiveness)
  FaListAlt,  
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

// --- Mock Data for Production Overview ---
const mockProductionData = [
  { date: '2025-05-27', unitsProduced: 15000, defectRate: 3.2, utilization: 88, oee: 75 },
  { date: '2025-05-28', unitsProduced: 15500, defectRate: 3.0, utilization: 89, oee: 76 },
  { date: '2025-05-29', unitsProduced: 14800, defectRate: 3.5, utilization: 87, oee: 73 },
  { date: '2025-05-30', unitsProduced: 16000, defectRate: 2.8, utilization: 90, oee: 78 },
  { date: '2025-05-31', unitsProduced: 15200, defectRate: 3.1, utilization: 88, oee: 74 },
];

const ProductionManagerOverview = () => {
  const [data, setData] = useState(mockProductionData);

  // Calculate current/latest metrics
  const latestData = data[data.length - 1];
  const totalUnitsThisPeriod = data.reduce((sum, item) => sum + item.unitsProduced, 0);
  const averageDefectRate = (data.reduce((sum, item) => sum + item.defectRate, 0) / data.length).toFixed(1);
  const averageOEE = (data.reduce((sum, item) => sum + item.oee, 0) / data.length).toFixed(1);

  // Chart Data: Units Produced Trend
  const unitsProducedChartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Units Produced',
        data: data.map(item => item.unitsProduced),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chart Data: Defect Rate Trend
  const defectRateChartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Defect Rate (%)',
        data: data.map(item => item.defectRate),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        tension: 0.4,
        fill: true,
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
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toLocaleString() + (label.includes('%') ? '%' : '');
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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Production Manager Dashboard</h1>
          <p className="text-lg text-gray-400 mt-1">Real-time insights into your production floor performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
            <FaTachometerAlt className="w-4 h-4 mr-2" /> View Full Dashboard
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaChartLine className="w-8 h-8 text-indigo-400 mb-3" />
          <p className="text-sm text-gray-400">Total Units (This Period)</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{totalUnitsThisPeriod.toLocaleString()}</h2>
          <span className="text-xs mt-2 px-2 py-1.5 rounded-md bg-indigo-600/30 text-indigo-300">
            On track
          </span>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaExclamationTriangle className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-sm text-gray-400">Avg. Defect Rate</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{averageDefectRate}%</h2>
          <span className={`text-xs mt-2 px-2 py-1.5 rounded-md ${averageDefectRate < 3.0 ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
            {averageDefectRate < 3.0 ? 'Below Target' : 'Above Target'}
          </span>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaHourglassHalf className="w-8 h-8 text-teal-400 mb-3" />
          <p className="text-sm text-gray-400">Average OEE</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{averageOEE}%</h2>
          <span className={`text-xs mt-2 px-2 py-1.5 rounded-md ${averageOEE > 70 ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300'}`}>
            {averageOEE > 70 ? 'Achieving Target' : 'Needs Improvement'}
          </span>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaTools className="w-8 h-8 text-yellow-400 mb-3" />
          <p className="text-sm text-gray-400">Active Production Lines</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">8 / 10</h2>
          <span className="text-xs mt-2 px-2 py-1.5 rounded-md bg-yellow-600/30 text-yellow-300">
            2 lines down for maintenance
          </span>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Units Produced Trend Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartLine className="mr-2" /> Units Produced Trend</h3>
          <div className="h-80">
            <Line data={unitsProducedChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Defect Rate Trend Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaExclamationTriangle className="mr-2" /> Defect Rate Trend</h3>
          <div className="h-80">
            <Line data={defectRateChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity/Alerts Section */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
          <FaListAlt className="mr-2" /> Recent Production Activities & Alerts
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
            <FaCheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-100">Line 3: Exceeded daily target by 5% on Style X.</p>
              <p className="text-sm text-gray-400">Reported by Supervisor A, 2025-05-31 17:30</p>
            </div>
          </li>
          <li className="flex items-start bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
            <FaExclamationTriangle className="text-orange-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-100">Alert: Defect rate on Line 5 increased to 4.5% (above threshold).</p>
              <p className="text-sm text-gray-400">Automated System Alert, 2025-05-31 14:15</p>
            </div>
          </li>
          <li className="flex items-start bg-gray-700/50 p-4 rounded-lg border border-gray-600/50">
            <FaHourglassHalf className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-100">Line 2: Machine downtime for 30 mins due to motor issue.</p>
              <p className="text-sm text-gray-400">Reported by Technician B, 2025-05-30 10:00</p>
            </div>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default ProductionManagerOverview;