import React, { useState, useMemo } from 'react';
// Using LuCheck as workaround for LuCheckSquare
// Using LuFilePen as workaround for LuFileEdit
// Assuming LuTriangleAlert, LuArchive, LuClock are okay from previous workarounds
import {
  LuPackageCheck,
  LuFilePen, // Changed from LuFileEdit
  LuSearch,
  LuSlidersHorizontal,
  LuCalendarClock,
  LuUser,
  LuFileText,
  LuPrinter,
  LuCheck,
  LuHourglass,
  LuArchive,
  LuTruck,
  LuTriangleAlert
} from 'react-icons/lu';

// Mock Outgoing Shipment Data
const outgoingShipments = [
  { id: 'ORD001', customer: 'Retail Partner A', dispatchBy: '2025-05-10', status: 'Pending Packing', items: ['Men\'s Denim Shirt - M (20pcs)', 'Women\'s Blouse - S (15pcs)'], priority: 'High' },
  { id: 'ORD002', customer: 'Online Store Order #ECOM123', dispatchBy: '2025-05-09', status: 'Packed', items: ['Kids T-Shirt - Blue (5pcs)'], priority: 'Medium' },
  { id: 'ORD003', customer: 'Bulk Order #B789', dispatchBy: '2025-05-11', status: 'Dispatched', items: ['Assorted Garments (500pcs)'], priority: 'High', dispatchedDate: '2025-05-08', tracking: 'TRK12345XYZ' },
  { id: 'ORD004', customer: 'Retail Partner B', dispatchBy: '2025-05-12', status: 'Pending Packing', items: ['Summer Dresses (30pcs)'], priority: 'Medium' },
  { id: 'ORD005', customer: 'Sample Request #S012', dispatchBy: '2025-05-08', status: 'Delivered', items: ['Sample Garments (3pcs)'], priority: 'Low', dispatchedDate: '2025-05-06', deliveredDate: '2025-05-07' },
];

// Helper for status pills
const getDispatchStatusPill = (status) => {
  switch (status) {
    case 'Pending Packing': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center"><LuHourglass className="w-3 h-3 mr-1.5"/>Pending</span>;
    case 'Packed': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center"><LuArchive className="w-3 h-3 mr-1.5"/>Packed</span>;
    case 'Dispatched': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center"><LuTruck className="w-3 h-3 mr-1.5"/>Dispatched</span>;
    case 'Delivered': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30 flex items-center"><LuCheck className="w-3 h-3 mr-1.5"/>Delivered</span>;
    default: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30">{status}</span>;
  }
};

const getPriorityColorText = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
};

// --- Component Start ---
const WarehouseOutgoing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handlePrepareDispatch = () => alert('Prepare New Dispatch form/modal would open.');
  const handleViewOrder = (orderId) => alert(`Viewing details for Order ID ${orderId}.`);
  const handleUpdateDispatchStatus = (orderId) => alert(`Updating status for Order ID ${orderId}.`);

  const statuses = useMemo(() => ['All', ...new Set(outgoingShipments.map(s => s.status))], []);

  const filteredShipments = useMemo(() => {
    return outgoingShipments.filter(shipment => {
      const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            shipment.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [outgoingShipments, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center">
          <LuPackageCheck className="mr-3 text-teal-400" /> Outgoing Shipments
        </h1>
        <button
          onClick={handlePrepareDispatch}
          className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg"
        >
          {/* Using LuFilePen as workaround */}
          <LuFilePen className="w-4 h-4 mr-2" /> Prepare Dispatch
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-800/40 rounded-lg border border-gray-700/50">
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2.5 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2.5 px-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 appearance-none"
        >
          {statuses.map(stat => <option key={stat} value={stat}>{stat === 'All' ? 'All Statuses' : stat}</option>)}
        </select>
      </div>

      {/* Outgoing Shipments Grid */}
      {filteredShipments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShipments.map((shipment) => (
            <div key={shipment.id} className="bg-gradient-to-br from-gray-800 to-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 p-5 flex flex-col transition-all duration-300 hover:shadow-teal-500/20 hover:border-teal-500/40">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-semibold text-gray-100">{shipment.id} - {shipment.customer}</h3>
                {getDispatchStatusPill(shipment.status)}
              </div>
              <p className={`text-xs font-semibold mb-2 ${getPriorityColorText(shipment.priority)}`}>{shipment.priority} Priority</p>

              <div className="text-sm text-gray-300 mb-3 flex-grow">
                <p className="font-medium text-gray-400 text-xs mb-1">Key Items:</p>
                <ul className="list-disc list-inside pl-1 space-y-0.5 text-xs">
                  {shipment.items.slice(0, 2).map((item, idx) => <li key={idx} className="truncate" title={item}>{item}</li>)}
                  {shipment.items.length > 2 && <li className="text-gray-500 italic">+{shipment.items.length - 2} more...</li>}
                </ul>
              </div>
                {shipment.tracking && <p className="text-xs text-blue-400/80 mt-1 mb-3">Tracking: {shipment.tracking}</p>}

              <div className="mt-auto pt-3 border-t border-gray-700/30 flex justify-between items-center">
                <div className="text-xs text-gray-400 flex items-center">
                    <LuCalendarClock className="w-3.5 h-3.5 mr-1.5 text-gray-500"/>
                    Dispatch By: {shipment.dispatchBy}
                    {shipment.dispatchedDate && <span className="ml-2 text-green-400">(Sent: {shipment.dispatchedDate})</span>}
                </div>
                <div className="space-x-2">
                    <button onClick={() => handleViewOrder(shipment.id)} className="text-gray-400 hover:text-teal-300 transition-colors text-xs font-medium" title="View Details">Details</button>
                    {shipment.status === 'Packed' &&
                        <button onClick={() => handleUpdateDispatchStatus(shipment.id)} className="text-teal-400 hover:text-teal-300 transition-colors text-xs font-medium" title="Mark as Dispatched">Dispatch</button>
                    }
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-12 px-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <LuPackageCheck className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 text-lg">No outgoing shipments match your filters.</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria.</p>
         </div>
      )}
    </div>
  );
};

export default WarehouseOutgoing;
