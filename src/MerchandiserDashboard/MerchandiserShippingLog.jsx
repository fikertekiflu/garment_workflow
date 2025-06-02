// src/MerchandiserDashboard/ShippingLog.jsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaSearch,
  FaSort,
  FaInfoCircle,
  FaShippingFast, // For shipping
  FaPlane,        // For air freight
  FaShip,         // For ocean freight
  FaTruck,        // For road freight
  FaCheckCircle,  // For delivered
  FaHourglassHalf, // For in transit/pending
  FaTimesCircle,  // For delayed/issues
  FaTrash,
  FaTimes,
  FaEdit,
  FaClipboardList // For shipping documents
} from 'react-icons/fa';

// --- Mock Data for Shipping Log ---
const mockShipments = [
  {
    id: 'SHIP-2025-001',
    orderId: 'ORD-2025-001',
    customer: 'Fashion Retail Co.',
    destination: 'New York, USA',
    totalQuantity: 15000,
    shippedQuantity: 15000,
    shippingDate: '2025-06-01',
    deliveryDate: '2025-06-08',
    carrier: 'DHL Express',
    trackingNumber: 'DHXNYK123456789',
    mode: 'Air Freight',
    status: 'Delivered',
    incoterms: 'FOB',
    notes: 'Proof of delivery received. Customer confirmed receipt.'
  },
  {
    id: 'SHIP-2025-002',
    orderId: 'ORD-2025-004',
    customer: 'Active Wearhouse',
    destination: 'London, UK',
    totalQuantity: 8000,
    shippedQuantity: 8000,
    shippingDate: '2025-05-28',
    deliveryDate: '', // Not delivered yet
    carrier: 'Maersk Line',
    trackingNumber: 'MRSMLD987654321',
    mode: 'Ocean Freight',
    status: 'In Transit',
    incoterms: 'CIF',
    notes: 'Vessel "Global Express" departed from Shanghai on schedule. ETA London: 2025-06-25.'
  },
  {
    id: 'SHIP-2025-003',
    orderId: 'ORD-2025-002',
    customer: 'Summer Styles Boutique',
    destination: 'Paris, France',
    totalQuantity: 10000,
    shippedQuantity: 5000, // Partial shipment
    shippingDate: '2025-06-05',
    deliveryDate: '',
    carrier: 'FedEx Freight',
    trackingNumber: 'FDXPAS000111222',
    mode: 'Air Freight',
    status: 'In Transit',
    incoterms: 'EXW',
    notes: 'First half of order shipped. Remaining 5000 units to be shipped by 2025-06-15.'
  },
  {
    id: 'SHIP-2025-004',
    orderId: 'ORD-2025-006', // New mock order
    customer: 'Local Distributors',
    destination: 'Berlin, Germany',
    totalQuantity: 7500,
    shippedQuantity: 0,
    shippingDate: '2025-06-10', // Planned, not actual
    deliveryDate: '',
    carrier: 'UPS Global',
    trackingNumber: '',
    mode: 'Road Freight',
    status: 'Pending Shipment',
    incoterms: 'DDP',
    notes: 'Goods ready for dispatch. Waiting for customs clearance documents.'
  },
  {
    id: 'SHIP-2025-005',
    orderId: 'ORD-2025-005',
    customer: 'East Coast Apparel',
    destination: 'Boston, USA',
    totalQuantity: 6000,
    shippedQuantity: 6000,
    shippingDate: '2025-05-20',
    deliveryDate: '',
    carrier: 'COSCO Shipping',
    trackingNumber: 'COSBO234567890',
    mode: 'Ocean Freight',
    status: 'Delayed (Customs)',
    incoterms: 'FOB',
    notes: 'Shipment held at US customs for additional inspection. Expected release date unknown.'
  }
];

const ShippingLog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newShipment, setNewShipment] = useState({
    orderId: '',
    customer: '',
    destination: '',
    totalQuantity: 0,
    shippedQuantity: 0,
    shippingDate: '',
    deliveryDate: '',
    carrier: '',
    trackingNumber: '',
    mode: 'Air Freight',
    status: 'Pending Shipment',
    incoterms: 'FOB',
    notes: ''
  });
  const [sortBy, setSortBy] = useState('shippingDate');
  const [sortOrder, setSortOrder] = useState('desc'); // Most recent shipments first

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const filteredAndSortedShipments = useMemo(() => {
    let filtered = mockShipments.filter(shipment => {
      const matchesSearch = searchTerm
        ? Object.values(shipment).some(value =>
            (typeof value === 'string' || typeof value === 'number') &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;
      const matchesStatus = filterStatus === 'All' || shipment.status === filterStatus;
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
      setSortOrder('desc'); // Default to descending for dates, can be toggled
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
      case 'Delivered':
        return 'text-green-400 bg-green-900/30';
      case 'In Transit':
        return 'text-blue-400 bg-blue-900/30';
      case 'Delayed (Customs)':
      case 'Delayed (Carrier)':
        return 'text-red-400 bg-red-900/30';
      case 'Pending Shipment':
        return 'text-yellow-400 bg-yellow-900/30';
      default:
        return 'text-gray-400 bg-gray-700/30';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'Air Freight': return <FaPlane className="inline-block mr-1" />;
      case 'Ocean Freight': return <FaShip className="inline-block mr-1" />;
      case 'Road Freight': return <FaTruck className="inline-block mr-1" />;
      default: return null;
    }
  };

  const handleAddNewShipment = (e) => {
    e.preventDefault();
    const newId = `SHIP-2025-${String(mockShipments.length + 1).padStart(3, '0')}`;
    const newRecord = { ...newShipment, id: newId };
    mockShipments.unshift(newRecord); // Add to the beginning for visibility
    setNewShipment({ // Reset form
      orderId: '', customer: '', destination: '', totalQuantity: 0,
      shippedQuantity: 0, shippingDate: '', deliveryDate: '', carrier: '',
      trackingNumber: '', mode: 'Air Freight', status: 'Pending Shipment',
      incoterms: 'FOB', notes: ''
    });
    setIsAddingNew(false);
    alert('New shipment added (mock)!');
  };

  const handleUpdateShipment = (e) => {
    e.preventDefault();
    const index = mockShipments.findIndex(s => s.id === selectedShipment.id);
    if (index !== -1) {
      mockShipments[index] = { ...selectedShipment };
    }
    setSelectedShipment(null);
    alert('Shipment updated (mock)!');
  };

  return (
    <div className="flex relative min-h-screen overflow-x-hidden bg-gray-900">
      {/* Main Content Area */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className={`flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out
                   ${selectedShipment || isAddingNew ? 'lg:mr-[min(500px,33vw)]' : ''} w-full`}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Shipping Log</h1>
            <p className="text-sm sm:text-lg text-gray-400 mt-1">Track and manage all outbound shipments to customers.</p>
          </div>
          <button
            onClick={() => { setSelectedShipment(null); setIsAddingNew(true); }}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 whitespace-nowrap"
          >
            <FaPlus className="w-4 h-4 mr-2" /> Add New Shipment
          </button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, Destination, Tracking No..."
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
              {['All', 'Pending Shipment', 'In Transit', 'Delivered', 'Delayed (Customs)', 'Delayed (Carrier)'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Shipping Log List Table */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaShippingFast className="mr-2 text-indigo-400" /> All Shipments ({filteredAndSortedShipments.length})
          </h3>
          {filteredAndSortedShipments.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <FaInfoCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg">No shipments found matching your criteria.</p>
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
                      onClick={() => handleSort('customer')}
                    >
                      Customer {getSortIcon('customer')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden lg:table-cell w-[15%]"
                      onClick={() => handleSort('destination')}
                    >
                      Destination {getSortIcon('destination')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell w-[15%]"
                      onClick={() => handleSort('shippingDate')}
                    >
                      Ship Date {getSortIcon('shippingDate')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer w-[15%]"
                      onClick={() => handleSort('status')}
                    >
                      Status {getSortIcon('status')}
                    </th>
                    <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[10%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredAndSortedShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-gray-800/80 transition-colors duration-150">
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium text-teal-300 overflow-hidden text-ellipsis whitespace-nowrap">
                        {shipment.orderId}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden md:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {shipment.customer}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden lg:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {getModeIcon(shipment.mode)} {shipment.destination}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden md:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {shipment.shippingDate}
                      </td>
                      <td className="py-2 px-2 sm:px-4 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                          {shipment.status}
                        </span>
                        {shipment.deliveryDate && shipment.status === 'Delivered' && (
                          <span className="text-xs text-gray-400 mt-1 block">Delivered: {shipment.deliveryDate}</span>
                        )}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium whitespace-nowrap">
                        <button
                          onClick={() => { setSelectedShipment(shipment); setIsAddingNew(false); }}
                          className="text-indigo-400 hover:text-indigo-600 mr-1 sm:mr-3 transition-colors duration-200 text-xs sm:text-sm"
                          title="View Details"
                        >
                          <FaEdit className="inline-block w-3 h-3 sm:w-4 sm:h-4" /> View/Edit
                        </button>
                        <button
                          onClick={() => alert(`Deleting shipment ${shipment.id}`)}
                          className="text-red-400 hover:text-red-600 transition-colors duration-200 text-xs sm:text-sm"
                          title="Delete Shipment"
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
        {(selectedShipment || isAddingNew) && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-full w-full sm:w-[80vw] md:w-[min(600px,60vw)] lg:w-[min(500px,33vw)]
                       bg-gray-900 border-l border-gray-700 shadow-2xl p-6 sm:p-8 z-50 overflow-y-auto custom-scrollbar"
          >
            <button
              onClick={() => { setSelectedShipment(null); setIsAddingNew(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors duration-200"
              title="Close Panel"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-3">
              {isAddingNew ? 'Add New Shipment' : `Shipment: ${selectedShipment.id}`}
            </h2>

            {isAddingNew ? (
              // Add New Shipment Form
              <form onSubmit={handleAddNewShipment} className="space-y-4 text-sm">
                <div>
                  <label htmlFor="new-ship-order-id" className="block text-gray-400 mb-1">Order ID</label>
                  <input
                    type="text"
                    id="new-ship-order-id"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newShipment.orderId}
                    onChange={(e) => setNewShipment({ ...newShipment, orderId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-customer" className="block text-gray-400 mb-1">Customer</label>
                  <input
                    type="text"
                    id="new-customer"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newShipment.customer}
                    onChange={(e) => setNewShipment({ ...newShipment, customer: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-destination" className="block text-gray-400 mb-1">Destination</label>
                  <input
                    type="text"
                    id="new-destination"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newShipment.destination}
                    onChange={(e) => setNewShipment({ ...newShipment, destination: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new-total-quantity" className="block text-gray-400 mb-1">Total Order Quantity</label>
                    <input
                      type="number"
                      id="new-total-quantity"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={newShipment.totalQuantity}
                      onChange={(e) => setNewShipment({ ...newShipment, totalQuantity: parseInt(e.target.value) || 0 })}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="new-shipped-quantity" className="block text-gray-400 mb-1">Shipped Quantity</label>
                    <input
                      type="number"
                      id="new-shipped-quantity"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={newShipment.shippedQuantity}
                      onChange={(e) => setNewShipment({ ...newShipment, shippedQuantity: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new-shipping-date" className="block text-gray-400 mb-1">Shipping Date</label>
                    <input
                      type="date"
                      id="new-shipping-date"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={newShipment.shippingDate}
                      onChange={(e) => setNewShipment({ ...newShipment, shippingDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="new-delivery-date" className="block text-gray-400 mb-1">Delivery Date (Actual)</label>
                    <input
                      type="date"
                      id="new-delivery-date"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={newShipment.deliveryDate}
                      onChange={(e) => setNewShipment({ ...newShipment, deliveryDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="new-carrier" className="block text-gray-400 mb-1">Carrier</label>
                  <input
                    type="text"
                    id="new-carrier"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newShipment.carrier}
                    onChange={(e) => setNewShipment({ ...newShipment, carrier: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="new-tracking-number" className="block text-gray-400 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    id="new-tracking-number"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newShipment.trackingNumber}
                    onChange={(e) => setNewShipment({ ...newShipment, trackingNumber: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new-mode" className="block text-gray-400 mb-1">Mode of Transport</label>
                    <select
                      id="new-mode"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={newShipment.mode}
                      onChange={(e) => setNewShipment({ ...newShipment, mode: e.target.value })}
                    >
                      <option value="Air Freight">Air Freight</option>
                      <option value="Ocean Freight">Ocean Freight</option>
                      <option value="Road Freight">Road Freight</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="new-incoterms" className="block text-gray-400 mb-1">Incoterms</label>
                    <select
                      id="new-incoterms"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={newShipment.incoterms}
                      onChange={(e) => setNewShipment({ ...newShipment, incoterms: e.target.value })}
                    >
                      <option value="EXW">EXW</option>
                      <option value="FOB">FOB</option>
                      <option value="CIF">CIF</option>
                      <option value="DDP">DDP</option>
                      <option value="DAP">DAP</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="new-ship-status" className="block text-gray-400 mb-1">Current Status</label>
                  <select
                    id="new-ship-status"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newShipment.status}
                    onChange={(e) => setNewShipment({ ...newShipment, status: e.target.value })}
                  >
                    {['Pending Shipment', 'In Transit', 'Delivered', 'Delayed (Customs)', 'Delayed (Carrier)'].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="new-ship-notes" className="block text-gray-400 mb-1">Notes</label>
                  <textarea
                    id="new-ship-notes"
                    rows="3"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newShipment.notes}
                    onChange={(e) => setNewShipment({ ...newShipment, notes: e.target.value })}
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
                    Add Shipment
                  </button>
                </div>
              </form>
            ) : (
              // Shipment Details View (Editable)
              <form onSubmit={handleUpdateShipment} className="space-y-4 text-sm">
                <p><strong className="text-gray-400">Order ID:</strong> {selectedShipment.orderId}</p>
                <p><strong className="text-gray-400">Customer:</strong> {selectedShipment.customer}</p>
                <p><strong className="text-gray-400">Destination:</strong> {selectedShipment.destination}</p>
                <p><strong className="text-gray-400">Total Order Quantity:</strong> {selectedShipment.totalQuantity.toLocaleString()}</p>
                <p><strong className="text-gray-400">Mode:</strong> {getModeIcon(selectedShipment.mode)} {selectedShipment.mode}</p>
                <p><strong className="text-gray-400">Incoterms:</strong> {selectedShipment.incoterms}</p>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="font-semibold text-gray-200 mb-3 flex items-center">
                    <FaClipboardList className="mr-2 text-yellow-400" /> Logistics Details
                  </h4>
                  <div>
                    <label htmlFor="edit-shipped-quantity" className="block text-gray-400 mb-1">Shipped Quantity</label>
                    <input
                      type="number"
                      id="edit-shipped-quantity"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedShipment.shippedQuantity}
                      onChange={(e) => setSelectedShipment({ ...selectedShipment, shippedQuantity: parseInt(e.target.value) || 0 })}
                      min="0"
                      max={selectedShipment.totalQuantity}
                    />
                  </div>
                  <div className="mt-3">
                    <label htmlFor="edit-shipping-date" className="block text-gray-400 mb-1">Shipping Date</label>
                    <input
                      type="date"
                      id="edit-shipping-date"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedShipment.shippingDate}
                      onChange={(e) => setSelectedShipment({ ...selectedShipment, shippingDate: e.target.value })}
                    />
                  </div>
                  <div className="mt-3">
                    <label htmlFor="edit-delivery-date" className="block text-gray-400 mb-1">Actual Delivery Date</label>
                    <input
                      type="date"
                      id="edit-delivery-date"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedShipment.deliveryDate}
                      onChange={(e) => setSelectedShipment({ ...selectedShipment, deliveryDate: e.target.value })}
                    />
                  </div>
                  <div className="mt-3">
                    <label htmlFor="edit-carrier" className="block text-gray-400 mb-1">Carrier</label>
                    <input
                      type="text"
                      id="edit-carrier"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedShipment.carrier}
                      onChange={(e) => setSelectedShipment({ ...selectedShipment, carrier: e.target.value })}
                    />
                  </div>
                  <div className="mt-3">
                    <label htmlFor="edit-tracking-number" className="block text-gray-400 mb-1">Tracking Number</label>
                    <input
                      type="text"
                      id="edit-tracking-number"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedShipment.trackingNumber}
                      onChange={(e) => setSelectedShipment({ ...selectedShipment, trackingNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <h4 className="font-semibold text-gray-200 mb-3 flex items-center">
                    <FaShippingFast className="mr-2 text-orange-400" /> Shipment Status
                  </h4>
                  <div>
                    <label htmlFor="edit-ship-status" className="block text-gray-400 mb-1">Current Status</label>
                    <select
                      id="edit-ship-status"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedShipment.status}
                      onChange={(e) => setSelectedShipment({ ...selectedShipment, status: e.target.value })}
                    >
                      {['Pending Shipment', 'In Transit', 'Delivered', 'Delayed (Customs)', 'Delayed (Carrier)'].map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3">
                    <label htmlFor="edit-ship-notes" className="block text-gray-400 mb-1">Notes / Communication</label>
                    <textarea
                      id="edit-ship-notes"
                      rows="3"
                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                      value={selectedShipment.notes}
                      onChange={(e) => setSelectedShipment({ ...selectedShipment, notes: e.target.value })}
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

export default ShippingLog;