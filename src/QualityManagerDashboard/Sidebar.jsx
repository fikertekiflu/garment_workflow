
import React from 'react';
import {
  FaTachometerAlt,    // Replaces LuLayoutDashboard for Overview
  FaClipboardCheck,   // Replaces LuClipboardCheck for Inspection Log
  FaChartBar,         // Fix for LuBarChart - used for Defect Analysis
  FaBook,             // Replaces LuBookCheck for Quality Standards (FaBook + FaCheck is also an option but FaBook is simpler for now)
  FaFileAlt,          // Replaces LuFileText for Reports
  FaSignOutAlt        // Replaces LuLogOut for Logout
} from 'react-icons/fa'; // Changed from 'react-icons/lu' to 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom';

const QualityManagerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(`/dashboard/qualitymanager/${path}`);
  };

  const handleLogout = () => {
    // In a real app, clear tokens/roles here
    navigate('/login');
  };

  const menuItems = [
    // Updated to use Fa icons
    { name: 'Overview', icon: FaTachometerAlt, path: 'overview' },
    { name: 'Inspection Log', icon: FaClipboardCheck, path: 'inspection-log' },
    { name: 'Defect Analysis', icon: FaChartBar, path: 'defect-analysis' },
    { name: 'Quality Standards', icon: FaBook, path: 'standards' },
    { name: 'Reports', icon: FaFileAlt, path: 'reports' },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col fixed top-0 left-0 shadow-lg border-r border-gray-700/50">
      {/* Logo/Brand Area */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700/50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm">
            QM
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            Quality Control
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow mt-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === `/dashboard/qualitymanager/${item.path}` ||
                           (location.pathname === '/dashboard/qualitymanager' && item.path === 'overview');

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 group ${
                isActive
                  ? 'bg-teal-600/30 text-white shadow-inner' // Active state styles
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white' // Inactive state styles
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                isActive
                  ? 'text-teal-300' // Active icon color
                  : 'text-gray-500 group-hover:text-teal-400' // Inactive icon color
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

export default QualityManagerSidebar;