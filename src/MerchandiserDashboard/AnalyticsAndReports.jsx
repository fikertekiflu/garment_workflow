// src/MerchandiserDashboard/AnalyticsAndReports.jsx

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaFilePdf,
  FaFileCsv,
  FaTachometerAlt, // For KPIs
  FaCalendarAlt,   // For date ranges
  FaLightbulb,     // For insights
  FaCheckCircle,   // For success/on-time
  FaClock,         // For lead time
  FaExclamationTriangle, // For issues/defects
  FaShippingFast
} from 'react-icons/fa';

// --- Mock Data for Analytics & Reports ---
// This data would typically be derived from processing data from other modules
const mockAnalyticsData = {
  kpis: {
    onTimeDeliveryRate: 92, // %
    averageProductionLeadTime: 28, // days
    defectRate: 1.5, // %
    sampleApprovalRate: 85, // %
    totalOrdersCompleted: 75,
    pendingShipments: 3
  },
  productionEfficiency: [
    { month: 'Jan', target: 8000, actual: 7800 },
    { month: 'Feb', target: 8500, actual: 8200 },
    { month: 'Mar', target: 9000, actual: 9100 },
    { month: 'Apr', target: 9200, actual: 8800 },
    { month: 'May', target: 9500, actual: 9600 },
    { month: 'Jun', target: 9800, actual: 9750 } // Current month mock
  ],
  deliveryPerformance: [
    { month: 'Jan', onTime: 90, delayed: 10 },
    { month: 'Feb', onTime: 95, delayed: 5 },
    { month: 'Mar', onTime: 88, delayed: 12 },
    { month: 'Apr', onTime: 93, delayed: 7 },
    { month: 'May', onTime: 92, delayed: 8 }
  ],
  defectTrend: [
    { month: 'Jan', defects: 2.1 },
    { month: 'Feb', defects: 1.8 },
    { month: 'Mar', defects: 2.5 },
    { month: 'Apr', defects: 1.5 },
    { month: 'May', defects: 1.2 }
  ],
  sampleApprovalTime: [ // Days
    { style: 'SHIRT-A', days: 7 },
    { style: 'DRESS-B', days: 12 },
    { style: 'PANT-C', days: 9 },
    { style: 'SKIRT-D', days: 6 },
    { style: 'JACKET-E', days: 15 },
  ]
};

