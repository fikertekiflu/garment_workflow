// src/PackagingDashboard/PackagingTracking.jsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  LuTruck,          // Main icon for tracking
  LuPackage,        // Individual package icon
  LuCheck,          // Changed from LuCheckCircle to LuCheck
  LuHourglass,      // For in progress/pending status
  LuBuilding,       // For current location (warehouse/facility)
  LuMapPin,         // For destination
  LuClock,          // For last update
  LuBoxes           // For total packages stat
} from 'react-icons/lu'; // Using Lucide icons for consistency

// --- Expanded Mock Data for Packaging Tracking ---
const mockTrackingData = [
  {
    id: 'TRK001',
    packageId: 'PKG1001',
    orderId: 'ORD78901',
    style: 'Classic Polo Shirt',
    status: 'In Transit',
    currentLocation: 'Chicago, IL (Warehouse A)',
    destination: 'New York, USA',
    lastUpdate: '2025-06-03 10:30 AM',
    eta: '2025-06-05',
    trackingUrl: 'https://example.com/track/TRK001',
    isDelivered: false,
  },
  {
    id: 'TRK002',
    packageId: 'PKG1002',
    orderId: 'ORD78902',
    style: 'Denim Jeans',
    status: 'Delivered',
    currentLocation: 'Customer Site, London, UK',
    destination: 'London, UK',
    lastUpdate: '2025-06-02 03:45 PM',
    eta: '2025-06-02',
    trackingUrl: 'https://example.com/track/TRK002',
    isDelivered: true,
  },
  {
    id: 'TRK003',
    packageId: 'PKG1003',
    orderId: 'ORD78903',
    style: 'Summer Dress',
    status: 'Awaiting Pickup',
    currentLocation: 'Factory Loading Dock, Addis Ababa',
    destination: 'Paris, France',
    lastUpdate: '2025-06-03 09:00 AM',
    eta: '2025-06-07',
    trackingUrl: 'https://example.com/track/TRK003',
    isDelivered: false,
  },
  {
    id: 'TRK004',
    packageId: 'PKG1004',
    orderId: 'ORD78904',
    style: 'Hoodie (Unisex)',
    status: 'In Transit',
    currentLocation: 'Memphis, TN (Logistics Hub)',
    destination: 'Los Angeles, USA',
    lastUpdate: '2025-06-03 08:15 AM',
    eta: '2025-06-06',
    trackingUrl: 'https://example.com/track/TRK004',
    isDelivered: false,
  },
  {
    id: 'TRK005',
    packageId: 'PKG1005',
    orderId: 'ORD78905',
    style: 'Kid\'s T-Shirt',
    status: 'Processing',
    currentLocation: 'Packaging Line 3',
    destination: 'Berlin, Germany',
    lastUpdate: '2025-06-03 09:40 AM',
    eta: '2025-06-08',
    trackingUrl: 'https://example.com/track/TRK005',
    isDelivered: false,
  },
];

const PackagingTracking = () => {
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-400 bg-green-900/20';
      case 'In Transit':
        return 'text-blue-400 bg-blue-900/20';
      case 'Awaiting Pickup':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'Processing':
        return 'text-purple-400 bg-purple-900/20';
      default:
        return 'text-gray-400 bg-gray-700/20';
    }
  };

  return (
    <div className="flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div variants={pageVariants} initial="hidden" animate="visible">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center">
          <LuTruck className="mr-3 text-yellow-400" /> Packaging Tracking
        </h1>
        <p className="text-sm sm:text-lg text-gray-400 mt-1">
          Monitor the real-time status and location of all outbound packages.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuBoxes className="text-teal-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{mockTrackingData.length}</p>
          <p className="text-sm text-gray-400">Total Packages</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuHourglass className="text-orange-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{mockTrackingData.filter(p => !p.isDelivered).length}</p>
          <p className="text-sm text-gray-400">Packages In Transit / Pending</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          {/* Replaced LuCheckCircle with LuCheck */}
          <LuCheck className="text-lime-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{mockTrackingData.filter(p => p.isDelivered).length}</p>
          <p className="text-sm text-gray-400">Delivered Packages</p>
        </div>
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuBuilding className="text-indigo-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{new Set(mockTrackingData.map(p => p.currentLocation)).size}</p>
          <p className="text-sm text-gray-400">Active Locations</p>
        </div>
      </motion.div>

      {/* Individual Package Tracking Cards */}
      <motion.div variants={pageVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-6 text-gray-200 flex items-center">
          <LuPackage className="mr-2 text-blue-400" /> All Active Shipments
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTrackingData.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={itemVariants}
              className="bg-gray-700/50 p-5 rounded-lg shadow-md flex flex-col justify-between h-full hover:bg-gray-700 transition-colors duration-200 border border-gray-600/50"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">{pkg.packageId}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pkg.status)}`}>
                    {pkg.status}
                  </span>
                </div>
                <p className="text-gray-300 text-sm mb-1">
                  <span className="font-medium">Order:</span> {pkg.orderId}
                </p>
                <p className="text-gray-300 text-sm mb-3">
                  <span className="font-medium">Style:</span> {pkg.style}
                </p>
                <div className="space-y-2 text-sm text-gray-400 mt-4">
                  <p className="flex items-center">
                    <LuBuilding className="mr-2 text-gray-500" />
                    <span className="font-medium text-gray-300">Current:</span> {pkg.currentLocation}
                  </p>
                  <p className="flex items-center">
                    <LuMapPin className="mr-2 text-gray-500" />
                    <span className="font-medium text-gray-300">Destination:</span> {pkg.destination}
                  </p>
                  <p className="flex items-center">
                    <LuClock className="mr-2 text-gray-500" />
                    <span className="font-medium text-gray-300">Last Update:</span> {pkg.lastUpdate}
                  </p>
                  {!pkg.isDelivered && pkg.eta && (
                    <p className="flex items-center">
                      <LuHourglass className="mr-2 text-gray-500" />
                      <span className="font-medium text-gray-300">ETA:</span> {pkg.eta}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <a
                  href={pkg.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium text-sm transition-colors duration-200 flex items-center"
                >
                  <LuTruck className="mr-2" /> View Full Details
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PackagingTracking;