import React from 'react';
import {
  LuLayoutDashboard,
  LuScissors,        // For Cutting Plans / Operations
  LuRuler,          // For Fabric Usage / Marker Planning
  LuWarehouse,      // For Material Requisitions / Fabric Stock
  LuClipboardList, // For Quality Control / Inspections (implied by efficiency tracking)
  LuFileText,       // For Reports
  LuLogOut,
  // LuBoxSelect,      // For Material Issuance/Tracking
  LuGauge          // For Efficiency Monitoring
} from 'react-icons/lu';
import { useNavigate, useLocation } from 'react-router-dom';

const CuttingManagerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(`/dashboard/cuttingmanager/${path}`);
  };

  const handleLogout = () => {
    // In a real application, you would clear authentication tokens here
    // localStorage.removeItem('userToken');
    navigate('/login');
  };

  // Define the menu items specific to the Cutting Manager, informed by the images
  const menuItems = [
    { name: 'Overview', icon: LuLayoutDashboard, path: 'overview' },
    { name: 'Cutting Orders', icon: LuScissors, path: 'orders' }, // From cutting2.jpg
    { name: 'Fabric Allocation', icon: LuRuler, path: 'allocation' }, // From cutting1.jpg (Marker length, fabric usage)
    { name: 'Material Requisitions', icon: LuWarehouse, path: 'material' }, // From cutting3.jpg & cutting4.jpg
    { name: 'Daily Cutting Log', icon: LuClipboardList, path: 'logs' }, // From cutting1.jpg & cutting2.jpg (Daily activity tracking)
    { name: 'Efficiency & Waste', icon: LuGauge, path: 'efficiency' }, // From cutting1.jpg (Efficiency, difference/waste)
    { name: 'Reports', icon: LuFileText, path: 'reports' }, // Consolidated reports
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
          const isExactlyBase = location.pathname === '/dashboard/cuttingmanager';
          const isActive = (isExactlyBase && item.path === 'overview') ||
                           location.pathname === `/dashboard/cuttingmanager/${item.path}`;

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 group ${
                isActive
                  ? 'bg-teal-600/30 text-white shadow-inner'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                isActive
                  ? 'text-teal-300'
                  : 'text-gray-500 group-hover:text-teal-400'
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
            <LuLogOut className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-400 transition-colors duration-200" />
            Logout
          </button>
      </div>
    </div>
  );
};

export default CuttingManagerSidebar;