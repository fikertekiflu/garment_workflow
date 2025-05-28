import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaFileAlt,          // General report icon
  FaCalendarAlt,      // For date selection
  FaSearch,           // For filtering/searching
  FaChartLine,        // For line charts
  FaChartBar,         // For bar charts
  FaChartPie,         // For pie charts
  FaTable,            // For tabular data
  FaDownload,         // For download button
  FaPrint,            // For print button
  FaFilter,           // For filter button
  FaListAlt,          // Another general report icon
  FaHourglassHalf,    // For in-progress or pending reports
  FaCheckCircle,      // For completed reports
} from 'react-icons/fa'; // All icons from Font Awesome for consistency

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
import { Bar, Line, Pie } from 'react-chartjs-2';

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

// --- Mock Data for Reports ---
const mockDailyProductionData = [
  { date: '2025-05-25', totalGarments: 1500, qualityPass: 1450, defects: 50, wasteKg: 150 },
  { date: '2025-05-26', totalGarments: 1600, qualityPass: 1560, defects: 40, wasteKg: 140 },
  { date: '2025-05-27', totalGarments: 1450, qualityPass: 1400, defects: 50, wasteKg: 160 },
];

const mockMonthlySummaryData = [
  { month: 'Jan 2025', production: 35000, waste: 4500, utilization: 82, avgDefectRate: 3.5 },
  { month: 'Feb 2025', production: 32000, waste: 4000, utilization: 83, avgDefectRate: 3.2 },
  { month: 'Mar 2025', production: 38000, waste: 4800, utilization: 84, avgDefectRate: 3.0 },
  { month: 'Apr 2025', production: 36000, waste: 4200, utilization: 85, avgDefectRate: 2.8 },
  { month: 'May 2025', production: 33000, waste: 3900, utilization: 86, avgDefectRate: 2.5 },
];

const mockWasteBreakdownData = {
  labels: ['Fabric Defects', 'Marker Errors', 'End Bits', 'Cutting Errors', 'Other'],
  data: [1200, 800, 600, 400, 300], // KG for a selected period
  backgroundColor: [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
  ],
  borderColor: [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
  ],
  borderWidth: 1,
};


