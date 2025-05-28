import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LuSearch,
  LuPlus,
  LuTag,           // For fabric roll/lot
  LuSquareCheck, // For allocated/issued status
  LuArrowRightFromLine, // For issuing fabric
  LuListChecks,    // For allocation list
  LuRefreshCcw,    // For sync
  LuEye,           // For view details
  LuPencil         // For edit
} from 'react-icons/lu';

// --- Mock Data for Fabric Allocations ---
const mockFabricAllocations = [
  {
    id: 'FA001',
    fabricType: 'Cotton Jersey - Royal Blue',
    lotNo: 'L202403-01',
    rollNo: 'R123',
    quantityMeters: 550.0,
    allocatedToOrder: 'CO001',
    status: 'Issued to Cutting',
    location: 'Cutting Floor A',
    allocatedDate: '2025-05-20',
  },
  {
    id: 'FA002',
    fabricType: 'Viscose Crepe - Floral Print',
    lotNo: 'L202403-02',
    rollNo: 'R125',
    quantityMeters: 320.5,
    allocatedToOrder: 'CO002',
    status: 'Allocated - Pending Issue',
    location: 'Warehouse Zone B',
    allocatedDate: '2025-05-22',
  },
  {
    id: 'FA003',
    fabricType: 'Poly-Cotton Blend - White',
    lotNo: 'L202403-03',
    rollNo: 'R128',
    quantityMeters: 1300.0,
    allocatedToOrder: 'CO003',
    status: 'Allocated - Pending Issue',
    location: 'Warehouse Zone C',
    allocatedDate: '2025-05-23',
  },
  {
    id: 'FA004',
    fabricType: 'French Terry - Black',
    lotNo: 'L202403-04',
    rollNo: 'R130',
    quantityMeters: 450.0,
    allocatedToOrder: 'CO004',
    status: 'Issued to Cutting',
    location: 'Cutting Floor B',
    allocatedDate: '2025-05-25',
  },
  {
    id: 'FA005',
    fabricType: 'Nylon Taslan - Khaki',
    lotNo: 'L202403-05',
    rollNo: 'R132',
    quantityMeters: 220.0,
    allocatedToOrder: 'CO005',
    status: 'Ready for Allocation', // Example of unallocated fabric
    location: 'Warehouse Zone A',
    allocatedDate: null, // No allocation date yet
  },
];

// Helper function to get status badge styling
const getAllocationStatusBadge = (status) => {
  switch (status) {
    case 'Issued to Cutting': return 'bg-green-600/30 text-green-300 border border-green-500/30';
    case 'Allocated - Pending Issue': return 'bg-blue-600/30 text-blue-300 border border-blue-500/30';
    case 'Ready for Allocation': return 'bg-gray-600/30 text-gray-300 border border-gray-500/30';
    case 'Returned to Warehouse': return 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/30';
    default: return 'bg-gray-700/30 text-gray-400 border border-gray-600/30';
  }
};

const CuttingFabricAllocation = () => {
  const [allocations, setAllocations] = useState(mockFabricAllocations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredAllocations = allocations.filter(allocation => {
    const matchesSearch = Object.values(allocation).some(
      (value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'All' || allocation.status === filterStatus;
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
    alert(`View details for Allocation: ${id}`);
  };

  const handleEditAllocation = (id) => {
    alert(`Edit Allocation: ${id}`);
  };

  const handleIssueFabric = (id) => {
    // In a real app, this would update the status in your backend
    const updatedAllocations = allocations.map(alloc =>
      alloc.id === id && alloc.status === 'Allocated - Pending Issue'
        ? { ...alloc, status: 'Issued to Cutting', location: 'Cutting Floor A' }
        : alloc
    );
    setAllocations(updatedAllocations);
    alert(`Fabric ${id} marked as Issued to Cutting.`);
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
          <h1 className="text-3xl font-semibold tracking-tight">Fabric Allocation</h1>
          <p className="text-lg text-gray-400 mt-1">Manage and track fabric allocations for cutting orders.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <LuRefreshCcw className="w-4 h-4 mr-2" /> Sync
          </button>
          <button
            // This button could open a modal for new allocation or linking fabric to order
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-5 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <LuPlus className="w-4 h-4 mr-2" /> Allocate Fabric
          </button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-5">
        <div className="relative flex-grow">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Fabric Type, Lot No, Order ID..."
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
            <option value="Issued to Cutting">Issued to Cutting</option>
            <option value="Allocated - Pending Issue">Allocated - Pending Issue</option>
            <option value="Ready for Allocation">Ready for Allocation</option>
            <option value="Returned to Warehouse">Returned to Warehouse</option>
          </select>
        </div>
      </motion.div>

      {/* Allocations Table */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Allocation ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fabric Type / Lot</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity (Mtrs)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Allocated To Order</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredAllocations.length > 0 ? (
              filteredAllocations.map((allocation) => (
                <tr key={allocation.id} className="hover:bg-gray-700/40 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm font-medium text-gray-200">{allocation.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{allocation.fabricType} <br/> <span className="text-gray-500 text-xs">({allocation.lotNo} / {allocation.rollNo})</span></td>
                  <td className="px-6 py-4 text-sm text-gray-300">{allocation.quantityMeters.toFixed(1)}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{allocation.allocatedToOrder || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-300">{allocation.location}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getAllocationStatusBadge(allocation.status)}`}>
                      {allocation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleViewDetails(allocation.id)}
                        className="text-blue-400 hover:text-blue-300 p-1.5 rounded-full hover:bg-blue-900/40 transition-colors duration-200"
                        title="View Details"
                      >
                        <LuEye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditAllocation(allocation.id)}
                        className="text-yellow-400 hover:text-yellow-300 p-1.5 rounded-full hover:bg-yellow-900/40 transition-colors duration-200"
                        title="Edit Allocation"
                      >
                        <LuPencil className="w-5 h-5" />
                      </button>
                      {allocation.status === 'Allocated - Pending Issue' && (
                        <button
                          onClick={() => handleIssueFabric(allocation.id)}
                          className="text-teal-400 hover:text-teal-300 p-1.5 rounded-full hover:bg-teal-900/40 transition-colors duration-200"
                          title="Mark as Issued"
                        >
                          <LuArrowRightFromLine className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500 text-md italic">No fabric allocations found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default CuttingFabricAllocation;