import React, { useState, useMemo } from 'react';
// Using LuPlus as workaround for LuPlusCircle
// Using LuShieldAlert as workaround for LuAlertCircle
// Using LuPencil as workaround for LuEdit
// Using LuEllipsis as workaround for LuMoreVertical
import {
  LuBoxes,
  LuSearch,
  LuSlidersHorizontal,
  LuPlus,
  LuPencil,
  LuArchiveRestore,
  LuShieldAlert, // Changed from LuAlertCircle
  LuPackage,
  LuMapPin,
  LuRefreshCw,
  LuEllipsis
} from 'react-icons/lu';

// Mock Inventory Data
const inventoryItems = [
  { id: 'FAB001', name: 'Blue Denim Fabric (12oz)', category: 'Fabric Rolls', quantity: 150, unit: 'meters', location: 'A-01-01', status: 'In Stock', lastUpdated: '2025-05-06', lowStockThreshold: 50 },
  { id: 'FAB002', name: 'White Cotton Twill (Light)', category: 'Fabric Rolls', quantity: 80, unit: 'meters', location: 'A-01-02', status: 'In Stock', lastUpdated: '2025-05-05', lowStockThreshold: 30 },
  { id: 'TRM001', name: 'Metal Buttons - Silver Antique', category: 'Trims & Accessories', quantity: 2500, unit: 'pcs', location: 'B-03-05', status: 'In Stock', lastUpdated: '2025-05-07', lowStockThreshold: 500 },
  { id: 'TRM002', name: 'Nylon Zippers - Black #5', category: 'Trims & Accessories', quantity: 30, unit: 'pcs', location: 'B-04-01', status: 'Low Stock', lastUpdated: '2025-05-07', lowStockThreshold: 50 },
  { id: 'FIN001', name: 'Men\'s Denim Shirt - Medium', category: 'Finished Goods', quantity: 35, unit: 'pcs', location: 'C-01-10', status: 'In Stock', lastUpdated: '2025-05-04', lowStockThreshold: 10 },
  { id: 'FIN002', name: 'Women\'s Cotton Blouse - Small', category: 'Finished Goods', quantity: 5, unit: 'pcs', location: 'C-02-03', status: 'Low Stock', lastUpdated: '2025-05-05', lowStockThreshold: 5 },
  { id: 'FAB003', name: 'Red Silk Charmeuse', category: 'Fabric Rolls', quantity: 0, unit: 'meters', location: 'A-02-01', status: 'Out of Stock', lastUpdated: '2025-05-01', lowStockThreshold: 10 },
];

// Helper to determine item status and color - Refined Pill Style
const getItemStatusPill = (item) => {
  let pillClasses = "px-2.5 py-1 text-xs font-medium rounded-full flex items-center justify-center min-w-[100px] "; // Added min-width
  if (item.status === 'Out of Stock' || item.quantity === 0) {
    pillClasses += "bg-red-700/30 text-red-300 border border-red-600/50";
    return <span className={pillClasses}>Out of Stock</span>;
  }
  if (item.status === 'Low Stock' || item.quantity <= item.lowStockThreshold) {
    pillClasses += "bg-yellow-700/30 text-yellow-300 border border-yellow-600/50";
    // Using LuShieldAlert as workaround for LuAlertCircle
    return <span className={pillClasses}><LuShieldAlert className="w-3.5 h-3.5 mr-1.5"/>Low Stock</span>;
  }
  pillClasses += "bg-green-700/30 text-green-300 border border-green-600/50";
  return <span className={pillClasses}>In Stock</span>;
};


// --- Component Start ---
const WarehouseInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleAddItem = () => alert('Add New Item form/modal would open.');
  const handleEditItem = (itemId) => alert(`Edit Item form for ID ${itemId} would open.`);
  const handleUpdateStock = (itemId) => alert(`Update Stock modal for ID ${itemId} would open.`);

  const categories = useMemo(() => ['All', ...new Set(inventoryItems.map(item => item.category))], []);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' ||
                            (statusFilter === 'In Stock' && item.quantity > item.lowStockThreshold && item.quantity > 0) ||
                            (statusFilter === 'Low Stock' && item.quantity <= item.lowStockThreshold && item.quantity > 0) ||
                            (statusFilter === 'Out of Stock' && item.quantity === 0);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [inventoryItems, searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="space-y-8 text-white font-sans"> {/* Increased main spacing */}
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center">
          <LuBoxes className="mr-3 text-teal-400" /> Inventory Management
        </h1>
        <button
          onClick={handleAddItem}
          className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-5 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <LuPlus className="w-4 h-4 mr-2" /> Add New Item
        </button>
      </div>

      {/* Filters and Search Bar - Refined Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 bg-gray-800/50 rounded-xl border border-gray-700/60 shadow-md">
        <div className="relative">
          <LuSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search ID, Name, Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700/60 border border-gray-600/80 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full bg-gray-700/60 border border-gray-600/80 rounded-lg py-2.5 px-3.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-gray-700/60 border border-gray-600/80 rounded-lg py-2.5 px-3.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
        >
          <option value="All">All Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Inventory List View */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-gray-800/50 border border-gray-700/60 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Item Name & ID (Larger Column) */}
                <div className="md:col-span-4">
                  <h3 className="text-base font-semibold text-gray-100 mb-0.5 truncate" title={item.name}>{item.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">ID: {item.id}</p>
                </div>

                {/* Category & Location (Medium Column) */}
                <div className="md:col-span-3 text-xs text-gray-400 space-y-1">
                    <p className="flex items-center"><LuPackage className="w-3.5 h-3.5 mr-1.5 text-gray-500"/> {item.category}</p>
                    <p className="flex items-center"><LuMapPin className="w-3.5 h-3.5 mr-1.5 text-gray-500"/> {item.location}</p>
                </div>

                {/* Quantity (Small Column) */}
                <div className="md:col-span-2 text-center md:text-left">
                  <p className="text-lg font-semibold text-gray-100">{item.quantity}</p>
                  <p className="text-xs text-gray-500">{item.unit}</p>
                </div>

                {/* Status (Medium Column) */}
                <div className="md:col-span-2 flex justify-center md:justify-start">
                    {getItemStatusPill(item)}
                </div>

                {/* Actions (Smallest Column) */}
                <div className="md:col-span-1 flex justify-center md:justify-end space-x-2">
                  <button onClick={() => handleUpdateStock(item.id)} className="p-1.5 text-teal-400 hover:text-teal-300 hover:bg-gray-700 rounded-md transition-colors" title="Update Stock">
                    <LuArchiveRestore className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEditItem(item.id)} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-md transition-colors" title="Edit Item">
                    <LuPencil className="w-4 h-4" />
                  </button>
                  {/* Conceptual: More actions could be in a dropdown, using LuEllipsis */}
                  {/* <button className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-md transition-colors" title="More Actions">
                    <LuEllipsis className="w-4 h-4" />
                  </button> */}
                </div>
              </div>
               <div className="px-5 pb-3 pt-2 border-t border-gray-700/40 text-right">
                    <p className="text-xs text-gray-500 flex items-center justify-end">
                        <LuRefreshCw className="w-3 h-3 mr-1.5"/> Last Updated: {item.lastUpdated}
                    </p>
               </div>
            </div>
          ))}
        </div>
      ) : (
         <div className="text-center py-16 px-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <LuSearch className="w-16 h-16 mx-auto text-gray-500 mb-5" />
            <p className="text-gray-300 text-xl">No inventory items match your filters.</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
         </div>
      )}
    </div>
  );
};

export default WarehouseInventory;
