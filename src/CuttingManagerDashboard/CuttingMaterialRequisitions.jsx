import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LuSearch,
  LuPlus,
  LuFilePlus,      // For new requisition
  LuBox,           // For material item
  LuClipboardList, // For requisition list
  LuCheck,         // For approved
  LuX,             // For rejected
  LuClock,         // For pending/due date
  LuRefreshCcw,    // For sync
  LuEye,           // For view details
  LuPencil         // For edit
} from 'react-icons/lu';

// --- Mock Data for Material Requisitions ---
const mockMaterialRequisitions = [
  {
    id: 'MR001',
    associatedOrderId: 'CO001',
    materialName: 'Fusible Interlining - White',
    quantity: 500,
    unit: 'meters',
    requiredBy: '2025-06-03',
    status: 'Approved',
    requestedBy: 'Cutting Team A',
    dateRequested: '2025-05-28',
  },
  {
    id: 'MR002',
    associatedOrderId: 'CO002',
    materialName: 'Neck Labels - Size M',
    quantity: 300,
    unit: 'pieces',
    requiredBy: '2025-06-05',
    status: 'Pending Approval',
    requestedBy: 'Cutting Team B',
    dateRequested: '2025-05-29',
  },
  {
    id: 'MR003',
    associatedOrderId: 'CO001',
    materialName: 'Pocket Bags - Cotton',
    quantity: 1000,
    unit: 'pieces',
    requiredBy: '2025-06-04',
    status: 'Issued',
    requestedBy: 'Cutting Team A',
    dateRequested: '2025-05-28',
  },
  {
    id: 'MR004',
    associatedOrderId: 'CO003',
    materialName: 'Screen Print Pigment - Red',
    quantity: 5,
    unit: 'kg',
    requiredBy: '2025-06-07',
    status: 'Rejected',
    requestedBy: 'Cutting Team C',
    dateRequested: '2025-05-29',
    notes: 'Incorrect color specified.'
  },
  {
    id: 'MR005',
    associatedOrderId: 'CO005',
    materialName: 'Drawstrings - Black',
    quantity: 200,
    unit: 'pieces',
    requiredBy: '2025-06-10',
    status: 'Pending Approval',
    requestedBy: 'Cutting Team B',
    dateRequested: '2025-05-30',
  },
];

// Helper function to get status badge styling
const getRequisitionStatusBadge = (status) => {
  switch (status) {
    case 'Approved': return 'bg-green-600/30 text-green-300 border border-green-500/30';
    case 'Pending Approval': return 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/30';
    case 'Issued': return 'bg-blue-600/30 text-blue-300 border border-blue-500/30';
    case 'Rejected': return 'bg-red-600/30 text-red-300 border border-red-500/30';
    default: return 'bg-gray-700/30 text-gray-400 border border-gray-600/30';
  }
};

const CuttingMaterialRequisitions = () => {
  const [requisitions, setRequisitions] = useState(mockMaterialRequisitions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredRequisitions = requisitions.filter(req => {
    const matchesSearch = Object.values(req).some(
      (value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
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

  const handleViewDetails = (id) => {
    alert(`View details for Requisition: ${id}`);
  };

  const handleEditRequisition = (id) => {
    alert(`Edit Requisition: ${id}`);
  };

  const handleApproveRequisition = (id) => {
    // In a real app, this would send an API request to approve
    const updatedRequisitions = requisitions.map(req =>
      req.id === id && req.status === 'Pending Approval'
        ? { ...req, status: 'Approved' }
        : req
    );
    setRequisitions(updatedRequisitions);
    alert(`Requisition ${id} approved.`);
  };

  const handleRejectRequisition = (id) => {
    // In a real app, this would send an API request to reject
    const updatedRequisitions = requisitions.map(req =>
      req.id === id && req.status === 'Pending Approval'
        ? { ...req, status: 'Rejected' }
        : req
    );
    setRequisitions(updatedRequisitions);
    alert(`Requisition ${id} rejected.`);
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
          <h1 className="text-3xl font-semibold tracking-tight">Material Requisitions</h1>
          <p className="text-lg text-gray-400 mt-1">Manage requests for auxiliary cutting materials.</p>
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
            <LuFilePlus className="w-4 h-4 mr-2" /> Create New Requisition
          </button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-5">
        <div className="relative flex-grow">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Material, Order ID, Requester..."
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
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Issued">Issued</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </motion.div>

      {/* Requisitions Table */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Req. ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Material Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Required By</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredRequisitions.length > 0 ? (
              filteredRequisitions.map((req) => (
                <tr key={req.id} className="hover:bg-gray-700/40 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm font-medium text-gray-200">{req.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{req.associatedOrderId}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{req.materialName}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{req.quantity} {req.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{req.requiredBy}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1.5 rounded-md text-xs font-semibold ${getRequisitionStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(req.id)}
                        className="text-blue-400 hover:text-blue-300 p-1.5 rounded-full hover:bg-blue-900/40 transition-colors duration-200"
                        title="View Details"
                      >
                        <LuEye className="w-5 h-5" />
                      </button>
                      {req.status === 'Pending Approval' && (
                        <>
                          <button
                            onClick={() => handleEditRequisition(req.id)}
                            className="text-yellow-400 hover:text-yellow-300 p-1.5 rounded-full hover:bg-yellow-900/40 transition-colors duration-200"
                            title="Edit Requisition"
                          >
                            <LuPencil className="w-5 h-5" />
                          </button>
                          {/* Only show Approve/Reject if the Cutting Manager is also an approver */}
                          <button
                            onClick={() => handleApproveRequisition(req.id)}
                            className="text-green-400 hover:text-green-300 p-1.5 rounded-full hover:bg-green-900/40 transition-colors duration-200"
                            title="Approve Requisition"
                          >
                            <LuCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleRejectRequisition(req.id)}
                            className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-900/40 transition-colors duration-200"
                            title="Reject Requisition"
                          >
                            <LuX className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500 text-md italic">No material requisitions found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default CuttingMaterialRequisitions;