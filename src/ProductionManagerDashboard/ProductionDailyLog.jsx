import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaCalendarAlt,    // For date selection
    FaClipboardList,  // Main icon for daily log
    FaPlusCircle,     // Add new entry
    FaEdit,           // Edit entry
    FaTrash,          // Delete entry
    FaSearch,         // Filter/search
    FaChartLine,      // For visualizing trends
    FaArrowRight,     // For navigation/direction
    FaInfoCircle,     // For information tooltips
    FaListOl,         // <--- ADD THIS LINE (for line filter)
    FaLayerGroup,     // <--- ADD THIS LINE (for style filter)
  } from 'react-icons/fa';

// --- Mock Data for Daily Production Logs ---
// Each entry represents a line's log for a specific style on a given date
const mockDailyLogs = [
  {
    id: 'log-1',
    date: '2025-06-01',
    style: 'Baby Trouser',
    line: '2',
    orderNo: '24',
    sam: 14, // Standard Allowed Minute per garment
    targetUnits: 822, // Daily target for this line/style
    hourlyEntries: [
      { time: '08:00-09:00', output: 102, defects: 3, qualityPass: 99 },
      { time: '09:00-10:00', output: 102, defects: 2, qualityPass: 100 },
      { time: '10:00-11:00', output: 100, defects: 5, qualityPass: 95 },
      { time: '11:00-12:00', output: 105, defects: 1, qualityPass: 104 },
      { time: '12:00-13:00', output: 98, defects: 4, qualityPass: 94 }, // Lunch break might affect this
      { time: '13:00-14:00', output: 103, defects: 2, qualityPass: 101 },
      { time: '14:00-15:00', output: 102, defects: 3, qualityPass: 99 },
      { time: '15:00-16:00', output: 106, defects: 1, qualityPass: 105 },
      { time: '16:00-17:00', output: 101, defects: 2, qualityPass: 99 },
      { time: '17:00-18:00', output: 95, defects: 5, qualityPass: 90 }, // End of shift/tiredness
    ],
  },
  {
    id: 'log-2',
    date: '2025-06-01',
    style: 'Kids Shirt',
    line: '3',
    orderNo: '31',
    sam: 12,
    targetUnits: 900,
    hourlyEntries: [
      { time: '08:00-09:00', output: 110, defects: 2, qualityPass: 108 },
      { time: '09:00-10:00', output: 115, defects: 3, qualityPass: 112 },
      { time: '10:00-11:00', output: 108, defects: 1, qualityPass: 107 },
    ],
  },
  {
    id: 'log-3',
    date: '2025-06-02', // Another day
    style: 'Baby Trouser',
    line: '2',
    orderNo: '24',
    sam: 14,
    targetUnits: 822,
    hourlyEntries: [
      { time: '08:00-09:00', output: 105, defects: 2, qualityPass: 103 },
      { time: '09:00-10:00', output: 108, defects: 1, qualityPass: 107 },
    ],
  },
];

