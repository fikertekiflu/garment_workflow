import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LuSearch,
  LuPlus,
  LuEye,       // For view details
  LuPencil,    // For edit
  LuTrash2,    // For delete (optional, but common)
  LuRefreshCcw // For refresh/sync
} from 'react-icons/lu';

// --- Mock Data for Cutting Orders ---
const mockCuttingOrders = [
  {
    id: 'CO001',
    styleName: 'Men\'s Polo Shirt - Classic Fit',
    fabricType: 'Cotton Jersey - Royal Blue',
    quantity: 500,
    layers: 80,
    markerLength: '6.2 M',
    dueDate: '2025-06-05',
    status: 'Cutting In Progress',
    assignedTo: 'Team A',
    notes: 'Prioritize for urgent delivery.'
  },
  {
    id: 'CO002',
    styleName: 'Women\'s A-Line Dress - Summer Collection',
    fabricType: 'Viscose Crepe - Floral Print',
    quantity: 300,
    layers: 60,
    markerLength: '5.8 M',
    dueDate: '2025-06-08',
    status: 'Pending Fabric Issue',
    assignedTo: 'Team B',
    notes: 'Requires specific print matching.'
  },
  {
    id: 'CO003',
    styleName: 'Kids T-Shirt - Graphic Print',
    fabricType: 'Poly-Cotton Blend - White',
    quantity: 1200,
    layers: 100,
    markerLength: '7.5 M',
    dueDate: '2025-06-10',
    status: 'Marker Planning',
    assignedTo: 'Team A',
    notes: ''
  },
  {
    id: 'CO004',
    styleName: 'Unisex Hoodie - Fleece',
    fabricType: 'French Terry - Black',
    quantity: 400,
    layers: 70,
    markerLength: '7.0 M',
    dueDate: '2025-06-07',
    status: 'Completed',
    assignedTo: 'Team C',
    notes: 'QC checked and approved.'
  },
  {
    id: 'CO005',
    styleName: 'Men\'s Casual Jacket - Spring',
    fabricType: 'Nylon Taslan - Khaki',
    quantity: 200,
    layers: 40,
    markerLength: '4.5 M',
    dueDate: '2025-06-12',
    status: 'Cutting Queued',
    assignedTo: 'Team B',
    notes: 'Waiting for Machine 2 availability.'
  },
];

// Helper function to get status badge styling
const getStatusBadge = (status) => {
  switch (status) {
    case 'Cutting In Progress': return 'bg-blue-600/30 text-blue-300 border border-blue-500/30';
    case 'Pending Fabric Issue': return 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/30';
    case 'Marker Planning': return 'bg-purple-600/30 text-purple-300 border border-purple-500/30';
    case 'Completed': return 'bg-green-600/30 text-green-300 border border-green-500/30';
    case 'Cutting Queued': return 'bg-gray-600/30 text-gray-300 border border-gray-500/30';
    default: return 'bg-gray-700/30 text-gray-400 border border-gray-600/30';
  }
};

const CuttingManagerOrders = () => {
  const [orders, setOrders] = useState(mockCuttingOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = Object.values(order).some(
      (value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const handleViewDetails = (orderId) => {
    alert(`View details for Order: ${orderId}`);
  };

  const handleEditOrder = (orderId) => {
    alert(`Edit Order: ${orderId}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete Order ${orderId}?`)) {
      setOrders(orders.filter(order => order.id !== orderId));
      alert(`Order ${orderId} deleted.`);
    }
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
          <h1 className="text-3xl font-semibold tracking-tight">Cutting Orders</h1>
          <p className="text-lg text-gray-400 mt-1">Manage and track all garment cutting orders.</p>
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
            <LuPlus className="w-4 h-4 mr-2" /> Add New Order
          </button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-5">
        <div className="relative flex-grow">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders (ID, Style, Fabric...)"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition-colors duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full md:w-auto py-2.5 px-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition-colors duration-200 appearance-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Cutting In Progress">Cutting In Progress</option>
            <option value="Pending Fabric Issue">Pending Fabric Issue</option>
            <option value="Marker Planning">Marker Planning</option>
            <option value="Cutting Queued">Cutting Queued</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </motion.div>

      {/* Orders Table */}
      {/* Removed overflow-x-auto and custom-scrollbar classes */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              {/* Removed whitespace-nowrap from th elements */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Style Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fabric Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Due Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700/40 transition-colors duration-200">
                  {/* Removed whitespace-nowrap from td elements */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-200">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{order.styleName}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{order.fabricType}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{order.quantity} Pcs</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{order.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="text-blue-400 hover:text-blue-300 p-1.5 rounded-full hover:bg-blue-900/40 transition-colors duration-200"
                        title="View Details"
                      >
                        <LuEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditOrder(order.id)}
                        className="text-yellow-400 hover:text-yellow-300 p-1.5 rounded-full hover:bg-yellow-900/40 transition-colors duration-200"
                        title="Edit Order"
                      >
                        <LuPencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-900/40 transition-colors duration-200"
                        title="Delete Order"
                      >
                        <LuTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500 text-md italic">No cutting orders found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
      {/* Removed the custom-scrollbar style block as it's no longer needed for this table */}
    </motion.div>
  );
};

export default CuttingManagerOrders;