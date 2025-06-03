// src/PackagingDashboard/PackagingSidebar.jsx

import React from 'react';
import {
  LuLayoutDashboard,
  LuPackage,
  LuBoxes,
  LuClipboardCheck,
  LuFileText,
  LuLogOut
} from 'react-icons/lu';
import { useNavigate, useLocation } from 'react-router-dom';

const PackagingSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(`/dashboard/packaging/${path}`);
  };

  const handleLogout = () => {
    // In a real app, clear tokens/roles here
    navigate('/login');
  };

  const menuItems = [
    { name: 'Overview', icon: LuLayoutDashboard, path: 'overview' },
    { name: 'Packaging Tracking', icon: LuPackage, path: 'tracking' },
    { name: 'Material Usage', icon: LuBoxes, path: 'materials' },
    { name: 'Packaging QC', icon: LuClipboardCheck, path: 'inspections' },
    { name: 'Reports', icon: LuFileText, path: 'reports' },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col fixed top-0 left-0 shadow-lg border-r border-gray-700/50">
      {/* Logo/Brand Area - Now uses the same teal/blue gradient */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700/50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          {/* Logo Placeholder - Same gradient as Admin Sidebar */}
          <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm">
            HW
          </div>
          {/* System Name - Consistent with "Hidet Workflow" */}
          <span className="text-xl font-semibold text-white tracking-tight">
            Hidet Workflow
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow mt-6 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === `/dashboard/packaging/${item.path}` ||
                           (location.pathname === '/dashboard/packaging' && item.path === 'overview');

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 group ${
                isActive
                  ? 'bg-teal-600/30 text-white shadow-inner' // Active state styles now use teal
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white' // Inactive state styles (consistent)
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                isActive
                  ? 'text-teal-300' // Active icon color now uses teal
                  : 'text-gray-500 group-hover:text-teal-400' // Inactive icon color hover now uses teal
              }`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Footer/Logout Area - Consistent with AdminSidebar */}
      <div className="p-4 border-t border-gray-700/50">
         <button
            onClick={handleLogout}
            className="w-full flex items-center py-2.5 px-4 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-800/50 hover:text-red-300 transition-colors duration-200 group"
          >
            <LuLogOut className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-400 transition-colors duration-200" />
            Logout
          </button>
      </div>
    </div>
  );
};

export default PackagingSidebar;