import React from 'react';
// 1. Import necessary components from react-router-dom
// Make sure Navigate is imported if you use the index route redirect
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Import Layouts
// Adjust this path based on your actual file structure
import DashboardLayout from './AdminDashboard/dashboardLayout'; // Layout for dashboard pages

// Import Components needed globally or conditionally
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Page Components
import LandingPage from './pages/LandingPage';
import Login from './pages/login'; // Assuming lowercase 'l' based on your input

// Import Admin Section Components
// Adjust these paths based on your actual file structure (e.g., components/dashboard/admin/)
import AdminOverview from './AdminDashboard/AdminOverview';
import AdminUserManagement from './AdminDashboard/AdminUserManagement';
import AdminScheduleManagement from './AdminDashboard/AdminScheduleManagement';
import AdminReports from './AdminDashboard/AdminReports';

// Import other role dashboards later if needed
// import ProductionDashboard from './pages/ProductionDashboard';

// Helper component to conditionally render Navbar/Footer based on the route
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  // Check if the current path starts with '/dashboard'
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    // Apply base styles and flex layout - Added background gradient back
    <div className={`flex flex-col min-h-screen ${
      // Use dark gradient for all pages in this setup
      'bg-gradient-to-br from-gray-800 to-black'
    } text-gray-200 font-sans`}>
      {/* Conditionally render Navbar if not a dashboard page */}
      {!isDashboard && <Navbar />}
      {/* Main content area grows to fill space */}
      <main className="flex-grow">
        {children} {/* Render the routed page content */}
      </main>
      {/* Conditionally render Footer if not a dashboard page */}
      {!isDashboard && <Footer />}
    </div>
  );
};


function App() {
  return (
    // Wrap all routes with the LayoutWrapper to handle Navbar/Footer visibility
    <LayoutWrapper>
        {/* Define all application routes */}
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Login Page Route */}
          <Route path="/login" element={<Login />} />

          {/* --- Admin Dashboard Routes (Nested) --- */}
          {/* Parent Route: Renders the DashboardLayout component */}
          <Route path="/dashboard/admin" element={<DashboardLayout />}>
             {/* Index Route: Default view when navigating to /dashboard/admin */}
             {/* Redirects immediately to the 'overview' path */}
             <Route index element={<Navigate to="overview" replace />} />

             {/* Nested Routes: Render inside DashboardLayout's <Outlet /> */}
             <Route path="overview" element={<AdminOverview />} />
             <Route path="users" element={<AdminUserManagement />} />
             <Route path="schedules" element={<AdminScheduleManagement />} />
             <Route path="reports" element={<AdminReports />} />
             {/* Add more nested admin routes here if needed */}
          </Route>
          {/* --- End Admin Dashboard Routes --- */}


          {/* === Add routes for other role dashboards below === */}
          {/* Example for Production Manager: */}
          {/*
          <Route path="/dashboard/productionmanager" element={<DashboardLayout />}>
             <Route index element={<Navigate to="tasks" replace />} /> // Example default
             <Route path="tasks" element={<ProductionTasks />} /> // Create ProductionTasks.jsx
             <Route path="reports" element={<ProductionReports />} /> // Create ProductionReports.jsx
          </Route>
          */}
          {/* Add similar routes for Warehouse, Merchandiser, Cutting, Packaging, Quality */}


          {/* Optional: Catch-all route for 404 Not Found pages */}
          {/*
          <Route
             path="*"
             element={
               <div className="flex justify-center items-center h-screen text-xl">
                  Page Not Found (404)
               </div>
              }
          />
           */}
        </Routes>
    </LayoutWrapper>
  );
}

export default App;