const AnalyticsAndReports = () => {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-06-30'); // Up to current mock month

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  // Memoize filtered data if necessary, though with mock data, it's illustrative
  const filteredProductionData = useMemo(() => {
    // In a real app, this would filter mockAnalyticsData.productionEfficiency
    // based on startDate and endDate
    return mockAnalyticsData.productionEfficiency;
  }, [startDate, endDate]);

  const handleGenerateReport = (reportType) => {
    alert(`Generating ${reportType} report for period ${startDate} to ${endDate} (Mock)!`);
    // In a real application, this would trigger an API call to generate
    // a PDF/CSV, or navigate to a dedicated report view.
  };

  return (
    <div className="flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div variants={pageVariants} initial="hidden" animate="visible">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Analytics & Reports</h1>
        <p className="text-sm sm:text-lg text-gray-400 mt-1">Gain insights into merchandising performance and generate actionable reports.</p>
      </motion.div>

      {/* Date Range Selector */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col md:flex-row gap-4 items-center">
        <label htmlFor="start-date" className="text-gray-300 flex items-center">
          <FaCalendarAlt className="mr-2" /> From:
        </label>
        <input
          type="date"
          id="start-date"
          className="p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500 text-sm"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="end-date" className="text-gray-300 flex items-center md:ml-4">
          <FaCalendarAlt className="mr-2" /> To:
        </label>
        <input
          type="date"
          id="end-date"
          className="p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500 text-sm"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 md:ml-auto"
          onClick={() => alert('Applying date filter (mock)!')}
        >
          Apply Filter
        </button>
      </motion.div>

      {/* Key Performance Indicators (KPIs) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <FaCheckCircle className="text-green-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{mockAnalyticsData.kpis.onTimeDeliveryRate}%</p>
          <p className="text-sm text-gray-400">On-Time Delivery</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <FaClock className="text-blue-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{mockAnalyticsData.kpis.averageProductionLeadTime} Days</p>
          <p className="text-sm text-gray-400">Avg. Production Lead Time</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <FaExclamationTriangle className="text-red-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{mockAnalyticsData.kpis.defectRate}%</p>
          <p className="text-sm text-gray-400">Overall Defect Rate</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <FaCheckCircle className="text-purple-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{mockAnalyticsData.kpis.sampleApprovalRate}%</p>
          <p className="text-sm text-gray-400">Sample Approval Rate</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <FaTachometerAlt className="text-orange-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{mockAnalyticsData.kpis.totalOrdersCompleted}</p>
          <p className="text-sm text-gray-400">Orders Completed</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <FaShippingFast className="text-teal-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{mockAnalyticsData.kpis.pendingShipments}</p>
          <p className="text-sm text-gray-400">Pending Shipments</p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Efficiency Chart */}
        <div className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaChartLine className="mr-2 text-green-400" /> Production Efficiency (Units)
          </h3>
          <div className="h-64 bg-gray-700 rounded-md flex items-center justify-center text-gray-400 text-sm">
            {/* Placeholder for Line Chart (e.g., using Recharts LineChart) */}
            <p>Line Chart: Target vs. Actual Production Units per Month</p>
            <p>Data: {JSON.stringify(filteredProductionData.map(d => `${d.month}: ${d.actual}/${d.target}`))}</p>
          </div>
          <p className="text-sm text-gray-400 mt-4"><FaLightbulb className="inline mr-1 text-yellow-400" /> Insight: Monitor production output against set targets to identify trends.</p>
        </div>

        {/* Delivery Performance Chart */}
        <div className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaChartBar className="mr-2 text-blue-400" /> Delivery Performance
          </h3>
          <div className="h-64 bg-gray-700 rounded-md flex items-center justify-center text-gray-400 text-sm">
            {/* Placeholder for Bar Chart (e.g., using Recharts BarChart) */}
            <p>Bar Chart: On-Time vs. Delayed Deliveries per Month</p>
            <p>Data: {JSON.stringify(mockAnalyticsData.deliveryPerformance.map(d => `${d.month}: ${d.onTime}% On-Time`))}</p>
          </div>
          <p className="text-sm text-gray-400 mt-4"><FaLightbulb className="inline mr-1 text-yellow-400" /> Insight: Track delivery punctuality to improve customer satisfaction.</p>
        </div>

        {/* Defect Trend Chart */}
        <div className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaExclamationTriangle className="mr-2 text-red-400" /> Defect Rate Trend
          </h3>
          <div className="h-64 bg-gray-700 rounded-md flex items-center justify-center text-gray-400 text-sm">
            {/* Placeholder for Line Chart */}
            <p>Line Chart: Percentage Defect Rate Over Time</p>
            <p>Data: {JSON.stringify(mockAnalyticsData.defectTrend.map(d => `${d.month}: ${d.defects}%`))}</p>
          </div>
          <p className="text-sm text-gray-400 mt-4"><FaLightbulb className="inline mr-1 text-yellow-400" /> Insight: Identify patterns in defect rates to address underlying quality issues.</p>
        </div>

        {/* Sample Approval Time Chart (Placeholder) */}
        <div className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaChartPie className="mr-2 text-orange-400" /> Sample Approval Time
          </h3>
          <div className="h-64 bg-gray-700 rounded-md flex items-center justify-center text-gray-400 text-sm">
            {/* Placeholder for Bar/Scatter Chart */}
            <p>Bar Chart: Average Sample Approval Time by Style</p>
            <p>Data: {JSON.stringify(mockAnalyticsData.sampleApprovalTime.map(d => `${d.style}: ${d.days} days`))}</p>
          </div>
          <p className="text-sm text-gray-400 mt-4"><FaLightbulb className="inline mr-1 text-yellow-400" /> Insight: Optimize sample lead times to accelerate development.</p>
        </div>
      </motion.div>

      {/* Reports Section */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
          <FaFilePdf className="mr-2 text-red-500" /> Generate Reports
        </h3>
        <p className="text-gray-400 mb-4">Select a report type and period to generate printable documents.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleGenerateReport('Production Summary')}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FaChartBar className="w-5 h-5 mr-2" /> Production Summary (PDF)
          </button>
          <button
            onClick={() => handleGenerateReport('Shipment Performance')}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FaShippingFast className="w-5 h-5 mr-2" /> Shipment Performance (PDF)
          </button>
          <button
            onClick={() => handleGenerateReport('Quality Control Overview')}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FaExclamationTriangle className="w-5 h-5 mr-2" /> Quality Control (CSV)
          </button>
          <button
            onClick={() => handleGenerateReport('Lead Time Analysis')}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <FaClock className="w-5 h-5 mr-2" /> Lead Time Analysis (CSV)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsAndReports;