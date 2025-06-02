import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './sideBar';
import WarehouseSidebar from '../warehouseDashboard/Sidebar';
import CuttingManagerSidebar from '../CuttingManagerDashboard/Sidebar';
import ProductionManagerSidebar from '../ProductionManagerDashboard/Sidebar';
import QualityManagerSidebar from '../QualityManagerDashboard/Sidebar';
import MerchandiserSidebar from '../MerchandiserDashboard/Sidebar';

const DashboardLayout = () => {
  const location = useLocation();

  let userRole = 'unknown';
  if (location.pathname.startsWith('/dashboard/admin')) {
    userRole = 'admin';
  } else if (location.pathname.startsWith('/dashboard/warehouse')) {
    userRole = 'warehouse';
  } else if (location.pathname.startsWith('/dashboard/cuttingmanager')) {
    userRole = 'cuttingmanager';
  } else if (location.pathname.startsWith('/dashboard/productionmanager')) {
    userRole = 'productionmanager';
  } else if (location.pathname.startsWith('/dashboard/qualitymanager')) {
    userRole = 'qualitymanager';
  } else if (location.pathname.startsWith('/dashboard/merchandiser')) {
    userRole = 'merchandiser';
  }

  let SidebarComponent;
  if (userRole === 'admin') {
    SidebarComponent = AdminSidebar;
  } else if (userRole === 'warehouse') {
    SidebarComponent = WarehouseSidebar;
  } else if (userRole === 'cuttingmanager') {
    SidebarComponent = CuttingManagerSidebar;
  } else if (userRole === 'productionmanager') {
    SidebarComponent = ProductionManagerSidebar;
  } else if (userRole === 'qualitymanager') {
    SidebarComponent = QualityManagerSidebar;
  } else if (userRole === 'merchandiser') {
    SidebarComponent = MerchandiserSidebar;
  } else {
    return <div className="text-white p-10">Error: Appropriate dashboard layout not found for this role or path.</div>;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-800 to-black text-white font-sans">
      {SidebarComponent && <SidebarComponent />}
      <div className="flex-1 ml-64">
        <div className="p-6 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;