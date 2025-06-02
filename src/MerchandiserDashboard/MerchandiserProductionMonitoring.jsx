// src/MerchandiserDashboard/ProductionMonitoring.jsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaSearch,
  FaSort,
  FaInfoCircle,
  FaIndustry,      // For factory/production
  FaChartLine,    // For progress/monitoring
  FaClock,        // For daily/shift
  FaExclamationTriangle, // For bottlenecks/issues
  FaTrash,
  FaTimes,
  FaEdit,
  FaClipboardList, // For production run
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

// --- Mock Data for Production Monitoring ---
const mockProductionMonitoring = [
  {
    id: 'MON-2025-001',
    orderId: 'ORD-2025-001',
    style: 'Men\'s Casual Shirt SS25',
    factory: 'Sunrise Garments',
    productionLine: 'Line A',
    startDate: '2025-05-15',
    endDate: '2025-06-20', // Planned end date, not actual
    totalQuantity: 15000,
    producedQuantity: 10200, // Updated quantity for monitoring
    dailyTarget: 500, // units/day
    last24hrOutput: 520, // Output in last 24 hours/shift
    defectsToday: 5,
    status: 'Running Smoothly',
    currentBottlenecks: [], // Empty array for no current bottlenecks
    lastUpdate: '2025-06-03 10:30 AM',
    notes: 'Production slightly ahead of schedule. Minor defects logged for review.'
  },
  {
    id: 'MON-2025-002',
    orderId: 'ORD-2025-003',
    style: 'Unisex Hoodie FW25',
    factory: 'Urban Fabricators',
    productionLine: 'Line 3',
    startDate: '2025-08-01',
    endDate: '2025-08-30',
    totalQuantity: 25000,
    producedQuantity: 0,
    dailyTarget: 800,
    last24hrOutput: 0,
    defectsToday: 0,
    status: 'On Hold (Fabric)',
    currentBottlenecks: ['Fabric Shortage'],
    lastUpdate: '2025-06-02 04:00 PM',
    notes: 'Production cannot start due to missing fabric. Factory waiting for updated ETA.'
  },
  {
    id: 'MON-2025-003',
    orderId: 'ORD-2025-004',
    style: 'Athletic Tracksuit SS25',
    factory: 'Sporty Seams',
    productionLine: 'Line 1',
    startDate: '2025-04-01',
    endDate: '2025-04-23', // Actual completed date
    totalQuantity: 8000,
    producedQuantity: 8000,
    dailyTarget: 400,
    last24hrOutput: 0, // No output as completed
    defectsToday: 0,
    status: 'Completed',
    currentBottlenecks: [],
    lastUpdate: '2025-04-23 05:00 PM',
    notes: 'All units produced and passed final internal QC.'
  },
  {
    id: 'MON-2025-004',
    orderId: 'ORD-2025-002',
    style: 'Women\'s Summer Dress SS25',
    factory: 'Elegant Stitch',
    productionLine: 'Line B',
    startDate: '2025-07-01',
    endDate: '2025-07-25',
    totalQuantity: 10000,
    producedQuantity: 1200, // Some initial production
    dailyTarget: 400,
    last24hrOutput: 380,
    defectsToday: 12,
    status: 'Running Behind',
    currentBottlenecks: ['Machine Breakdown'],
    lastUpdate: '2025-06-03 09:00 AM',
    notes: 'Sewing machine #7 down. Repair team on site. Daily output affected.'
  }
];

const ProductionMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProduction, setNewProduction] = useState({
    orderId: '',
    style: '',
    factory: '',
    productionLine: '',
    startDate: '',
    endDate: '',
    totalQuantity: 0,
    producedQuantity: 0,
    dailyTarget: 0,
    last24hrOutput: 0,
    defectsToday: 0,
    status: 'Pending Start',
    currentBottlenecks: [],
    lastUpdate: new Date().toLocaleString(),
    notes: ''
  });
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState('asc');

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const filteredAndSortedProductions = useMemo(() => {
    let filtered = mockProductionMonitoring.filter(prod => {
      const matchesSearch = searchTerm
        ? Object.values(prod).some(value =>
            (typeof value === 'string' || typeof value === 'number') &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          ) || prod.currentBottlenecks.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      const matchesStatus = filterStatus === 'All' || prod.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0; // Fallback for other types
    });

    return filtered;
  }, [searchTerm, filterStatus, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Running Smoothly':
        return 'text-green-400 bg-green-900/30';
      case 'Running Behind':
        return 'text-orange-400 bg-orange-900/30';
      case 'On Hold (Fabric)':
      case 'On Hold (Other)':
        return 'text-red-400 bg-red-900/30';
      case 'Completed':
        return 'text-indigo-400 bg-indigo-900/30'; // Changed for completed in monitoring context
      case 'Pending Start':
        return 'text-yellow-400 bg-yellow-900/30';
      default:
        return 'text-gray-400 bg-gray-700/30';
    }
  };

  const calculateProgress = (produced, total) => {
    if (total === 0) return 0;
    return Math.min(100, Math.round((produced / total) * 100)); // Cap at 100%
  };

  const handleAddNewProduction = (e) => {
    e.preventDefault();
    const newId = `MON-2025-${String(mockProductionMonitoring.length + 1).padStart(3, '0')}`;
    const newRecord = {
      ...newProduction,
      id: newId,
      lastUpdate: new Date().toLocaleString(),
      currentBottlenecks: newProduction.currentBottlenecks.filter(b => b) // Clean empty strings
    };
    mockProductionMonitoring.unshift(newRecord); // Add to the beginning for visibility
    setNewProduction({ // Reset form
      orderId: '', style: '', factory: '', productionLine: '', startDate: '',
      endDate: '', totalQuantity: 0, producedQuantity: 0, dailyTarget: 0,
      last24hrOutput: 0, defectsToday: 0, status: 'Pending Start',
      currentBottlenecks: [], lastUpdate: new Date().toLocaleString(), notes: ''
    });
    setIsAddingNew(false);
    alert('New production run added (mock)!');
  };

  const handleUpdateProduction = (e) => {
    e.preventDefault();
    const index = mockProductionMonitoring.findIndex(p => p.id === selectedProduction.id);
    if (index !== -1) {
      mockProductionMonitoring[index] = {
        ...selectedProduction,
        lastUpdate: new Date().toLocaleString(), // Update timestamp on save
        currentBottlenecks: selectedProduction.currentBottlenecks.filter(b => b)
      };
    }
    setSelectedProduction(null);
    alert('Production run updated (mock)!');
  };

  return (
    <div className="flex relative min-h-screen overflow-x-hidden bg-gray-900">
      {/* Main Content Area */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className={`flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out
                   ${selectedProduction || isAddingNew ? 'lg:mr-[min(500px,33vw)]' : ''} w-full`}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Production Monitoring</h1>
            <p className="text-sm sm:text-lg text-gray-400 mt-1">Real-time tracking of production progress and factory performance.</p>
          </div>
          <button
            onClick={() => { setSelectedProduction(null); setIsAddingNew(true); }}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 whitespace-nowrap"
          >
            <FaPlus className="w-4 h-4 mr-2" /> Add New Production Run
          </button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Style, Factory, Bottlenecks..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
            <select
              id="status-filter"
              className="w-full md:w-auto p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {['All', 'Running Smoothly', 'Running Behind', 'On Hold (Fabric)', 'On Hold (Other)', 'Completed', 'Pending Start'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Production Monitoring List Table */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaIndustry className="mr-2 text-indigo-400" /> Active Production Runs ({filteredAndSortedProductions.length})
          </h3>
          {filteredAndSortedProductions.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <FaInfoCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg">No production runs found matching your criteria.</p>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <table className="w-full divide-y divide-gray-700 table-fixed">
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer w-[15%]"
                      onClick={() => handleSort('orderId')}
                    >
                      Order ID {getSortIcon('orderId')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell w-[20%]"
                      onClick={() => handleSort('style')}
                    >
                      Style {getSortIcon('style')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden lg:table-cell w-[15%]"
                      onClick={() => handleSort('factory')}
                    >
                      Factory {getSortIcon('factory')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer w-[15%]"
                      onClick={() => handleSort('status')}
                    >
                      Status {getSortIcon('status')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer w-[15%]"
                      onClick={() => handleSort('producedQuantity')}
                    >
                      Progress {getSortIcon('producedQuantity')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell w-[10%]"
                      onClick={() => handleSort('defectsToday')}
                    >
                      Defects {getSortIcon('defectsToday')}
                    </th>
                    <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredAndSortedProductions.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-800/80 transition-colors duration-150">
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium text-teal-300 overflow-hidden text-ellipsis whitespace-nowrap">
                        {prod.orderId}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden md:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {prod.style}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden lg:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {prod.factory} ({prod.productionLine})
                      </td>
                      <td className="py-2 px-2 sm:px-4 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(prod.status)}`}>
                          {prod.status}
                        </span>
                        {prod.currentBottlenecks && prod.currentBottlenecks.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {prod.currentBottlenecks.map((b, i) => (
                              <span key={i} className="px-1.5 py-0.5 text-xs font-medium text-red-300 bg-red-800/50 rounded-md">
                                <FaExclamationTriangle className="inline mr-1" />{b}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium text-gray-300">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-teal-500 h-2 rounded-full"
                            style={{ width: `${calculateProgress(prod.producedQuantity, prod.totalQuantity)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400 mt-1 block">{calculateProgress(prod.producedQuantity, prod.totalQuantity)}% ({prod.producedQuantity.toLocaleString()}/{prod.totalQuantity.toLocaleString()})</span>
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden sm:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {prod.defectsToday > 0 ? (
                          <span className="text-red-300 flex items-center">
                            <FaTimesCircle className="mr-1" /> {prod.defectsToday}
                          </span>
                        ) : (
                          <span className="text-green-300 flex items-center">
                            <FaCheckCircle className="mr-1" /> 0
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium whitespace-nowrap">
                        <button
                          onClick={() => { setSelectedProduction(prod); setIsAddingNew(false); }}
                          className="text-indigo-400 hover:text-indigo-600 mr-1 sm:mr-3 transition-colors duration-200 text-xs sm:text-sm"
                          title="View Details"
                        >
                          <FaEdit className="inline-block w-3 h-3 sm:w-4 sm:h-4" /> View/Edit
                        </button>
                        <button
                          onClick={() => alert(`Deleting production run ${prod.id}`)}
                          className="text-red-400 hover:text-red-600 transition-colors duration-200 text-xs sm:text-sm"
                          title="Delete Production Run"
                        >
                          <FaTrash className="inline-block w-3 h-3 sm:w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Detail / Add New Side Panel */}
      <AnimatePresence>
        {(selectedProduction || isAddingNew) && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-full w-full sm:w-[80vw] md:w-[min(600px,60vw)] lg:w-[min(500px,33vw)]
                       bg-gray-900 border-l border-gray-700 shadow-2xl p-6 sm:p-8 z-50 overflow-y-auto custom-scrollbar"
          >
            <button
              onClick={() => { setSelectedProduction(null); setIsAddingNew(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors duration-200"
              title="Close Panel"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-3">
              {isAddingNew ? 'Add New Production Run' : `Monitoring: ${selectedProduction.id}`}
            </h2>

            {isAddingNew ? (
              // Add New Production Run Form
              <form onSubmit={handleAddNewProduction} className="space-y-4 text-sm">
                <div>
                  <label htmlFor="new-prod-order-id" className="block text-gray-400 mb-1">Order ID</label>
                  <input
                    type="text"
                    id="new-prod-order-id"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.orderId}
                    onChange={(e) => setNewProduction({ ...newProduction, orderId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-prod-style" className="block text-gray-400 mb-1">Style</label>
                  <input
                    type="text"
                    id="new-prod-style"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.style}
                    onChange={(e) => setNewProduction({ ...newProduction, style: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-prod-factory" className="block text-gray-400 mb-1">Factory</label>
                  <input
                    type="text"
                    id="new-prod-factory"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.factory}
                    onChange={(e) => setNewProduction({ ...newProduction, factory: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-prod-line" className="block text-gray-400 mb-1">Production Line</label>
                  <input
                    type="text"
                    id="new-prod-line"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.productionLine}
                    onChange={(e) => setNewProduction({ ...newProduction, productionLine: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new-start-date" className="block text-gray-400 mb-1">Start Date (Actual)</label>
                    <input
                      type="date"
                      id="new-start-date"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={newProduction.startDate}
                      onChange={(e) => setNewProduction({ ...newProduction, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="new-end-date" className="block text-gray-400 mb-1">Planned End Date</label>
                    <input
                      type="date"
                      id="new-end-date"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={newProduction.endDate}
                      onChange={(e) => setNewProduction({ ...newProduction, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="new-total-quantity" className="block text-gray-400 mb-1">Total Order Quantity</label>
                  <input
                    type="number"
                    id="new-total-quantity"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.totalQuantity}
                    onChange={(e) => setNewProduction({ ...newProduction, totalQuantity: parseInt(e.target.value) || 0 })}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-daily-target" className="block text-gray-400 mb-1">Daily Target (Units)</label>
                  <input
                    type="number"
                    id="new-daily-target"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.dailyTarget}
                    onChange={(e) => setNewProduction({ ...newProduction, dailyTarget: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="new-produced-quantity" className="block text-gray-400 mb-1">Produced to Date (Total)</label>
                  <input
                    type="number"
                    id="new-produced-quantity"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.producedQuantity}
                    onChange={(e) => setNewProduction({ ...newProduction, producedQuantity: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="new-last24hr-output" className="block text-gray-400 mb-1">Last 24hr/Shift Output</label>
                  <input
                    type="number"
                    id="new-last24hr-output"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.last24hrOutput}
                    onChange={(e) => setNewProduction({ ...newProduction, last24hrOutput: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="new-defects-today" className="block text-gray-400 mb-1">Defects Reported Today</label>
                  <input
                    type="number"
                    id="new-defects-today"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.defectsToday}
                    onChange={(e) => setNewProduction({ ...newProduction, defectsToday: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="new-prod-status" className="block text-gray-400 mb-1">Current Status</label>
                  <select
                    id="new-prod-status"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.status}
                    onChange={(e) => setNewProduction({ ...newProduction, status: e.target.value })}
                  >
                    {['Pending Start', 'Running Smoothly', 'Running Behind', 'On Hold (Fabric)', 'On Hold (Other)', 'Completed'].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="new-bottlenecks" className="block text-gray-400 mb-1">Current Bottlenecks (comma-separated)</label>
                  <input
                    type="text"
                    id="new-bottlenecks"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.currentBottlenecks.join(', ')}
                    onChange={(e) => setNewProduction({ ...newProduction, currentBottlenecks: e.target.value.split(',').map(b => b.trim()) })}
                  />
                </div>
                <div>
                  <label htmlFor="new-prod-notes" className="block text-gray-400 mb-1">Notes</label>
                  <textarea
                    id="new-prod-notes"
                    rows="3"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newProduction.notes}
                    onChange={(e) => setNewProduction({ ...newProduction, notes: e.target.value })}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Add Production Run
                  </button>
                </div>
              </form>
            ) : (
              // Production Monitoring Details View (Editable)
              <form onSubmit={handleUpdateProduction} className="space-y-4 text-sm">
                <p><strong className="text-gray-400">Order ID:</strong> {selectedProduction.orderId}</p>
                <p><strong className="text-gray-400">Style:</strong> {selectedProduction.style}</p>
                <p><strong className="text-gray-400">Factory:</strong> {selectedProduction.factory} ({selectedProduction.productionLine})</p>
                <p><strong className="text-gray-400">Planned Dates:</strong> {selectedProduction.startDate} to {selectedProduction.endDate}</p>
                <p><strong className="text-gray-400">Total Order Quantity:</strong> {selectedProduction.totalQuantity.toLocaleString()}</p>
                <p><strong className="text-gray-400">Last Updated:</strong> {selectedProduction.lastUpdate}</p>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="font-semibold text-gray-200 mb-3 flex items-center">
                    <FaChartLine className="mr-2 text-yellow-400" /> Current Performance
                  </h4>
                  <div>
                    <label htmlFor="edit-produced-quantity" className="block text-gray-400 mb-1">Produced to Date (Total)</label>
                    <input
                      type="number"
                      id="edit-produced-quantity"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedProduction.producedQuantity}
                      onChange={(e) => setSelectedProduction({ ...selectedProduction, producedQuantity: parseInt(e.target.value) || 0 })}
                      min="0"
                      max={selectedProduction.totalQuantity}
                    />
                  </div>
                  <div className="mt-3">
                    <label htmlFor="edit-last24hr-output" className="block text-gray-400 mb-1">Last 24hr/Shift Output</label>
                    <input
                      type="number"
                      id="edit-last24hr-output"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedProduction.last24hrOutput}
                      onChange={(e) => setSelectedProduction({ ...selectedProduction, last24hrOutput: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  <div className="mt-3">
                    <label htmlFor="edit-defects-today" className="block text-gray-400 mb-1">Defects Reported Today</label>
                    <input
                      type="number"
                      id="edit-defects-today"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedProduction.defectsToday}
                      onChange={(e) => setSelectedProduction({ ...selectedProduction, defectsToday: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                  <div className="mt-3">
                    <label htmlFor="edit-daily-target" className="block text-gray-400 mb-1">Daily Target (Units)</label>
                    <input
                      type="number"
                      id="edit-daily-target"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedProduction.dailyTarget}
                      onChange={(e) => setSelectedProduction({ ...selectedProduction, dailyTarget: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="font-semibold text-gray-200 mb-3 flex items-center">
                    <FaExclamationTriangle className="mr-2 text-red-400" /> Status & Issues
                  </h4>
                  <div>
                    <label htmlFor="edit-prod-status" className="block text-gray-400 mb-1">Current Status</label>
                    <select
                      id="edit-prod-status"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedProduction.status}
                      onChange={(e) => setSelectedProduction({ ...selectedProduction, status: e.target.value })}
                    >
                      {['Pending Start', 'Running Smoothly', 'Running Behind', 'On Hold (Fabric)', 'On Hold (Other)', 'Completed'].map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3">
                    <label htmlFor="edit-bottlenecks" className="block text-gray-400 mb-1">Current Bottlenecks (comma-separated)</label>
                    <input
                      type="text"
                      id="edit-bottlenecks"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedProduction.currentBottlenecks.join(', ')}
                      onChange={(e) => setSelectedProduction({ ...selectedProduction, currentBottlenecks: e.target.value.split(',').map(b => b.trim()) })}
                    />
                  </div>
                  <div className="mt-3">
                    <label htmlFor="edit-prod-notes" className="block text-gray-400 mb-1">Notes / Factory Communication</label>
                    <textarea
                      id="edit-prod-notes"
                      rows="3"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedProduction.notes}
                      onChange={(e) => setSelectedProduction({ ...selectedProduction, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Save Updates (Mock)
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductionMonitoring;