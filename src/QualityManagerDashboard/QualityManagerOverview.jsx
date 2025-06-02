import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,      // Trend icon
  FaCheckCircle,    // Passed icon
  FaExclamationTriangle, // Defects icon
  FaClipboardCheck, // Inspection icon
  FaCalendarAlt,    // Date filter
  FaInfoCircle,     // Info icon
  FaSpinner,        // Loading/placeholder
  FaChartBar,       // Bar chart
  FaChartPie,       // Pie chart
  FaCogs,           // Overall metrics
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- Mock Data ---
// Simplified mock data for overview (actual data comes from InspectionLog)
const mockQualitySummary = [
  { date: '2025-05-27', totalInspected: 1500, totalPassed: 1420, totalRejected: 30, totalRework: 50 },
  { date: '2025-05-28', totalInspected: 1450, totalPassed: 1380, totalRejected: 25, totalRework: 45 },
  { date: '2025-05-29', totalInspected: 1600, totalPassed: 1530, totalRejected: 35, totalRework: 35 },
  { date: '2025-05-30', totalInspected: 1550, totalPassed: 1490, totalRejected: 20, totalRework: 40 },
  { date: '2025-05-31', totalInspected: 1400, totalPassed: 1350, totalRejected: 20, totalRework: 30 },
  { date: '2025-06-01', totalInspected: 1650, totalPassed: 1580, totalRejected: 25, totalRework: 45 },
];

const mockTopDefects = [
  { type: 'Stitching Error', count: 120 },
  { type: 'Fabric Snag', count: 60 },
  { type: 'Button Missing', count: 40 },
  { type: 'Incorrect Measurement', count: 35 },
  { type: 'Print Misalignment', count: 25 },
];

const QualityManagerOverview = () => {
  const [summaryData, setSummaryData] = useState(mockQualitySummary);
  const [topDefectsData, setTopDefectsData] = useState(mockTopDefects);
  const [filterStartDate, setFilterStartDate] = useState('2025-05-27');
  const [filterEndDate, setFilterEndDate] = useState('2025-06-01');

  // Filter data based on date range
  const filteredSummary = summaryData.filter(item => {
    return item.date >= filterStartDate && item.date <= filterEndDate;
  });

  // --- KPI Calculations ---
  const totalInspectedUnits = filteredSummary.reduce((sum, item) => sum + item.totalInspected, 0);
  const totalPassedUnits = filteredSummary.reduce((sum, item) => sum + item.totalPassed, 0);
  const totalRejectedUnits = filteredSummary.reduce((sum, item) => sum + item.totalRejected, 0);
  const totalReworkUnits = filteredSummary.reduce((sum, item) => sum + item.totalRework, 0);

  const overallPassRate = totalInspectedUnits > 0
    ? ((totalPassedUnits / totalInspectedUnits) * 100).toFixed(1)
    : '0.0';

  const overallDefectRate = totalInspectedUnits > 0
    ? (((totalRejectedUnits + totalReworkUnits) / totalInspectedUnits) * 100).toFixed(1)
    : '0.0';

  // --- Chart Data for Quality Trend (Line Chart) ---
  const trendLabels = filteredSummary.map(item => item.date).sort();
  const passRates = trendLabels.map(date => {
    const item = filteredSummary.find(d => d.date === date);
    return item && item.totalInspected > 0 ? ((item.totalPassed / item.totalInspected) * 100) : 0;
  });
  const defectRates = trendLabels.map(date => {
    const item = filteredSummary.find(d => d.date === date);
    return item && item.totalInspected > 0 ? (((item.totalRejected + item.totalRework) / item.totalInspected) * 100) : 0;
  });

  const qualityTrendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Pass Rate (%)',
        data: passRates,
        borderColor: 'rgb(0, 178, 178)', // Teal color
        backgroundColor: 'rgba(0, 178, 178, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Defect Rate (%)',
        data: defectRates,
        borderColor: 'rgb(255, 99, 132)', // Red for defects
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0', // Tailwind gray-200
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(1) + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' }, // Tailwind gray-400
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage (%)',
          color: '#e2e8f0'
        }
      },
    },
  };

  // --- Chart Data for Top Defect Categories (Doughnut Chart) ---
  const defectLabels = topDefectsData.map(d => d.type);
  const defectCounts = topDefectsData.map(d => d.count);

  const topDefectsChartData = {
    labels: defectLabels,
    datasets: [
      {
        data: defectCounts,
        backgroundColor: [
          'rgba(0, 178, 178, 0.7)',  // Teal
          'rgba(255, 99, 132, 0.7)', // Red
          'rgba(255, 206, 86, 0.7)', // Yellow
          'rgba(54, 162, 235, 0.7)', // Blue
          'rgba(153, 102, 255, 0.7)',// Purple
          'rgba(255, 159, 64, 0.7)', // Orange
        ],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e2e8f0',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
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
          <h1 className="text-3xl font-semibold tracking-tight">Quality Manager Overview</h1>
          <p className="text-lg text-gray-400 mt-1">Key quality performance indicators and trends at a glance.</p>
        </div>
      </motion.div>

      {/* Date Filters */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaCalendarAlt className="text-gray-400" />
          <label htmlFor="start-date" className="sr-only">Start Date</label>
          <input
            type="date"
            id="start-date"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaCalendarAlt className="text-gray-400" />
          <label htmlFor="end-date" className="sr-only">End Date</label>
          <input
            type="date"
            id="end-date"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Summary KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaClipboardCheck className="w-8 h-8 text-teal-400 mb-3" />
          <p className="text-sm text-gray-400">Total Units Inspected</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{totalInspectedUnits.toLocaleString()}</h2>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaCheckCircle className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-sm text-gray-400">Overall Pass Rate</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{overallPassRate}%</h2>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaExclamationTriangle className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-sm text-gray-400">Overall Defect Rate</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{overallDefectRate}%</h2>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaCogs className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-sm text-gray-400">Total Defects Reported</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{(totalRejectedUnits + totalReworkUnits).toLocaleString()}</h2>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trend Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartLine className="mr-2" /> Quality Performance Trend</h3>
          <div className="h-80">
            {trendLabels.length > 0 ? (
              <Line data={qualityTrendChartData} options={chartOptions} />
            ) : (
              <div className="text-center text-gray-500 flex items-center justify-center h-full">No quality trend data for selected period.</div>
            )}
          </div>
        </motion.div>

        {/* Top Defect Categories Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartPie className="mr-2" /> Top Defect Categories</h3>
          <div className="h-80 flex items-center justify-center">
            {defectLabels.length > 0 ? (
              <Doughnut data={topDefectsChartData} options={doughnutChartOptions} />
            ) : (
              <div className="text-center text-gray-500">No defect data available.</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Inspections (Summary Table) */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
          <FaClipboardCheck className="mr-2" /> Recent Inspection Summary
        </h3>
        {filteredSummary.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Inspected Units</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Passed Units</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Rejected Units</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Rework Units</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Pass Rate (%)</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Defect Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummary.map((record, index) => (
                  <tr key={record.date} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'}>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.totalInspected.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.totalPassed.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.totalRejected.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.totalRework.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {record.totalInspected > 0 ? ((record.totalPassed / record.totalInspected) * 100).toFixed(1) : '0.0'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {record.totalInspected > 0 ? (((record.totalRejected + record.totalRework) / record.totalInspected) * 100).toFixed(1) : '0.0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <FaInfoCircle className="w-12 h-12 mx-auto mb-3" />
            <p>No quality summary data found for the selected period.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QualityManagerOverview;