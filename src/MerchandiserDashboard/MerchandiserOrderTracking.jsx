// src/MerchandiserDashboard/OrderTracking.jsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaInfoCircle,
  FaFileContract,
  FaUser,
  FaRulerCombined,
  FaLayerGroup,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaTimes,
  FaPalette,
  FaBoxes,
  FaCogs,
  FaShippingFast
} from 'react-icons/fa';

// --- Mock Data (same as before) ---
const mockOrders = [
  {
    id: 'ORD-2025-001',
    buyer: 'Global Apparel Co.',
    style: 'Men\'s Casual Shirt SS25',
    quantity: 15000,
    orderDate: '2025-01-15',
    exFactoryDate: '2025-06-30',
    currentStatus: 'In-Production',
    notes: 'Awaiting final trim approval.',
    sampleStatus: { proto: 'Approved', fit: 'Approved', pp: 'Pending Review', production: 'N/A' },
    fabricStatus: { order: '2025-02-01', eta: '2025-03-10', received: '2025-03-08', status: 'Received' },
    trimsStatus: { order: '2025-02-05', eta: '2025-03-15', received: '2025-03-12', status: 'Received' },
    productionStatus: { cutStart: '2025-05-10', sewStart: '2025-05-15', finishStart: '2025-06-10', percentageComplete: 65, status: 'Sewing In Progress' },
    shippingStatus: { planned: '2025-06-25', actual: 'N/A', blDate: 'N/A', status: 'Pending Booking' }
  },
  {
    id: 'ORD-2025-002',
    buyer: 'FashionForward Ltd.',
    style: 'Women\'s Summer Dress SS25',
    quantity: 10000,
    orderDate: '2025-02-01',
    exFactoryDate: '2025-07-15',
    currentStatus: 'Pending Sample Approval',
    notes: 'Proto sample revised. Waiting for buyer comments.',
    sampleStatus: { proto: 'Submitted', fit: 'N/A', pp: 'N/A', production: 'N/A' },
    fabricStatus: { order: 'N/A', eta: 'N/A', received: 'N/A', status: 'Pending Order' },
    trimsStatus: { order: 'N/A', eta: 'N/A', received: 'N/A', status: 'Pending Order' },
    productionStatus: { cutStart: 'N/A', sewStart: 'N/A', finishStart: 'N/A', percentageComplete: 0, status: 'Not Started' },
    shippingStatus: { planned: 'N/A', actual: 'N/A', blDate: 'N/A', status: 'Not Started' }
  },
  {
    id: 'ORD-2025-003',
    buyer: 'Urban Wear Inc.',
    style: 'Unisex Hoodie FW25',
    quantity: 25000,
    orderDate: '2025-03-10',
    exFactoryDate: '2025-08-20',
    currentStatus: 'Materials Pending',
    notes: 'Fabric delay expected by 5 days.',
    sampleStatus: { proto: 'Approved', fit: 'Approved', pp: 'Approved', production: 'N/A' },
    fabricStatus: { order: '2025-03-20', eta: '2025-05-01', received: 'N/A', status: 'Delayed' },
    trimsStatus: { order: '2025-03-25', eta: '2025-04-20', received: '2025-04-18', status: 'Received' },
    productionStatus: { cutStart: 'N/A', sewStart: 'N/A', finishStart: 'N/A', percentageComplete: 0, status: 'Hold - Materials' },
    shippingStatus: { planned: 'N/A', actual: 'N/A', blDate: 'N/A', status: 'Not Started' }
  },
  {
    id: 'ORD-2025-004',
    buyer: 'Sportswear Pro',
    style: 'Athletic Tracksuit SS25',
    quantity: 8000,
    orderDate: '2025-01-20',
    exFactoryDate: '2025-05-30',
    currentStatus: 'Shipped',
    notes: 'Delivered on time.',
    sampleStatus: { proto: 'Approved', fit: 'Approved', pp: 'Approved', production: 'N/A' },
    fabricStatus: { order: '2025-02-01', eta: '2025-03-01', received: '2025-02-28', status: 'Received' },
    trimsStatus: { order: '2025-02-05', eta: '2025-03-05', received: '2025-03-04', status: 'Received' },
    productionStatus: { cutStart: '2025-04-01', sewStart: '2025-04-05', finishStart: '2025-04-20', percentageComplete: 100, status: 'Completed' },
    shippingStatus: { planned: '2025-05-25', actual: '2025-05-25', blDate: '2025-05-26', status: 'Shipped' }
  },
];


const OrderTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' }, },
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = mockOrders.filter(order => {
      const matchesSearch = searchTerm
        ? Object.values(order).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;
      const matchesStatus = filterStatus === 'All' || order.currentStatus === filterStatus;
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
      return 0;
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
      case 'In-Production':
      case 'Production In Progress':
      case 'Sewing In Progress':
        return 'text-blue-400 bg-blue-900/30';
      case 'Shipped':
      case 'Completed':
      case 'Received': // For materials
        return 'text-green-400 bg-green-900/30';
      case 'Pending Sample Approval':
      case 'Materials Pending':
      case 'Pending Review':
      case 'Submitted': // For samples
      case 'Pending Booking': // For shipping
        return 'text-yellow-400 bg-yellow-900/30';
      case 'Hold - Materials':
      case 'Delayed':
        return 'text-red-400 bg-red-900/30';
      case 'Not Started':
      case 'N/A':
        return 'text-gray-400 bg-gray-700/30';
      default:
        return 'text-gray-300 bg-gray-700/30';
    }
  };

  const statusOptions = ['All', 'In-Production', 'Pending Sample Approval', 'Materials Pending', 'Shipped'];

  return (
    // Outer container: Ensure no horizontal overflow here
    // `min-h-screen` for sticky footer or full page background, `overflow-x-hidden` is critical here
    <div className="flex relative min-h-screen overflow-x-hidden bg-gray-900">
      {/* Main Content Area */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        // Adjust margin based on panel width for large screens
        // On small/medium screens, panel overlays, so main content remains full width
        className={`flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out
                   ${selectedOrder ? 'lg:mr-[min(500px,33vw)]' : ''} w-full /* Added w-full for safety */`}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Order Tracking</h1>
            <p className="text-sm sm:text-lg text-gray-400 mt-1">Monitor the live status and details of all your production orders.</p>
          </div>
          <button
            onClick={() => alert('Add New Order functionality coming soon!')}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 whitespace-nowrap"
          >
            <FaPlus className="w-4 h-4 mr-2" /> Add New Order
          </button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Style, Buyer..."
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
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Order List Table */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaFileContract className="mr-2 text-indigo-400" /> All Orders ({filteredAndSortedOrders.length})
          </h3>
          {filteredAndSortedOrders.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <FaInfoCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg">No orders found matching your criteria.</p>
            </div>
          ) : (
            // This container div will NOT have overflow-x-auto.
            // The table itself will be told to shrink or wrap.
            <div className="w-full overflow-hidden"> {/* Ensure this doesn't create scroll */}
              <table className="w-full divide-y divide-gray-700 table-fixed"> {/* IMPORTANT: table-fixed */}
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer w-[25%]" /* Fixed width for responsive columns */
                      onClick={() => handleSort('id')}
                    >
                      Order ID {getSortIcon('id')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell w-[25%]"
                      onClick={() => handleSort('buyer')}
                    >
                      Buyer {getSortIcon('buyer')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden lg:table-cell w-[25%]"
                      onClick={() => handleSort('style')}
                    >
                      Style {getSortIcon('style')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell w-[10%]"
                      onClick={() => handleSort('quantity')}
                    >
                      Qty {getSortIcon('quantity')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden lg:table-cell w-[15%]"
                      onClick={() => handleSort('exFactoryDate')}
                    >
                      Ex-Factory {getSortIcon('exFactoryDate')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer w-[25%]"
                      onClick={() => handleSort('currentStatus')}
                    >
                      Status {getSortIcon('currentStatus')}
                    </th>
                    <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[15%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredAndSortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-800/80 transition-colors duration-150">
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium text-teal-300 overflow-hidden text-ellipsis whitespace-nowrap">
                        {order.id}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden md:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {order.buyer}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden lg:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {order.style}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden md:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {order.quantity.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden lg:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {order.exFactoryDate}
                      </td>
                      <td className="py-2 px-2 sm:px-4 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.currentStatus)}`}>
                          {order.currentStatus}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-indigo-400 hover:text-indigo-600 mr-1 sm:mr-3 transition-colors duration-200 text-xs sm:text-sm"
                          title="View Details"
                        >
                          <FaEdit className="inline-block w-3 h-3 sm:w-4 sm:h-4" /> View/Edit
                        </button>
                        <button
                          onClick={() => alert(`Deleting order ${order.id}`)}
                          className="text-red-400 hover:text-red-600 transition-colors duration-200 text-xs sm:text-sm"
                          title="Delete Order"
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

      {/* Order Detail Side Panel */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            // Responsive width: Full width on small screens, fixed or percentage on larger
            className="fixed top-0 right-0 h-full w-full sm:w-[80vw] md:w-[min(600px,60vw)] lg:w-[min(500px,33vw)]
                       bg-gray-900 border-l border-gray-700 shadow-2xl p-6 sm:p-8 z-50 overflow-y-auto custom-scrollbar"
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors duration-200"
              title="Close Details"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-3">
              Order Details: <span className="text-teal-400">{selectedOrder.id}</span>
            </h2>

            <div className="grid grid-cols-1 gap-y-3 text-sm mb-6">
              <p><strong className="text-gray-400">Buyer:</strong> {selectedOrder.buyer}</p>
              <p><strong className="text-gray-400">Style:</strong> {selectedOrder.style}</p>
              <p><strong className="text-gray-400">Quantity:</strong> {selectedOrder.quantity.toLocaleString()}</p>
              <p><strong className="text-gray-400">Order Date:</strong> {selectedOrder.orderDate}</p>
              <p><strong className="text-gray-400">Ex-Factory Date:</strong> {selectedOrder.exFactoryDate}</p>
              <p><strong className="text-gray-400">Current Status:</strong> <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedOrder.currentStatus)}`}>{selectedOrder.currentStatus}</span></p>
              <p><strong className="text-gray-400">Notes:</strong> {selectedOrder.notes || 'N/A'}</p>
            </div>

            {/* Status Breakdowns */}
            <h3 className="text-lg sm:text-xl font-semibold mb-3 mt-6 text-gray-100 border-b border-gray-700 pb-2">Progress Breakdown</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
              {/* Sample Status */}
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-200 mb-1 flex items-center"><FaPalette className="mr-2 text-purple-400"/> Sample Status</h4>
                <p>Proto: <span className={getStatusColor(selectedOrder.sampleStatus.proto)}>{selectedOrder.sampleStatus.proto}</span></p>
                <p>Fit: <span className={getStatusColor(selectedOrder.sampleStatus.fit)}>{selectedOrder.sampleStatus.fit}</span></p>
                <p>PP: <span className={getStatusColor(selectedOrder.sampleStatus.pp)}>{selectedOrder.sampleStatus.pp}</span></p>
                <p>Production: <span className={getStatusColor(selectedOrder.sampleStatus.production)}>{selectedOrder.sampleStatus.production}</span></p>
              </div>

              {/* Fabric Status */}
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-200 mb-1 flex items-center"><FaBoxes className="mr-2 text-orange-400"/> Fabric Status</h4>
                <p>Order: {selectedOrder.fabricStatus.order || 'N/A'}</p>
                <p>ETA: {selectedOrder.fabricStatus.eta || 'N/A'}</p>
                <p>Received: {selectedOrder.fabricStatus.received || 'N/A'}</p>
                <p>Status: <span className={getStatusColor(selectedOrder.fabricStatus.status)}>{selectedOrder.fabricStatus.status}</span></p>
              </div>

              {/* Trims Status */}
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-200 mb-1 flex items-center"><FaLayerGroup className="mr-2 text-yellow-400"/> Trims Status</h4>
                <p>Order: {selectedOrder.trimsStatus.order || 'N/A'}</p>
                <p>ETA: {selectedOrder.trimsStatus.eta || 'N/A'}</p>
                <p>Received: {selectedOrder.trimsStatus.received || 'N/A'}</p>
                <p>Status: <span className={getStatusColor(selectedOrder.trimsStatus.status)}>{selectedOrder.trimsStatus.status}</span></p>
              </div>

              {/* Production Status */}
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-200 mb-1 flex items-center"><FaCogs className="mr-2 text-blue-400"/> Production Status</h4>
                <p>Cutting Start: {selectedOrder.productionStatus.cutStart || 'N/A'}</p>
                <p>Sewing Start: {selectedOrder.productionStatus.sewStart || 'N/A'}</p>
                <p>Finishing Start: {selectedOrder.productionStatus.finishStart || 'N/A'}</p>
                <p>Progress: <span className="font-medium text-teal-300">{selectedOrder.productionStatus.percentageComplete}%</span></p>
                <p>Status: <span className={getStatusColor(selectedOrder.productionStatus.status)}>{selectedOrder.productionStatus.status}</span></p>
              </div>

              {/* Shipping Status */}
              <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-gray-200 mb-1 flex items-center"><FaShippingFast className="mr-2 text-green-400"/> Shipping Status</h4>
                <p>Planned Ship: {selectedOrder.shippingStatus.planned || 'N/A'}</p>
                <p>Actual Ship: {selectedOrder.shippingStatus.actual || 'N/A'}</p>
                <p>BL Date: {selectedOrder.shippingStatus.blDate || 'N/A'}</p>
                <p>Status: <span className={getStatusColor(selectedOrder.shippingStatus.status)}>{selectedOrder.shippingStatus.status}</span></p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => alert('Simulating update for order ' + selectedOrder.id)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Save Changes (Mock)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderTracking;