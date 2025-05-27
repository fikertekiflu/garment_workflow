import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Import Layouts
import DashboardLayout from './AdminDashboard/dashboardLayout'; // Layout for dashboard pages

// Import Components needed globally or conditionally
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Page Components
import LandingPage from './pages/LandingPage';
import Login from './pages/login';

// Import Admin Section Components
import AdminOverview from './AdminDashboard/AdminOverview';
import AdminUserManagement from './AdminDashboard/AdminUserManagement';
import AdminScheduleManagement from './AdminDashboard/AdminScheduleManagement';
import AdminReports from './AdminDashboard/AdminReports';

// Import Warehouse Section Components
import WarehouseOverview from './warehouseDashboard/WarehouseOverview';
import WarehouseInventory from './warehouseDashboard/WarehouseInventory';
import WarehouseIncoming from './warehouseDashboard/WarehouseIncoming';
import WarehouseOutgoing from './warehouseDashboard/WarehouseOutgoing';
import WarehouseTasks from './warehouseDashboard/WarehouseTasks';
import WarehouseReports from './warehouseDashboard/WarehouseReports';

// Import Cutting Manager Section Components
import CuttingManagerOverview from './CuttingManagerDashboard/CuttingManagerOverview';
// import CuttingManagerAllocation from './CuttingManagerDashboard/CuttingManagerAllocation';
// import CuttingManagerRequisitions from './CuttingManagerDashboard/CuttingManagerRequisitions';
// import CuttingManagerLogs from './CuttingManagerDashboard/CuttingManagerRequisitions';
// import CuttingManagerEfficiency from './CuttingManagerDashboard/CuttingManagerEfficiency';
// import CuttingManagerReports from './CuttingManagerDashboard/CuttingManagerReports';
// import CuttingManagerOrders from './CuttingManagerDashboard/CuttingManagerOrders';


const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className={`flex flex-col min-h-screen ${
      'bg-gradient-to-br from-gray-800 to-black'
    } text-gray-200 font-sans`}>
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

function App() {
  return (
    <LayoutWrapper>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Login Page Route */}
        <Route path="/login" element={<Login />} />

        {/* --- Admin Dashboard Routes --- */}
        <Route path="/dashboard/admin" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="schedules" element={<AdminScheduleManagement />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* --- Warehouse Dashboard Routes --- */}
        <Route path="/dashboard/warehouse" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<WarehouseOverview />} />
          <Route path="inventory" element={<WarehouseInventory />} />
          <Route path="incoming" element={<WarehouseIncoming />} />
          <Route path="outgoing" element={<WarehouseOutgoing />} />
          <Route path="tasks" element={<WarehouseTasks />} />
          <Route path="reports" element={<WarehouseReports />} />
        </Route>

        {/* --- Cutting Manager Dashboard Routes --- */}
        <Route path="/dashboard/cuttingmanager" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<CuttingManagerOverview />} />
          {/* <Route path="allocation" element={<CuttingManagerAllocation />} />
          <Route path="requisitions" element={<CuttingManagerRequisitions />} />
          <Route path="logs" element={<CuttingManagerLogs />} />
          <Route path="efficiency" element={<CuttingManagerEfficiency />} />
          <Route path="reports" element={<CuttingManagerReports />} />
          <Route path="orders" element={<CuttingManagerOrders />} /> */}
          {/* Add more Cutting Manager routes as needed */}
        </Route>

        {/* Optional: Catch-all route for 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center h-screen text-xl">
              Page Not Found (404)
            </div>
          }
        />
      </Routes>
    </LayoutWrapper>
  );
}

export default App;