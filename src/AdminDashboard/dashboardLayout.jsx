import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Outlet is key for nested routes
import AdminSidebar from './sideBar';
import WarehouseSidebar from '../warehouseDashboard/Sidebar'; // Make sure this path is correct

// This component determines which sidebar and content to show
const DashboardLayout = () => {
  const location = useLocation(); // Hook to get current URL information

  // Determine role from the URL path (this is a basic example)
  // In a real application, role information would typically come from an authentication context/state
  let userRole = 'unknown';
  if (location.pathname.startsWith('/dashboard/admin')) {
    userRole = 'admin';
  } else if (location.pathname.startsWith('/dashboard/warehouse')) {
    userRole = 'warehouse';
  }
  // Add more 'else if' blocks here for other roles like 'productionmanager', 'merchandiser', etc.

  let SidebarComponent;
  if (userRole === 'admin') {
    SidebarComponent = AdminSidebar;
  } else if (userRole === 'warehouse') {
    SidebarComponent = WarehouseSidebar;
  }
  // Add more 'else if' for other roles, assigning their respective sidebars
  else {
    // Fallback or error for unknown roles/paths if not handled by a 404 route
    return <div className="text-white p-10">Error: Appropriate dashboard layout not found for this role or path.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-800 to-black text-white font-sans">
      {/* Render the determined SidebarComponent */}
      {SidebarComponent && <SidebarComponent />}

      {/* Main Content Area */}
      {/* ml-64 matches sidebar width (w-64) to prevent overlap */}
      <div className="flex-1 ml-64">
        {/* Optional: Add a top header bar here if needed (e.g., user profile, notifications) */}
        <div className="p-6 md:p-10"> {/* Padding for the content of each specific dashboard section */}
          {/* Outlet renders the matched nested route's component */}
          {/* For /dashboard/warehouse/overview, this will render <WarehouseOverview /> */}
          {/* For /dashboard/warehouse/inventory, this will render <WarehouseInventory /> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
