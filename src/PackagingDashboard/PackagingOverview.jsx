// src/PackagingDashboard/PackagingOverview.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LuPackage,
  LuCheck,          // Changed from LuCheckCircle to LuCheck
  LuHourglass,
  LuTruck,
  LuTag,
  LuClipboardList,
  LuBoxes
} from 'react-icons/lu'; // Changed from 'react-icons/fa' to 'react-icons/lu'

// --- Mock Data for Packaging Dashboard ---
const mockPackagingOrders = [
  {
    id: 'PACK001',
    orderId: 'ORD78901',
    style: 'Classic Polo Shirt',
    quantity: 1500,
    status: 'In Progress',
    packedUnits: 1200,
    remainingUnits: 300,
    etaCompletion: '2025-06-05',
    packagingMaterials: ['Polybag', 'Carton Box (Medium)', 'Hangtag'],
    labelsVerified: false,
    documentsPrepared: false,
  },
  {
    id: 'PACK002',
    orderId: 'ORD78902',
    style: 'Denim Jeans (Slim Fit)',
    quantity: 800,
    status: 'Completed',
    packedUnits: 800,
    remainingUnits: 0,
    completionDate: '2025-06-01',
    packagingMaterials: ['Polybag', 'Carton Box (Large)', 'Care Label', 'Size Sticker'],
    labelsVerified: true,
    documentsPrepared: true,
  },
  {
    id: 'PACK003',
    orderId: 'ORD78903',
    style: 'Summer Dress',
    quantity: 2200,
    status: 'Pending',
    packedUnits: 0,
    remainingUnits: 2200,
    startDate: '2025-06-06',
    packagingMaterials: ['Recycled Polybag', 'Branded Tissue Paper', 'Mailer Bag'],
    labelsVerified: false,
    documentsPrepared: false,
  },
  {
    id: 'PACK004',
    orderId: 'ORD78904',
    style: 'Hoodie (Unisex)',
    quantity: 1000,
    status: 'In Progress',
    packedUnits: 500,
    remainingUnits: 500,
    etaCompletion: '2025-06-04',
    packagingMaterials: ['Polybag', 'Carton Box (Medium)'],
    labelsVerified: true,
    documentsPrepared: false,
  },
];

const PackagingOverview = () => {
  const [packagingOrders, setPackagingOrders] = useState(mockPackagingOrders);

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const handleUpdateStatus = (id, newStatus) => {
    setPackagingOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, status: newStatus, ...(newStatus === 'Completed' && { completionDate: new Date().toISOString().split('T')[0] }) } : order
      )
    );
    alert(`Packaging order ${id} status updated to ${newStatus}`);
  };

  const handleToggleLabelsVerified = (id) => {
    setPackagingOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, labelsVerified: !order.labelsVerified } : order
      )
    );
  };

  const handleToggleDocumentsPrepared = (id) => {
    setPackagingOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, documentsPrepared: !order.documentsPrepared } : order
      )
    );
  };


  return (
    <div className="flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div variants={pageVariants} initial="hidden" animate="visible">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center">
          <LuPackage className="mr-3 text-teal-400" /> Packaging Dashboard Overview
        </h1>
        <p className="text-sm sm:text-lg text-gray-400 mt-1">
          Comprehensive overview of packaging operations, status, and material management.
        </p>
      </motion.div>

      {/* Overview Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuBoxes className="text-blue-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{packagingOrders.length}</p>
          <p className="text-sm text-gray-400">Total Packaging Orders</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuHourglass className="text-yellow-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{packagingOrders.filter(o => o.status === 'In Progress').length}</p>
          <p className="text-sm text-gray-400">In Progress</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          {/* Changed icon here */}
          <LuCheck className="text-green-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{packagingOrders.filter(o => o.status === 'Completed').length}</p>
          <p className="text-sm text-gray-400">Completed Packages</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuTruck className="text-purple-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{packagingOrders.filter(o => o.status === 'Completed' && o.documentsPrepared).length}</p>
          <p className="text-sm text-gray-400">Ready for Shipment</p>
        </div>
      </motion.div>

      {/* Packaging Orders List */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
          <LuClipboardList className="mr-2 text-blue-400" /> Current Packaging Tasks
        </h3>
        <div className="w-full">
          <table className="min-w-full divide-y divide-gray-700 table-auto">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Style
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Quantity
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Packed / Total
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Labels
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Docs
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  ETA/Completion
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {packagingOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300">{order.orderId}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">{order.style}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">{order.quantity}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">
                    {order.packedUnits} / {order.quantity}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-center hidden md:table-cell">
                    <button
                      onClick={() => handleToggleLabelsVerified(order.id)}
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        order.labelsVerified ? 'text-green-400 hover:text-green-300' : 'text-gray-500 hover:text-gray-400'
                      }`}
                      title={order.labelsVerified ? 'Labels Verified' : 'Labels Not Verified'}
                    >
                      <LuTag className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-center hidden lg:table-cell">
                    <button
                      onClick={() => handleToggleDocumentsPrepared(order.id)}
                      className={`p-1 rounded-full transition-colors duration-200 ${
                        order.documentsPrepared ? 'text-green-400 hover:text-green-300' : 'text-gray-500 hover:text-gray-400'
                      }`}
                      title={order.documentsPrepared ? 'Documents Prepared' : 'Documents Not Prepared'}
                    >
                      <LuClipboardList className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">
                    {order.status === 'Completed' ? order.completionDate : order.etaCompletion || order.startDate || 'N/A'}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-left text-sm font-medium">
                    {order.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'Completed')}
                        className="text-teal-500 hover:text-teal-700 text-xs px-2 py-1 rounded-md mr-1"
                        title="Mark as Completed"
                      >
                        Done
                      </button>
                    )}
                    {order.status === 'Pending' && (
                       <button
                       onClick={() => handleUpdateStatus(order.id, 'In Progress')}
                       className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded-md"
                       title="Start Packaging"
                     >
                       Start
                     </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default PackagingOverview;