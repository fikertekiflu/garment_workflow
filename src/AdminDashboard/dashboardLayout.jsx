import React from 'react';
// 1. Import Outlet from react-router-dom
import { Outlet } from 'react-router-dom';
// 2. Correct the import path if necessary (assuming standard structure)
import AdminSidebar from './sideBar';
// Import other sidebars if needed later

// This component determines which sidebar and content to show
const DashboardLayout = () => { // Removed children prop as Outlet handles content
  // In a real app, you'd get the role from context or props
  const userRole = 'admin'; // Hardcoded for this example

  let SidebarComponent;
  if (userRole === 'admin') {
    SidebarComponent = AdminSidebar;
  } else {
    // Add logic for other roles later
    return <div>Unknown Role or No Access</div>; // Handle appropriately
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-800 to-black">
      {/* Render the correct sidebar */}
      {SidebarComponent && <SidebarComponent />}

      {/* Main Content Area */}
      {/* ml-64 matches sidebar width */}
      <div className="flex-1 ml-64">
        {/* Optional: Add a top header bar here if needed */}
        <div className="p-6 md:p-10"> {/* Padding for content */}
          {/* 3. Use Outlet to render nested route components */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
