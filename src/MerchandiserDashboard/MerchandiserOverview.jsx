// src/MerchandiserDashboard/MerchandiserOverview.jsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  FaClipboardList,      // Active Orders
  FaPalette,            // Samples
  FaBoxes,              // Materials
  FaShippingFast,       // Shipments
  FaTasks,              // Urgent Tasks
  FaCalendarCheck,      // Deadlines
  FaChartBar,           // Performance
  FaInfoCircle          // General info
} from 'react-icons/fa';

// --- Mock Data ---
const mockOverviewData = {
  activeOrders: 18,
  samplesInApproval: 7,
  materialsPending: 5, // Orders with pending fabric/trims
  upcomingShipments: 3, // Shipments due in next 7 days
  onTimeDeliveryRate: '92%',
  sampleApprovalRate: '85%',
  urgentTasks: [
    { id: 1, text: 'Confirm fabric approval for Order #MER-9012', dueDate: '2025-06-05' },
    { id: 2, text: 'Follow up on trims delivery for Order #MER-9015 (Critical)', dueDate: '2025-06-03' },
    { id: 3, text: 'Review revised sample for Style: KS-005', dueDate: '2025-06-07' },
  ],
  recentOrderUpdates: [
    { id: 'ORD-7890', status: 'Fabric Ready', date: '2025-06-02', orderName: 'Spring Dress Collection' },
    { id: 'ORD-1234', status: 'Production Started', date: '2025-06-01', orderName: 'Winter Jacket Batch' },
    { id: 'ORD-5678', status: 'Sample Approved (PP)', date: '2025-05-30', orderName: 'Kids T-Shirt Order' },
  ],
};

const MerchandiserOverview = () => {
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
          <h1 className="text-3xl font-semibold tracking-tight">Merchandiser Overview</h1>
          <p className="text-lg text-gray-400 mt-1">Your daily snapshot of order progress and key statuses.</p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaClipboardList className="w-8 h-8 text-indigo-400 mb-3" />
          <p className="text-sm text-gray-400">Active Orders</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{mockOverviewData.activeOrders}</h2>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaPalette className="w-8 h-8 text-purple-400 mb-3" />
          <p className="text-sm text-gray-400">Samples in Approval</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{mockOverviewData.samplesInApproval}</h2>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaBoxes className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-sm text-gray-400">Materials Pending</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{mockOverviewData.materialsPending}</h2>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaShippingFast className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-sm text-gray-400">Upcoming Shipments (7 days)</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{mockOverviewData.upcomingShipments}</h2>
        </motion.div>
      </div>

      {/* Main Content: Urgent Tasks & Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Tasks */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaTasks className="mr-2 text-red-400" /> Urgent Tasks
          </h3>
          {mockOverviewData.urgentTasks.length > 0 ? (
            <ul className="space-y-3">
              {mockOverviewData.urgentTasks.map(task => (
                <li key={task.id} className="flex items-center text-gray-300 bg-gray-900 p-3 rounded-md border border-gray-700">
                  <FaCalendarCheck className="w-4 h-4 mr-3 text-orange-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{task.text}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Due: {task.dueDate}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-400 py-4">
              <FaInfoCircle className="w-8 h-8 mx-auto mb-2" />
              <p>No urgent tasks at the moment. Good job!</p>
            </div>
          )}
        </motion.div>

        {/* Recent Order Updates */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaClipboardList className="mr-2 text-indigo-400" /> Recent Order Updates
          </h3>
          {mockOverviewData.recentOrderUpdates.length > 0 ? (
            <ul className="space-y-3">
              {mockOverviewData.recentOrderUpdates.map(update => (
                <li key={update.id} className="flex items-center text-gray-300 bg-gray-900 p-3 rounded-md border border-gray-700">
                  <span className="flex-shrink-0 text-xs font-bold w-16 text-indigo-300">{update.id}</span>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{update.orderName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Status: <span className="font-semibold text-white">{update.status}</span> on {update.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-400 py-4">
              <FaInfoCircle className="w-8 h-8 mx-auto mb-2" />
              <p>No recent order updates.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Performance Summary (Simple) */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
          <FaChartBar className="mr-2 text-pink-400" /> Performance Snapshot
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">On-Time Delivery Rate</p>
            <p className="text-2xl font-bold text-green-400">{mockOverviewData.onTimeDeliveryRate}</p>
          </div>
          <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Sample Approval Success Rate</p>
            <p className="text-2xl font-bold text-yellow-400">{mockOverviewData.sampleApprovalRate}</p>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};

export default MerchandiserOverview;