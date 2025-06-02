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

// Removed: Placeholder Pages for Navbar Links (AboutPage, ServicesPage)

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
import CuttingFabricAllocation from './CuttingManagerDashboard/CuttingFabricAllocation';
import CuttingMaterialRequisitions from './CuttingManagerDashboard/CuttingMaterialRequisitions';
import CuttingDailyLog from './CuttingManagerDashboard/CuttingDailyLog';
import CuttingEfficiencyWaste from './CuttingManagerDashboard/CuttingEfficiencyWaste';
import CuttingManagerReports from './CuttingManagerDashboard/CuttingManagerReports';
import CuttingManagerOrders from './CuttingManagerDashboard/CuttingManagerOrders';

// Import Production Manager Section Components
import ProductionManagerOverview from './ProductionManagerDashboard/ProductionManagerOverview';
import ProductionDailyLog from './ProductionManagerDashboard/ProductionDailyLog';
import ProductionLineManagement from './ProductionManagerDashboard/ProductionLineManagement';
import ProductionQualityControl from './ProductionManagerDashboard/ProductionQualityControl';
import ProductionReports from './ProductionManagerDashboard/ProductionReports';

// Import Quality Manager Section Components
import QualityManagerOverview from './QualityManagerDashboard/QualityManagerOverview';
import QualityInspectionLog from './QualityManagerDashboard/QualityInspectionLog';
import QualityDefectAnalysis from './QualityManagerDashboard/QualityDefectAnalysis';
import QualityStandardsManagement from './QualityManagerDashboard/QualityStandardsManagement';
import QualityReports from './QualityManagerDashboard/QualityReports';

// Import Merchandiser Section Components
import MerchandiserOverview from './MerchandiserDashboard/MerchandiserOverview';
import MerchandiserOrderTracking from './MerchandiserDashboard/MerchandiserOrderTracking';
import MerchandiserSampleManagement from './MerchandiserDashboard/MerchandiserSampleManagement';
import MerchandiserMaterialTracking from './MerchandiserDashboard/MerchandiserMaterialTracking';
import MerchandiserProductionMonitoring from './MerchandiserDashboard/MerchandiserProductionMonitoring';
import MerchandiserShippingLog from './MerchandiserDashboard/MerchandiserShippingLog';
import AnalyticsAndReports from './MerchandiserDashboard/AnalyticsAndReports';

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

        {/* Removed: Public Pages from Navbar (AboutPage, ServicesPage routes) */}
        {/* These routes are no longer needed as Navbar links all go to "/" */}

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
          <Route path="allocation" element={<CuttingFabricAllocation />} />
          <Route path="requisitions" element={<CuttingMaterialRequisitions />} />
          <Route path="logs" element={<CuttingDailyLog />} />
         <Route path="efficiency" element={<CuttingEfficiencyWaste />} />
         <Route path="reports" element={<CuttingManagerReports />} />
          <Route path="orders" element={<CuttingManagerOrders />} />
          {/* Add more Cutting Manager routes as needed */}
        </Route>
        {/* --- Production Manager Dashboard Routes --- */}
        <Route path="/dashboard/productionmanager" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ProductionManagerOverview />} />
          <Route path="daily-log" element={<ProductionDailyLog />} />
          <Route path="line-management" element={<ProductionLineManagement />} />
          <Route path="quality-control" element={<ProductionQualityControl />} />
          <Route path="reports" element={<ProductionReports />} />
          {/* Add more Production Manager routes as needed */}
          </Route>
        {/* --- Quality Manager Dashboard Routes --- */}
        <Route path="/dashboard/qualitymanager" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<QualityManagerOverview />} />
          <Route path="inspection-log" element={<QualityInspectionLog />} />
          <Route path="defect-analysis" element={<QualityDefectAnalysis />} />
          <Route path="standards" element={<QualityStandardsManagement />} />
          <Route path="reports" element={<QualityReports />} />
          {/* Add more Quality Manager routes as needed */}
        </Route>
        {/* --- Merchandiser Dashboard Routes --- */}
        <Route path="/dashboard/merchandiser" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<MerchandiserOverview />} />
          <Route path="order-tracking" element={<MerchandiserOrderTracking />} />
          <Route path="sample-management" element={<MerchandiserSampleManagement />} />
          <Route path="material-tracking" element={<MerchandiserMaterialTracking />} />
          <Route path="production-monitoring" element={<MerchandiserProductionMonitoring />} />
          <Route path="shipping-log" element={<MerchandiserShippingLog />} />
          <Route path="analytics-reports" element={<AnalyticsAndReports />} />


          {/* Add more Merchandiser routes as needed */}
        </Route>

        {/* Catch-all route for 404 */}
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center h-screen text-xl bg-gray-900 text-white">
              Page Not Found (404)
            </div>
          }
        />
      </Routes>
    </LayoutWrapper>
  );
}

export default App;