const CuttingManagerReports = () => {
  const [activeTab, setActiveTab] = useState('dailyProduction');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Chart options (can be customized per chart type)
  const commonChartOptions = {
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
              label += context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(100, 100, 100, 0.2)' },
      },
      y: {
        ticks: { color: '#94a3b8' },
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
        position: 'right',
        labels: {
          color: '#e2e8f0',
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

  // Render content based on activeTab
  const renderReportContent = () => {
    switch (activeTab) {
      case 'dailyProduction': { // Added opening brace here
        const dailyProductionChartData = {
          labels: mockDailyProductionData.map(d => d.date),
          datasets: [
            {
              label: 'Total Garments Produced',
              data: mockDailyProductionData.map(d => d.totalGarments),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.4,
              fill: false,
            },
            {
              label: 'Quality Pass',
              data: mockDailyProductionData.map(d => d.qualityPass),
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              tension: 0.4,
              fill: false,
            }
          ],
        };
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
              <FaChartLine className="mr-2" /> Daily Production Overview
            </h3>
            <div className="h-96">
              <Line data={dailyProductionChartData} options={commonChartOptions} />
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-200 flex items-center">
                <FaTable className="mr-2" /> Raw Data
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Date</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Total Garments</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Quality Pass</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Defects</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Waste (Kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDailyProductionData.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'}>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.date}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.totalGarments.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.qualityPass.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.defects.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.wasteKg.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );
      } // Added closing brace here

      case 'monthlySummary': { // Added opening brace here
        const monthlySummaryChartData = {
          labels: mockMonthlySummaryData.map(d => d.month),
          datasets: [
            {
              label: 'Production (Units)',
              data: mockMonthlySummaryData.map(d => d.production),
              backgroundColor: 'rgba(75, 192, 192, 0.8)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Waste (Kg)',
              data: mockMonthlySummaryData.map(d => d.waste),
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            }
          ],
        };
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
              <FaChartBar className="mr-2" /> Monthly Performance Summary
            </h3>
            <div className="h-96">
              <Bar data={monthlySummaryChartData} options={commonChartOptions} />
            </div>
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3 text-gray-200 flex items-center">
                <FaTable className="mr-2" /> Key Metrics
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Month</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Production</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Waste (Kg)</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Utilization (%)</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Avg. Defect Rate (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMonthlySummaryData.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'}>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.month}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.production.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.waste.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.utilization.toFixed(1)}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.avgDefectRate.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );
      } // Added closing brace here

      case 'wasteReports': { // Added opening brace here
        const wasteBreakdownChartData = {
          labels: mockWasteBreakdownData.labels,
          datasets: [
            {
              label: 'Waste Reasons (KG)',
              data: mockWasteBreakdownData.data,
              backgroundColor: mockWasteBreakdownData.backgroundColor,
              borderColor: mockWasteBreakdownData.borderColor,
              borderWidth: mockWasteBreakdownData.borderWidth,
            },
          ],
        };
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
              <FaChartPie className="mr-2" /> Waste Breakdown by Reason
            </h3>
            <div className="h-96 w-full max-w-lg">
              <Pie data={wasteBreakdownChartData} options={pieChartOptions} />
            </div>
            <div className="mt-6 w-full">
              <h4 className="text-lg font-semibold mb-3 text-gray-200 flex items-center">
                <FaTable className="mr-2" /> Waste Details
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Waste Reason</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Waste Amount (Kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockWasteBreakdownData.labels.map((label, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'}>
                        <td className="py-3 px-4 text-sm text-gray-300">{label}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{mockWasteBreakdownData.data[index].toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );
      } // Added closing brace here

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 text-center text-gray-400"
          >
            <FaListAlt className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl">Select a report type from the tabs above.</p>
          </motion.div>
        );
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
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Production & Waste Reports</h1>
          <p className="text-lg text-gray-400 mt-1">Generate and view various reports on production efficiency, quality, and waste.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FaDownload className="w-4 h-4 mr-2" /> Export Report
          </button>
          <button
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FaPrint className="w-4 h-4 mr-2" /> Print Report
          </button>
        </div>
      </motion.div>

      {/* Report Tabs */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        <button
          className={`py-2 px-4 rounded-lg font-medium transition duration-200 ${
            activeTab === 'dailyProduction'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('dailyProduction')}
        >
          <FaCalendarAlt className="inline-block mr-2" /> Daily Production
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-medium transition duration-200 ${
            activeTab === 'monthlySummary'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('monthlySummary')}
        >
          <FaChartBar className="inline-block mr-2" /> Monthly Summary
        </button>
        <button
          className={`py-2 px-4 rounded-lg font-medium transition duration-200 ${
            activeTab === 'wasteReports'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setActiveTab('wasteReports')}
        >
          <FaChartPie className="inline-block mr-2" /> Waste Reports
        </button>
        {/* Add more tabs as needed, e.g., 'costReports', 'qualityReports' */}
      </motion.div>

      {/* Report Content Area */}
      <motion.div variants={itemVariants}>
        {/* Date Filters and Search (Optional - can be integrated per report type) */}
        {/* <div className="flex items-center gap-4 mb-6 p-4 bg-gray-800/70 rounded-xl border border-gray-700/60">
          <FaCalendarAlt className="text-gray-400 w-5 h-5" />
          <input
            type="date"
            className="bg-gray-700 text-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span className="text-gray-300">-</span>
          <input
            type="date"
            className="bg-gray-700 text-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
            <FaFilter className="mr-2" /> Apply Filters
          </button>
        </div> */}

        {renderReportContent()}
      </motion.div>
    </motion.div>
  );
};

export default CuttingManagerReports;