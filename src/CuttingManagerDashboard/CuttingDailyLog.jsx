import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LuSearch,
  LuPlus,
  LuFilePen,       // Corrected icon: For new log entry (was LuFileEdit)
  LuClipboardList, // For daily log icon
  LuCalendarDays,  // For date
  LuClock,         // For shift/time
  LuFactory,       // For machine
  LuUser,          // For operator
  LuMessageSquare, // For notes
  LuRefreshCcw,    // For sync
  LuEye,           // For view details
  LuPencil         // For edit
} from 'react-icons/lu';

// --- Mock Data for Daily Log Entries ---
const mockDailyLog = [
  {
    id: 'DL001',
    date: '2025-06-03',
    shift: 'Day Shift (8 AM - 4 PM)',
    activityType: 'Cutting Order Start',
    associatedOrderId: 'CO001',
    machineId: 'Machine A',
    operator: 'John Doe',
    notes: 'Started cutting first marker for CO001. Fabric inspected, no issues found.',
    status: 'Completed',
    durationHours: 4.5,
  },
  {
    id: 'DL002',
    date: '2025-06-03',
    shift: 'Day Shift (8 AM - 4 PM)',
    activityType: 'Machine Maintenance',
    associatedOrderId: null,
    machineId: 'Machine B',
    operator: 'Jane Smith',
    notes: 'Routine daily check and lubrication. Minor belt adjustment.',
    status: 'Completed',
    durationHours: 1.0,
  },
  {
    id: 'DL003',
    date: '2025-06-03',
    shift: 'Night Shift (4 PM - 12 AM)',
    activityType: 'Fabric Issue Reported',
    associatedOrderId: 'CO002',
    machineId: 'Machine C',
    operator: 'Mike Johnson',
    notes: 'Received fabric roll for CO002. Noticed slight color variation on one edge. Reported to supervisor.',
    status: 'Pending Review',
    durationHours: null,
  },
  {
    id: 'DL004',
    date: '2025-06-04',
    shift: 'Day Shift (8 AM - 4 PM)',
    activityType: 'Cutting Order End',
    associatedOrderId: 'CO001',
    machineId: 'Machine A',
    operator: 'John Doe',
    notes: 'Finished cutting all markers for CO001. All pieces sent to bundling.',
    status: 'Completed',
    durationHours: 3.8,
  },
  {
    id: 'DL005',
    date: '2025-06-04',
    shift: 'Day Shift (8 AM - 4 PM)',
    activityType: 'Training Session',
    associatedOrderId: null,
    machineId: null,
    operator: 'Team B',
    notes: 'Refresher training on new cutting software features.',
    status: 'Completed',
    durationHours: 2.0,
  },
];

// Helper function to get status badge styling
const getLogStatusBadge = (status) => {
  switch (status) {
    case 'Completed': return 'bg-green-600/30 text-green-300 border border-green-500/30';
    case 'Pending Review': return 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/30';
    case 'In Progress': return 'bg-blue-600/30 text-blue-300 border border-blue-500/30';
    default: return 'bg-gray-700/30 text-gray-400 border border-gray-600/30';
  }
};

const CuttingDailyLog = () => {
  const [logEntries, setLogEntries] = useState(mockDailyLog);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterActivityType, setFilterActivityType] = useState('All');

  const availableActivityTypes = [
    'All',
    ...new Set(mockDailyLog.map(entry => entry.activityType))
  ];

  const filteredLogEntries = logEntries.filter(entry => {
    const matchesSearch = Object.values(entry).some(
      (value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'All' || entry.status === filterStatus;
    const matchesActivity = filterActivityType === 'All' || entry.activityType === filterActivityType;
    return matchesSearch && matchesStatus && matchesActivity;
  });

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const handleViewDetails = (id) => {
    alert(`View details for Log Entry: ${id}`);
    // In a real app, open a modal with full details
  };

  const handleEditLogEntry = (id) => {
    alert(`Edit Log Entry: ${id}`);
    // In a real app, open an edit form for the log entry
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
          <h1 className="text-3xl font-semibold tracking-tight">Daily Cutting Log</h1>
          <p className="text-lg text-gray-400 mt-1">Track daily activities and events in the cutting department.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <LuRefreshCcw className="w-4 h-4 mr-2" /> Sync
          </button>
          <button
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-5 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <LuFilePen className="w-4 h-4 mr-2" /> New Log Entry {/* Corrected usage here */}
          </button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-5">
        <div className="relative flex-grow">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Activity, Order ID, Operator..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition-colors duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition-colors duration-200 appearance-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending Review">Pending Review</option>
            <option value="In Progress">In Progress</option>
          </select>
          <select
            className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition-colors duration-200 appearance-none"
            value={filterActivityType}
            onChange={(e) => setFilterActivityType(e.target.value)}
          >
            {availableActivityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Daily Log Cards Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" // Responsive grid
      >
        {filteredLogEntries.length > 0 ? (
          filteredLogEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 space-y-4 hover:shadow-2xl transition-shadow duration-200 ease-in-out"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-gray-100">{entry.activityType}</h3>
                {/* Updated status badge styling */}
                <span className={`px-2.5 py-1.5 rounded-md text-xs font-semibold ${getLogStatusBadge(entry.status)}`}>
                  {entry.status}
                </span>
              </div>

              <div className="space-y-2 text-gray-300 text-sm">
                <p className="flex items-center"><LuCalendarDays className="w-4 h-4 mr-2 text-gray-400" /> Date: <span className="ml-1 font-medium">{entry.date}</span></p>
                <p className="flex items-center"><LuClock className="w-4 h-4 mr-2 text-gray-400" /> Shift: <span className="ml-1 font-medium">{entry.shift}</span></p>
                {entry.associatedOrderId && (
                  <p className="flex items-center"><LuClipboardList className="w-4 h-4 mr-2 text-gray-400" /> Order: <span className="ml-1 font-medium text-teal-400">{entry.associatedOrderId}</span></p>
                )}
                {entry.machineId && (
                  <p className="flex items-center"><LuFactory className="w-4 h-4 mr-2 text-gray-400" /> Machine: <span className="ml-1 font-medium">{entry.machineId}</span></p>
                )}
                <p className="flex items-center"><LuUser className="w-4 h-4 mr-2 text-gray-400" /> Operator: <span className="ml-1 font-medium">{entry.operator}</span></p>
                {entry.durationHours && (
                  <p className="flex items-center"><LuClock className="w-4 h-4 mr-2 text-gray-400" /> Duration: <span className="ml-1 font-medium">{entry.durationHours} hrs</span></p>
                )}
              </div>

              {entry.notes && (
                <div className="bg-gray-700/50 p-3 rounded-lg text-gray-400 text-sm">
                  <p className="flex items-center font-medium mb-1"><LuMessageSquare className="w-4 h-4 mr-2 text-gray-400" /> Notes:</p>
                  <p className="text-gray-300">{entry.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleViewDetails(entry.id)}
                  className="text-blue-400 hover:text-blue-300 p-1.5 rounded-full hover:bg-blue-900/40 transition-colors duration-200"
                  title="View Details"
                >
                  <LuEye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEditLogEntry(entry.id)}
                  className="text-yellow-400 hover:text-yellow-300 p-1.5 rounded-full hover:bg-yellow-900/40 transition-colors duration-200"
                  title="Edit Log Entry"
                >
                  <LuPencil className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full px-6 py-8 text-center text-gray-500 text-md italic bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl">
            No daily log entries found matching your criteria.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CuttingDailyLog;