// src/MerchandiserDashboard/MerchandiserSidebar.jsx

import React from 'react';
import {
  FaTachometerAlt,      // Overview/Dashboard
  FaClipboardList,      // Order Tracking / Daily Follow Up (like the sheet)
  FaPalette,            // Sample Management
  FaBoxes,              // Material Tracking (Fabric & Trims)
  FaCogs,               // Production Monitoring
  FaShippingFast,       // Shipping Log
  FaChartLine,          // Reports / Analytics
  FaSignOutAlt          // Logout
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const MerchandiserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(`/dashboard/merchandiser/${path}`);
  };

  const handleLogout = () => {
    // In a real app, clear tokens/roles here
    navigate('/login');
  };

  const menuItems = [
    { name: 'Overview', icon: FaTachometerAlt, path: 'overview' },
    { name: 'Order Tracking', icon: FaClipboardList, path: 'order-tracking' },
    { name: 'Sample Management', icon: FaPalette, path: 'sample-management' },
    { name: 'Material Tracking', icon: FaBoxes, path: 'material-tracking' },
    { name: 'Production Monitoring', icon: FaCogs, path: 'production-monitoring' },
    { name: 'Shipping Log', icon: FaShippingFast, path: 'shipping-log' },
    { name: 'Analytics & Reports', icon: FaChartLine, path: 'reports' },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col fixed top-0 left-0 shadow-lg border-r border-gray-700/50">
      {/* Universal Logo/Brand Area: "Hidet Workflow" with Teal/Blue gradient */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700/50">
         <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            {/* Consistent Logo Placeholder */}
            <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm">
              HW
            </div>
            {/* Consistent System Name */}
            <span className="text-xl font-semibold text-white tracking-tight">
              Hidet Workflow
            </span>
          </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow mt-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === `/dashboard/merchandiser/${item.path}` ||
                           (location.pathname === '/dashboard/merchandiser' && item.path === 'overview');

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 group ${
                isActive
                  ? 'bg-teal-600/30 text-white shadow-inner' // UNIVERSAL ACTIVE STATE (Admin's teal/blue)
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white' // Inactive state styles
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                isActive
                  ? 'text-teal-300' // UNIVERSAL ACTIVE ICON COLOR (Admin's teal/blue)
                  : 'text-gray-500 group-hover:text-teal-400' // UNIVERSAL INACTIVE ICON HOVER (Admin's teal/blue)
              }`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer/Logout Area */}
      <div className="p-4 border-t border-gray-700/50">
         <button
            onClick={handleLogout}
            className="w-full flex items-center py-2.5 px-4 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-800/50 hover:text-red-300 transition-colors duration-200 group"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-400 transition-colors duration-200" />
            Logout
          </button>
      </div>
    </div>
  );
};

export default MerchandiserSidebar;