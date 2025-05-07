import React, { useState, useMemo } from 'react';
// Using LuCheck as workaround for LuCheckSquare
// Using LuUser as workaround for LuUserCircle
// Using LuTriangleAlert as workaround for LuAlertCircle
import {
  LuTruck,
  LuScanLine,
  LuSearch,
  LuSlidersHorizontal,
  LuCalendarDays,
  LuUser, // Changed from LuUserCircle
  LuArchive,
  LuCheck, // Changed from LuCheckSquare
  LuClock,
  LuTriangleAlert
} from 'react-icons/lu';

// Mock Incoming Shipment Data
const incomingShipments = [
  { id: 'SHP001', supplier: 'Fabric Mill Inc.', expectedDate: '2025-05-10', status: 'Expected', items: ['Blue Denim (500m)', 'Cotton Twill (200m)'], poNumber: 'PO-2025-075' },
  { id: 'SHP002', supplier: 'Trim Supplier Co.', expectedDate: '2025-05-08', status: 'Received', items: ['Metal Buttons (5000pcs)', 'Nylon Zippers (1000pcs)'], poNumber: 'PO-2025-076', receivedDate: '2025-05-07' },
  { id: 'SHP003', supplier: 'Local Thread Co.', expectedDate: '2025-05-09', status: 'Delayed', items: ['Polyester Thread (50 cones)'], poNumber: 'PO-2025-077', notes: 'Supplier communication: 1 day delay' },
  { id: 'SHP004', supplier: 'Packaging Solutions Ltd.', expectedDate: '2025-05-11', status: 'Expected', items: ['Shipping Boxes (200)', 'Packing Tape (50 rolls)'], poNumber: 'PO-2025-078' },
  { id: 'SHP005', supplier: 'Fabric Mill Inc.', expectedDate: '2025-05-12', status: 'Partially Received', items: ['Red Silk (100m received, 50m pending)'], poNumber: 'PO-2025-079', receivedDate: '2025-05-11', notes: 'Partial delivery due to stock issue at supplier.' },
];

// Helper for status pills
const getShipmentStatusPill = (status) => {
  switch (status) {
    case 'Expected': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center"><LuClock className="w-3 h-3 mr-1.5"/>Expected</span>;
    // Using LuCheck as workaround
    case 'Received': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30 flex items-center"><LuCheck className="w-3 h-3 mr-1.5"/>Received</span>;
    case 'Delayed': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center"><LuTriangleAlert className="w-3 h-3 mr-1.5"/>Delayed</span>;
    case 'Partially Received': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center"><LuArchive className="w-3 h-3 mr-1.5"/>Partial</span>;
    default: return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/30">{status}</span>;
  }
};

// --- Component Start ---
const WarehouseIncoming = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleLogDelivery = () => alert('Log New Delivery form/modal would open.');
  const handleViewShipment = (shipmentId) => alert(`Viewing details for Shipment ID ${shipmentId}.`);
  const handleMarkReceived = (shipmentId) => alert(`Marking Shipment ID ${shipmentId} as fully received.`);

  const statuses = useMemo(() => ['All', ...new Set(incomingShipments.map(s => s.status))], []);

  const filteredShipments = useMemo(() => {
    return incomingShipments.filter(shipment => {
      const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            shipment.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            shipment.poNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || shipment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [incomingShipments, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center">
          <LuTruck className="mr-3 text-blue-400" /> Incoming Shipments
        </h1>
        <button
          onClick={handleLogDelivery}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg"
        >
          <LuScanLine className="w-4 h-4 mr-2" /> Log New Delivery
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-800/40 rounded-lg border border-gray-700/50">
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, Supplier, PO..."
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

      {/* Incoming Shipments Grid */}
      {filteredShipments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShipments.map((shipment) => (
            <div key={shipment.id} className="bg-gradient-to-br from-gray-800 to-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 p-5 flex flex-col transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-500/40">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-semibold text-gray-100">{shipment.id} - {shipment.supplier}</h3>
                {getShipmentStatusPill(shipment.status)}
              </div>
              <p className="text-xs text-gray-500 font-mono mb-2">PO: {shipment.poNumber}</p>

              <div className="text-sm text-gray-300 mb-3 flex-grow">
                <p className="font-medium text-gray-400 text-xs mb-1">Key Items:</p>
                <ul className="list-disc list-inside pl-1 space-y-0.5 text-xs">
                  {shipment.items.slice(0, 2).map((item, idx) => <li key={idx} className="truncate" title={item}>{item}</li>)}
                  {shipment.items.length > 2 && <li className="text-gray-500 italic">+{shipment.items.length - 2} more...</li>}
                </ul>
              </div>
                {shipment.notes && <p className="text-xs text-yellow-400/80 italic mt-1 mb-3 p-2 bg-yellow-500/10 rounded-md border border-yellow-500/20"><LuTriangleAlert className="inline w-3 h-3 mr-1"/> {shipment.notes}</p>}

              <div className="mt-auto pt-3 border-t border-gray-700/30 flex justify-between items-center">
                <div className="text-xs text-gray-400 flex items-center">
                    <LuCalendarDays className="w-3.5 h-3.5 mr-1.5 text-gray-500"/>
                    Exp: {shipment.expectedDate}
                    {shipment.receivedDate && <span className="ml-2 text-green-400">(Rec: {shipment.receivedDate})</span>}
                </div>
                <div className="space-x-2">
                    <button onClick={() => handleViewShipment(shipment.id)} className="text-gray-400 hover:text-teal-300 transition-colors text-xs font-medium" title="View Details">Details</button>
                    {shipment.status !== 'Received' &&
                        <button onClick={() => handleMarkReceived(shipment.id)} className="text-green-400 hover:text-green-300 transition-colors text-xs font-medium" title="Mark as Received">Receive</button>
                    }
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-12 px-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <LuTruck className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 text-lg">No incoming shipments match your filters.</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter criteria.</p>
         </div>
      )}
    </div>
  );
};

export default WarehouseIncoming;
