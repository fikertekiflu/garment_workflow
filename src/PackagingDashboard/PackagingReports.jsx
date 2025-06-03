// src/PackagingDashboard/Reports.jsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  LuFiles,          // Total reports available
  LuCalendarClock,  // Most recent report date
  LuTrendingUp,     // Key performance indicator (e.g., efficiency)
  LuBell,           // For scheduled or upcoming reports/alerts
  LuFileText,       // Main icon for Reports & for list header
  LuEye,            // View report action
  LuDownload,       // Download report action
  LuPlus            // Changed from LuPlusCircle to LuPlus for "Generate new report"
} from 'react-icons/lu';

// --- Mock Data for Available Reports ---
const mockReports = [
  {
    id: 'RPT001',
    name: 'Daily Packaging Efficiency',
    description: 'Summarizes units packaged per hour and line performance.',
    lastGenerated: '2025-06-03',
    type: 'Daily',
    tags: ['Efficiency', 'Production', 'Daily'],
  },
  {
    id: 'RPT002',
    name: 'Monthly Material Consumption',
    description: 'Detailed breakdown of all packaging materials used by quantity and cost.',
    lastGenerated: '2025-06-01',
    type: 'Monthly',
    tags: ['Materials', 'Cost', 'Inventory'],
  },
  {
    id: 'RPT003',
    name: 'QC Failure Rate Analysis (Q2 2025)',
    description: 'Comprehensive analysis of quality control failures, types, and rates for Q2.',
    lastGenerated: '2025-05-28',
    type: 'Quarterly',
    tags: ['Quality', 'QC', 'Analysis'],
  },
  {
    id: 'RPT004',
    name: 'Shipment On-Time Performance',
    description: 'Tracks the percentage of packages delivered on or before the estimated arrival time.',
    lastGenerated: '2025-06-02',
    type: 'Daily',
    tags: ['Shipping', 'Tracking', 'Performance'],
  },
  {
    id: 'RPT005',
    name: 'Supplier Material Quality Report',
    description: 'Assessment of incoming material quality from various suppliers over time.',
    lastGenerated: '2025-05-15',
    type: 'Ad-hoc',
    tags: ['Materials', 'Suppliers', 'Quality'],
  },
  {
    id: 'RPT006',
    name: 'Waste Reduction Initiatives Impact',
    description: 'Report on the effectiveness and savings from recent waste reduction programs.',
    lastGenerated: '2025-05-20',
    type: 'Monthly',
    tags: ['Sustainability', 'Waste', 'Cost Saving'],
  },
];

const Reports = () => {
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // --- Calculate Summary Stats ---
  const totalReportsAvailable = mockReports.length;
  // Find the report with the most recent lastGenerated date
  const mostRecentReport = mockReports.reduce((latest, current) => {
    return (new Date(current.lastGenerated) > new Date(latest.lastGenerated)) ? current : latest;
  }, mockReports[0] || null); // Initialize with first item or null if array is empty

  // Example mock for a key metric
  const averageEfficiency = '92.5%';
  const scheduledReportsDue = 2; // Example: This could be dynamic based on a schedule

  return (
    <div className="flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div variants={pageVariants} initial="hidden" animate="visible">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center">
          <LuFileText className="mr-3 text-purple-400" /> Packaging Reports & Analytics
        </h1>
        <p className="text-sm sm:text-lg text-gray-400 mt-1">
          Access historical data, performance summaries, and detailed analyses of packaging operations.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Reports Available */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuFiles className="text-blue-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{totalReportsAvailable}</p>
          <p className="text-sm text-gray-400">Reports Available</p>
        </div>
        {/* Card 2: Last Report Generated */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuCalendarClock className="text-green-400 text-3xl mb-3" />
          <p className="text-lg font-bold">
            {mostRecentReport ? mostRecentReport.lastGenerated : 'N/A'}
          </p>
          <p className="text-sm text-gray-400">Last Report Generated</p>
        </div>
        {/* Card 3: Average Packaging Efficiency */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuTrendingUp className="text-teal-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{averageEfficiency}</p>
          <p className="text-sm text-gray-400">Avg. Packaging Efficiency</p>
        </div>
        {/* Card 4: Scheduled Reports Due */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuBell className="text-orange-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{scheduledReportsDue}</p>
          <p className="text-sm text-gray-400">Scheduled Reports Due</p>
        </div>
      </motion.div>

      {/* Report List */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-6 text-gray-200 flex items-center">
          <LuFileText className="mr-2 text-lime-400" /> Available Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReports.map(report => (
            <motion.div
              key={report.id}
              variants={itemVariants}
              className="bg-gray-700/50 p-5 rounded-lg shadow-md flex flex-col justify-between h-full hover:bg-gray-700 transition-colors duration-200 border border-gray-600/50"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">{report.name}</h4>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-200">{report.type}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  {report.description}
                </p>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <LuCalendarClock className="mr-2 text-gray-500" />
                  <span className="font-medium text-gray-300">Last Generated:</span> {report.lastGenerated}
                </div>
                {report.tags && report.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {report.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-900/30 text-blue-300 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => alert(`Viewing report: ${report.name}`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-sm transition-colors duration-200 flex items-center"
                >
                  <LuEye className="mr-2" /> View Report
                </button>
                <button
                  onClick={() => alert(`Downloading report: ${report.name}`)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium text-sm transition-colors duration-200 flex items-center"
                >
                  <LuDownload className="mr-2" /> Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Generate New Report Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => alert('Initiate new report generation process.')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold text-base transition-colors duration-200 flex items-center justify-center mx-auto"
          >
            <LuPlus className="mr-3 text-lg" /> Generate New Report
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;