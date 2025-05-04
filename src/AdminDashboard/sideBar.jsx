import React from 'react';
import {
  LuLayoutDashboard,
  LuUsers,
  LuCalendarClock,
  LuFileText,
  LuLogOut
} from 'react-icons/lu';
// 1. Import useLocation along with useNavigate
import { useNavigate, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  // 2. Get current location object
  const location = useLocation();

  // Updated function for navigation within dashboard
  const handleNavigation = (path) => {
    // 3. Navigate to the full nested route path
    navigate(`/dashboard/admin/${path}`);
  };

  // Logout function remains the same
  const handleLogout = () => {
    // Clear any stored tokens/roles in a real app
    // localStorage.removeItem('userRole');
    navigate('/login'); // Navigate back to login
  };


  const menuItems = [
    // Ensure paths match the nested routes defined in App.jsx
    { name: 'Overview', icon: LuLayoutDashboard, path: 'overview' },
    { name: 'User Management', icon: LuUsers, path: 'users' },
    { name: 'Schedule Mgmt', icon: LuCalendarClock, path: 'schedules' },
    { name: 'All Reports', icon: LuFileText, path: 'reports' },
  ];

  return (
    // Sidebar container styling
    <div className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col fixed top-0 left-0 shadow-lg border-r border-gray-700/50">
      {/* Logo/Brand Area */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700/50">
         <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            {/* Logo Placeholder */}
            <div className="h-10 w-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm">
              HW
            </div>
            {/* System Name */}
            <span className="text-xl font-semibold text-white tracking-tight">
              Hidet Workflow
            </span>
          </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow mt-6 px-4 space-y-2">
        {menuItems.map((item) => {
          // 4. Determine if the current item's path is active
          // Check if the current URL pathname ends with the item's path
          // Also handle the base '/dashboard/admin' case for 'overview'
          const isActive = location.pathname === `/dashboard/admin/${item.path}` ||
                           (location.pathname === '/dashboard/admin' && item.path === 'overview');

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              // 5. Apply active/inactive styles conditionally based on isActive
              className={`w-full flex items-center py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 group ${
                isActive
                  ? 'bg-teal-600/30 text-white shadow-inner' // Active state styles
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white' // Inactive state styles
              }`}
            >
              {/* Apply active/inactive icon colors */}
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
            <LuLogOut className="w-5 h-5 mr-3 text-gray-500 group-hover:text-red-400 transition-colors duration-200" />
            Logout
          </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
