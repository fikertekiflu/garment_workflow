// src/PackagingDashboard/MaterialUsage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  LuBoxes,           // Main icon for Material Usage
  LuPackage,         // Icon for unique material types
  LuMinus,           // Changed from LuAlertCircle to LuMinus
  LuWarehouse,       // Icon for total inventory/stock
  LuCalendarClock,   // Icon for last used material
  LuRepeat           // Icon for reorder action
} from 'react-icons/lu';

// --- Mock Data for Packaging Materials ---
const mockMaterials = [
  { id: 'MAT001', name: 'Polybag (Small)', sku: 'PB001', currentStock: 50000, unit: 'pcs', reorderLevel: 10000, lastUsed: '2025-06-03' },
  { id: 'MAT002', name: 'Polybag (Medium)', sku: 'PB002', currentStock: 12000, unit: 'pcs', reorderLevel: 15000, lastUsed: '2025-06-03' }, // Low stock
  { id: 'MAT003', name: 'Carton Box (Small)', sku: 'CB001', currentStock: 800, unit: 'pcs', reorderLevel: 500, lastUsed: '2025-06-02' },
  { id: 'MAT004', name: 'Carton Box (Medium)', sku: 'CB002', currentStock: 300, unit: 'pcs', reorderLevel: 1000, lastUsed: '2025-06-03' }, // Low stock
  { id: 'MAT005', name: 'Hangtag (Branded)', sku: 'HT001', currentStock: 25000, unit: 'pcs', reorderLevel: 5000, lastUsed: '2025-06-01' },
  { id: 'MAT006', name: 'Care Label Roll', sku: 'CL001', currentStock: 1500, unit: 'meters', reorderLevel: 2000, lastUsed: '2025-06-02' }, // Low stock
  { id: 'MAT007', name: 'Mailer Bag (Large)', sku: 'MB001', currentStock: 7000, unit: 'pcs', reorderLevel: 2000, lastUsed: '2025-06-03' },
  { id: 'MAT008', name: 'Stretch Film', sku: 'SF001', currentStock: 50, unit: 'rolls', reorderLevel: 100, lastUsed: '2025-05-30' }, // Low stock
  { id: 'MAT009', name: 'Bubble Wrap', sku: 'BW001', currentStock: 200, unit: 'meters', reorderLevel: 50, lastUsed: '2025-06-01' },
];

const MaterialUsage = () => {
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // --- Calculate Summary Stats ---
  const totalMaterialTypes = mockMaterials.length;
  const lowStockMaterials = mockMaterials.filter(m => m.currentStock <= m.reorderLevel);
  const totalCurrentStockUnits = mockMaterials.reduce((sum, m) => sum + m.currentStock, 0);

  // Find the most recently used material for the summary card
  const mostRecentlyUsedMaterial = mockMaterials.reduce((latest, current) => {
    return (new Date(current.lastUsed) > new Date(latest.lastUsed)) ? current : latest;
  }, mockMaterials[0]); // Start with the first item

  // --- Helper to get stock status color ---
  const getStockStatusColor = (material) => {
    if (material.currentStock <= material.reorderLevel) {
      return 'bg-red-100 text-red-800'; // Critical / Low stock
    }
    if (material.currentStock < material.reorderLevel * 1.5) {
      return 'bg-orange-100 text-orange-800'; // Warning / Approaching reorder
    }
    return 'bg-green-100 text-green-800'; // Healthy stock
  };

  return (
    <div className="flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div variants={pageVariants} initial="hidden" animate="visible">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center">
          <LuBoxes className="mr-3 text-emerald-400" /> Material Usage & Inventory
        </h1>
        <p className="text-sm sm:text-lg text-gray-400 mt-1">
          Monitor stock levels, reorder points, and usage patterns of all packaging materials.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Unique Material Types */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuPackage className="text-blue-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{totalMaterialTypes}</p>
          <p className="text-sm text-gray-400">Unique Material Types</p>
        </div>
        {/* Card 2: Materials Low in Stock */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          {/* Changed icon to LuMinus */}
          <LuMinus className="text-red-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{lowStockMaterials.length}</p>
          <p className="text-sm text-gray-400">Materials Low in Stock</p>
        </div>
        {/* Card 3: Total Units in Stock */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuWarehouse className="text-purple-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{totalCurrentStockUnits.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Total Units in Stock</p>
        </div>
        {/* Card 4: Most Recently Used Material */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuCalendarClock className="text-yellow-400 text-3xl mb-3" />
          <p className="text-lg font-bold">
            {mostRecentlyUsedMaterial ? mostRecentlyUsedMaterial.name : 'N/A'}
          </p>
          <p className="text-sm text-gray-400">Most Recently Used</p>
        </div>
      </motion.div>

      {/* Material Inventory List */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-6 text-gray-200 flex items-center">
          <LuWarehouse className="mr-2 text-indigo-400" /> Current Material Inventory
        </h3>
        <div className="w-full">
          <table className="min-w-full divide-y divide-gray-700 table-auto">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Material Name
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  SKU
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Unit
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Reorder Level
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Last Used
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {mockMaterials.map(material => (
                <tr key={material.id} className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300">{material.name}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">{material.sku}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusColor(material)}`}>
                      {material.currentStock.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">{material.unit}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden lg:table-cell">{material.reorderLevel.toLocaleString()}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">{material.lastUsed}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button
                      onClick={() => alert(`Reordering ${material.name}`)}
                      className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded-md transition-colors duration-200"
                    >
                      <LuRepeat className="inline-block mr-1 w-3 h-3" /> Reorder
                    </button>
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

export default MaterialUsage;