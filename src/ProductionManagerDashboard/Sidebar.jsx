import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,          // Overview
  FaClipboardList, // Daily Production Log / Orders
  FaTools,         // Line Management / Cogs
  FaCheckCircle,   // Quality Control
  FaFileAlt,       // Reports
  FaSignOutAlt,    // Logout
  FaListOl,        // For production lines
} from 'react-icons/fa'; // Using Fa icons for consistency with other generated components

const ProductionManagerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(`/dashboard/productionmanager/${path}`);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const menuItems = [
    { name: 'Overview', icon: FaHome, path: 'overview' },
    { name: 'Daily Production Log', icon: FaClipboardList, path: 'daily-log' },
    { name: 'Line Management', icon: FaListOl, path: 'line-management' },
    { name: 'Quality Control', icon: FaCheckCircle, path: 'quality-control' },
    { name: 'Production Reports', icon: FaFileAlt, path: 'reports' },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col fixed top-0 left-0 shadow-lg border-r border-gray-700/50">
      {/* Logo/Brand Area */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700/50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm">
            HW
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            Hidet Workflow
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow mt-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isExactlyBase = location.pathname === '/dashboard/productionmanager';
          const isActive = (isExactlyBase && item.path === 'overview') ||
                           location.pathname === `/dashboard/productionmanager/${item.path}`;

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 group ${
                isActive
                  ? 'bg-teal-600/30 text-white shadow-inner' // Consistent active state color
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white' // Consistent inactive state color
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                isActive
                  ? 'text-teal-300' // Consistent active icon color
                  : 'text-gray-500 group-hover:text-teal-400' // Consistent inactive icon color
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

export default ProductionManagerSidebar;