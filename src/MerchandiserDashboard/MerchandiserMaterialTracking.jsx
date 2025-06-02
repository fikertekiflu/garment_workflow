// src/MerchandiserDashboard/MaterialTracking.jsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaSearch,
  FaSort,
  FaInfoCircle,
  FaBoxes,      // For materials/trims
  FaTruckMoving, // For in transit
  FaWarehouse,  // For received
  FaHourglassHalf, // For pending
  FaTrash,
  FaTimes,
  FaEdit,
  FaClipboardList, // For PO
  FaUserTie,     // For supplier
  FaCalendarAlt  // For dates
} from 'react-icons/fa';

// --- Mock Data for Material & Trim Tracking ---
const mockMaterials = [
  {
    id: 'MAT-2025-001',
    orderId: 'ORD-2025-001',
    itemDescription: 'Cotton Poplin Fabric - White',
    itemType: 'Fabric',
    supplier: 'Textile Innovations Inc.',
    poNumber: 'PO-FAB-001',
    orderedQuantity: 15000, // in meters or yards
    unit: 'Meters',
    receivedQuantity: 15000,
    eta: '2025-03-10',
    actualReceivedDate: '2025-03-08',
    status: 'Received',
    notes: 'Fabric received, quality checked, cleared for cutting.'
  },
  {
    id: 'TRIM-2025-001',
    orderId: 'ORD-2025-001',
    itemDescription: '20L White Button',
    itemType: 'Trim',
    supplier: 'Button World Ltd.',
    poNumber: 'PO-TRIM-001',
    orderedQuantity: 30000, // in pieces
    unit: 'Pcs',
    receivedQuantity: 30000,
    eta: '2025-03-15',
    actualReceivedDate: '2025-03-12',
    status: 'Received',
    notes: 'All buttons received. Match approved sample.'
  },
  {
    id: 'MAT-2025-002',
    orderId: 'ORD-2025-003',
    itemDescription: 'Fleece Fabric - Black',
    itemType: 'Fabric',
    supplier: 'Cozy Textiles Co.',
    poNumber: 'PO-FAB-002',
    orderedQuantity: 25000,
    unit: 'Yards',
    receivedQuantity: 0,
    eta: '2025-05-01',
    actualReceivedDate: '',
    status: 'Delayed',
    notes: 'Supplier informed 5-day delay due to production issue. New ETA 2025-05-06.'
  },
  {
    id: 'TRIM-2025-002',
    orderId: 'ORD-2025-003',
    itemDescription: '#5 Nylon Zipper - Black',
    itemType: 'Trim',
    supplier: 'ZipFast Solutions',
    poNumber: 'PO-TRIM-002',
    orderedQuantity: 25000,
    unit: 'Pcs',
    receivedQuantity: 25000,
    eta: '2025-04-20',
    actualReceivedDate: '2025-04-18',
    status: 'Received',
    notes: 'Zippers received ahead of schedule.'
  },
  {
    id: 'MAT-2025-005',
    orderId: 'ORD-2025-002',
    itemDescription: 'Rayon Challis - Floral Print',
    itemType: 'Fabric',
    supplier: 'Floral Fabric Mills',
    poNumber: 'PO-FAB-003',
    orderedQuantity: 10000,
    unit: 'Meters',
    receivedQuantity: 0,
    eta: '2025-06-01',
    actualReceivedDate: '',
    status: 'Ordered',
    notes: 'PO issued. Awaiting supplier confirmation.'
  },
];

const MaterialTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    orderId: '',
    itemDescription: '',
    itemType: 'Fabric',
    supplier: '',
    poNumber: '',
    orderedQuantity: 0,
    unit: 'Meters',
    receivedQuantity: 0,
    eta: '',
    actualReceivedDate: '',
    status: 'Ordered',
    notes: ''
  });
  const [sortBy, setSortBy] = useState('eta');
  const [sortOrder, setSortOrder] = useState('asc');

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const filteredAndSortedMaterials = useMemo(() => {
    let filtered = mockMaterials.filter(material => {
      const matchesSearch = searchTerm
        ? Object.values(material).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;
      const matchesStatus = filterStatus === 'All' || material.status === filterStatus;
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
      return 0; // Fallback
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
      case 'Received':
        return 'text-green-400 bg-green-900/30';
      case 'In Transit':
      case 'Ordered':
        return 'text-blue-400 bg-blue-900/30';
      case 'Delayed':
        return 'text-red-400 bg-red-900/30';
      case 'Partially Received':
        return 'text-orange-400 bg-orange-900/30';
      case 'Pending Order':
      default:
        return 'text-gray-400 bg-gray-700/30';
    }
  };

  const handleAddNewMaterial = (e) => {
    e.preventDefault();
    const newIdPrefix = newMaterial.itemType === 'Fabric' ? 'MAT' : 'TRIM';
    const newId = `${newIdPrefix}-2025-${String(mockMaterials.length + 1).padStart(3, '0')}`;
    const newRecord = { ...newMaterial, id: newId };
    mockMaterials.unshift(newRecord); // Add to the beginning for visibility
    setNewMaterial({ // Reset form
      orderId: '', itemDescription: '', itemType: 'Fabric', supplier: '', poNumber: '',
      orderedQuantity: 0, unit: 'Meters', receivedQuantity: 0, eta: '', actualReceivedDate: '',
      status: 'Ordered', notes: ''
    });
    setIsAddingNew(false);
    alert('New material/trim added (mock)!');
  };

  const handleUpdateMaterial = (e) => {
    e.preventDefault();
    const index = mockMaterials.findIndex(m => m.id === selectedMaterial.id);
    if (index !== -1) {
      mockMaterials[index] = { ...selectedMaterial };
    }
    setSelectedMaterial(null);
    alert('Material/Trim updated (mock)!');
  };

  return (
    <div className="flex relative min-h-screen overflow-x-hidden bg-gray-900">
      {/* Main Content Area */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className={`flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out
                   ${selectedMaterial || isAddingNew ? 'lg:mr-[min(500px,33vw)]' : ''} w-full`}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Material & Trim Tracking</h1>
            <p className="text-sm sm:text-lg text-gray-400 mt-1">Monitor the status and quantity of all raw materials and trims.</p>
          </div>
          <button
            onClick={() => { setSelectedMaterial(null); setIsAddingNew(true); }}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 whitespace-nowrap"
          >
            <FaPlus className="w-4 h-4 mr-2" /> Add New Material/Trim
          </button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Item, Order ID, Supplier, PO..."
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
              {['All', 'Ordered', 'In Transit', 'Received', 'Partially Received', 'Delayed'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Material/Trim List Table */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaBoxes className="mr-2 text-indigo-400" /> All Materials & Trims ({filteredAndSortedMaterials.length})
          </h3>
          {filteredAndSortedMaterials.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <FaInfoCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg">No materials or trims found matching your criteria.</p>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <table className="w-full divide-y divide-gray-700 table-fixed">
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer w-[20%]"
                      onClick={() => handleSort('id')}
                    >
                      ID {getSortIcon('id')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell w-[25%]"
                      onClick={() => handleSort('itemDescription')}
                    >
                      Item {getSortIcon('itemDescription')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden lg:table-cell w-[15%]"
                      onClick={() => handleSort('supplier')}
                    >
                      Supplier {getSortIcon('supplier')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell w-[10%]"
                      onClick={() => handleSort('orderedQuantity')}
                    >
                      Ordered {getSortIcon('orderedQuantity')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer w-[15%]"
                      onClick={() => handleSort('status')}
                    >
                      Status {getSortIcon('status')}
                    </th>
                    <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[15%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredAndSortedMaterials.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-800/80 transition-colors duration-150">
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium text-teal-300 overflow-hidden text-ellipsis whitespace-nowrap">
                        {material.id}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden md:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {material.itemDescription}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden lg:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {material.supplier}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden md:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {material.orderedQuantity.toLocaleString()} {material.unit}
                      </td>
                      <td className="py-2 px-2 sm:px-4 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(material.status)}`}>
                          {material.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium whitespace-nowrap">
                        <button
                          onClick={() => { setSelectedMaterial(material); setIsAddingNew(false); }}
                          className="text-indigo-400 hover:text-indigo-600 mr-1 sm:mr-3 transition-colors duration-200 text-xs sm:text-sm"
                          title="View Details"
                        >
                          <FaEdit className="inline-block w-3 h-3 sm:w-4 sm:h-4" /> View/Edit
                        </button>
                        <button
                          onClick={() => alert(`Deleting material/trim ${material.id}`)}
                          className="text-red-400 hover:text-red-600 transition-colors duration-200 text-xs sm:text-sm"
                          title="Delete Item"
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
        {(selectedMaterial || isAddingNew) && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-full w-full sm:w-[80vw] md:w-[min(600px,60vw)] lg:w-[min(500px,33vw)]
                       bg-gray-900 border-l border-gray-700 shadow-2xl p-6 sm:p-8 z-50 overflow-y-auto custom-scrollbar"
          >
            <button
              onClick={() => { setSelectedMaterial(null); setIsAddingNew(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors duration-200"
              title="Close Panel"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-3">
              {isAddingNew ? 'Add New Material/Trim' : `Details: ${selectedMaterial.id}`}
            </h2>

            {isAddingNew ? (
              // Add New Material/Trim Form
              <form onSubmit={handleAddNewMaterial} className="space-y-4 text-sm">
                <div>
                  <label htmlFor="new-order-id" className="block text-gray-400 mb-1">Order ID (Optional)</label>
                  <input
                    type="text"
                    id="new-order-id"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newMaterial.orderId}
                    onChange={(e) => setNewMaterial({ ...newMaterial, orderId: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="new-item-description" className="block text-gray-400 mb-1">Item Description</label>
                  <input
                    type="text"
                    id="new-item-description"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newMaterial.itemDescription}
                    onChange={(e) => setNewMaterial({ ...newMaterial, itemDescription: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-item-type" className="block text-gray-400 mb-1">Item Type</label>
                  <select
                    id="new-item-type"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newMaterial.itemType}
                    onChange={(e) => setNewMaterial({ ...newMaterial, itemType: e.target.value })}
                  >
                    <option value="Fabric">Fabric</option>
                    <option value="Trim">Trim</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="new-supplier" className="block text-gray-400 mb-1">Supplier</label>
                  <input
                    type="text"
                    id="new-supplier"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newMaterial.supplier}
                    onChange={(e) => setNewMaterial({ ...newMaterial, supplier: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-po-number" className="block text-gray-400 mb-1">PO Number</label>
                  <input
                    type="text"
                    id="new-po-number"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newMaterial.poNumber}
                    onChange={(e) => setNewMaterial({ ...newMaterial, poNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new-ordered-quantity" className="block text-gray-400 mb-1">Ordered Quantity</label>
                    <input
                      type="number"
                      id="new-ordered-quantity"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={newMaterial.orderedQuantity}
                      onChange={(e) => setNewMaterial({ ...newMaterial, orderedQuantity: parseInt(e.target.value) || 0 })}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="new-unit" className="block text-gray-400 mb-1">Unit</label>
                    <input
                      type="text"
                      id="new-unit"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={newMaterial.unit}
                      onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="new-received-quantity" className="block text-gray-400 mb-1">Received Quantity</label>
                  <input
                    type="number"
                    id="new-received-quantity"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newMaterial.receivedQuantity}
                    onChange={(e) => setNewMaterial({ ...newMaterial, receivedQuantity: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="new-eta" className="block text-gray-400 mb-1">Estimated Arrival (ETA)</label>
                  <input
                    type="date"
                    id="new-eta"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newMaterial.eta}
                    onChange={(e) => setNewMaterial({ ...newMaterial, eta: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="new-actual-received-date" className="block text-gray-400 mb-1">Actual Received Date</label>
                  <input
                    type="date"
                    id="new-actual-received-date"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newMaterial.actualReceivedDate}
                    onChange={(e) => setNewMaterial({ ...newMaterial, actualReceivedDate: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="new-status" className="block text-gray-400 mb-1">Status</label>
                  <select
                    id="new-status"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newMaterial.status}
                    onChange={(e) => setNewMaterial({ ...newMaterial, status: e.target.value })}
                  >
                    {['Ordered', 'In Transit', 'Received', 'Partially Received', 'Delayed'].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="new-notes" className="block text-gray-400 mb-1">Notes</label>
                  <textarea
                    id="new-notes"
                    rows="3"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newMaterial.notes}
                    onChange={(e) => setNewMaterial({ ...newMaterial, notes: e.target.value })}
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
                    Add Item
                  </button>
                </div>
              </form>
            ) : (
              // Material/Trim Details View
              <form onSubmit={handleUpdateMaterial} className="space-y-4 text-sm"> {/* Changed to form for editable fields */}
                <p><strong className="text-gray-400">Order ID:</strong> {selectedMaterial.orderId || 'N/A'}</p>
                <p><strong className="text-gray-400">Item Type:</strong> {selectedMaterial.itemType}</p>
                <p><strong className="text-gray-400">Item Description:</strong> {selectedMaterial.itemDescription}</p>
                <p><strong className="text-gray-400">Supplier:</strong> {selectedMaterial.supplier}</p>
                <p><strong className="text-gray-400">PO Number:</strong> {selectedMaterial.poNumber}</p>
                <p><strong className="text-gray-400">Ordered Quantity:</strong> {selectedMaterial.orderedQuantity.toLocaleString()} {selectedMaterial.unit}</p>

                <div>
                  <label htmlFor="edit-received-quantity" className="block text-gray-400 mb-1">Received Quantity</label>
                  <input
                    type="number"
                    id="edit-received-quantity"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={selectedMaterial.receivedQuantity}
                    onChange={(e) => setSelectedMaterial({ ...selectedMaterial, receivedQuantity: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="edit-eta" className="block text-gray-400 mb-1">Estimated Arrival (ETA)</label>
                  <input
                    type="date"
                    id="edit-eta"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={selectedMaterial.eta}
                    onChange={(e) => setSelectedMaterial({ ...selectedMaterial, eta: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="edit-actual-received-date" className="block text-gray-400 mb-1">Actual Received Date</label>
                  <input
                    type="date"
                    id="edit-actual-received-date"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={selectedMaterial.actualReceivedDate}
                    onChange={(e) => setSelectedMaterial({ ...selectedMaterial, actualReceivedDate: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="edit-status" className="block text-gray-400 mb-1">Status</label>
                  <select
                    id="edit-status"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={selectedMaterial.status}
                    onChange={(e) => setSelectedMaterial({ ...selectedMaterial, status: e.target.value })}
                  >
                    {['Ordered', 'In Transit', 'Received', 'Partially Received', 'Delayed'].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-notes" className="block text-gray-400 mb-1">Notes</label>
                  <textarea
                    id="edit-notes"
                    rows="3"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={selectedMaterial.notes}
                    onChange={(e) => setSelectedMaterial({ ...selectedMaterial, notes: e.target.value })}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Save Changes (Mock)
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

export default MaterialTracking;