const ProductionDailyLog = () => {
  const [logs, setLogs] = useState(mockDailyLogs);
  const [selectedDate, setSelectedDate] = useState('2025-06-01'); // Default to first date in mock
  const [selectedLine, setSelectedLine] = useState('All'); // Filter by line
  const [selectedStyle, setSelectedStyle] = useState('All'); // Filter by style

  // Filtered logs based on selection
  const filteredLogs = logs.filter(log => {
    const dateMatch = log.date === selectedDate;
    const lineMatch = selectedLine === 'All' || log.line === selectedLine;
    const styleMatch = selectedStyle === 'All' || log.style === selectedStyle;
    return dateMatch && lineMatch && styleMatch;
  });

  // Get unique dates, lines, and styles for filters
  const uniqueDates = [...new Set(mockDailyLogs.map(log => log.date))];
  const uniqueLines = ['All', ...new Set(mockDailyLogs.map(log => log.line))];
  const uniqueStyles = ['All', ...new Set(mockDailyLogs.map(log => log.style))];

  // Calculate summary for the current filtered log entry
  const currentLogEntry = filteredLogs.length > 0 ? filteredLogs[0] : null;

  const calculateSummary = (entry) => {
    if (!entry) return null;
    const totalOutput = entry.hourlyEntries.reduce((sum, h) => sum + h.output, 0);
    const totalDefects = entry.hourlyEntries.reduce((sum, h) => sum + h.defects, 0);
    const totalQualityPass = entry.hourlyEntries.reduce((sum, h) => sum + h.qualityPass, 0);
    const actualWorkingHours = entry.hourlyEntries.length;

    // SAM (Standard Allowed Minute) based calculations
    const totalSAMMinutesAchieved = totalOutput * entry.sam;
    const totalAvailableMinutes = actualWorkingHours * 60 * 60; // Assuming 60 minutes per hour

    // Daily Efficiency (based on actual output vs target)
    const dailyEfficiency = entry.targetUnits > 0
      ? ((totalOutput / entry.targetUnits) * 100).toFixed(1)
      : '0.0';

    // Quality Rate
    const qualityRate = totalOutput > 0
      ? ((totalQualityPass / totalOutput) * 100).toFixed(1)
      : '0.0';

    // WIP: Could also calculate OEE, capacity utilization etc.

    return {
      totalOutput,
      totalDefects,
      totalQualityPass,
      dailyEfficiency,
      qualityRate,
      actualWorkingHours,
      totalSAMMinutesAchieved
    };
  };

  const summary = currentLogEntry ? calculateSummary(currentLogEntry) : null;

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
          <h1 className="text-3xl font-semibold tracking-tight">Daily Production Log</h1>
          <p className="text-lg text-gray-400 mt-1">Track hourly output, quality, and efficiency for each production line.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
            <FaPlusCircle className="w-4 h-4 mr-2" /> Add New Log Entry
          </button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaCalendarAlt className="text-gray-400" />
          <label htmlFor="date-select" className="sr-only">Select Date</label>
          <select
            id="date-select"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {uniqueDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaListOl className="text-gray-400" /> {/* Icon for Line */}
          <label htmlFor="line-select" className="sr-only">Select Line</label>
          <select
            id="line-select"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
          >
            {uniqueLines.map(line => (
              <option key={line} value={line}>{line}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaLayerGroup className="text-gray-400" /> {/* Icon for Style */}
          <label htmlFor="style-select" className="sr-only">Select Style</label>
          <select
            id="style-select"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
          >
            {uniqueStyles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Display Log Table and Summary */}
      {currentLogEntry ? (
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaClipboardList className="mr-2" />
            Log for {currentLogEntry.style} on Line {currentLogEntry.line} (Order No: {currentLogEntry.orderNo})
          </h3>

          {/* Summary Cards for the selected log */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-start">
              <p className="text-sm text-gray-400">Daily Target</p>
              <h4 className="text-xl font-bold text-gray-100">{currentLogEntry.targetUnits.toLocaleString()} units</h4>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-start">
              <p className="text-sm text-gray-400">Total Output</p>
              <h4 className="text-xl font-bold text-gray-100">{summary.totalOutput.toLocaleString()} units</h4>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-start">
              <p className="text-sm text-gray-400">Daily Efficiency</p>
              <h4 className="text-xl font-bold text-gray-100">{summary.dailyEfficiency}%</h4>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg flex flex-col items-start">
              <p className="text-sm text-gray-400">Quality Pass Rate</p>
              <h4 className="text-xl font-bold text-gray-100">{summary.qualityRate}%</h4>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Time</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Output/Hr</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Defects</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Quality Pass</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLogEntry.hourlyEntries.map((entry, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'}>
                    <td className="py-3 px-4 text-sm text-gray-300">{entry.time}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{entry.output.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{entry.defects.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{entry.qualityPass.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        <FaEdit />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 text-center text-gray-400">
          <FaInfoCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-xl">No daily production logs found for the selected filters.</p>
          <p className="mt-2">Try adjusting the date, line, or style.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductionDailyLog;