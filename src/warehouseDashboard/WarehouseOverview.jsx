import React from 'react';
// 1. Import Recharts components
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';
// Import icons - Changed LuPlusSquare to LuSquarePlus, and LuAlertOctagon to LuTriangleAlert
import {
  LuArrowRightLeft,
  LuTriangleAlert, // Changed from LuAlertOctagon
  LuWarehouse,
  LuListTodo,
  LuHistory,
  LuSquarePlus,
  LuBoxes,
  LuTruck,
  LuPackageCheck
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

// --- Mock Data ---
const overviewSummaryData = [
  { title: "Inbound Today", value: "12 Shipments", icon: LuArrowRightLeft, color: "text-blue-400", iconBg: "bg-blue-500/20", trend: "+2" },
  { title: "Outbound Today", value: "25 Orders", icon: LuArrowRightLeft, transform: "rotate(180deg)", color: "text-teal-400", iconBg: "bg-teal-500/20", trend: "+5" },
  { title: "Low Stock Items", value: "8 Items", icon: LuTriangleAlert, color: "text-yellow-400", iconBg: "bg-yellow-500/20", trend: "Critical" }, // Changed icon
  { title: "Storage Capacity", value: "75% Used", icon: LuWarehouse, color: "text-indigo-400", iconBg: "bg-indigo-500/20", trend: "Stable" },
];

const priorityTasksData = [
  { id: 'WT002', task: 'Prepare Order #G122 for Dispatch', priority: 'High', department: 'Shipping' },
  { id: 'WT001', task: 'Receive & Inspect Fabric #FS203', priority: 'High', department: 'Receiving' },
  { id: 'WT003', task: 'Restock Bin A-05 (Buttons)', priority: 'Medium', department: 'Restocking' },
];

const recentActivityData = [
    { id: 1, type: "Received", item: "Fabric Lot #FL990", user: "Yosef T.", time: "10m ago" },
    { id: 2, type: "Dispatched", item: "Order #G125", user: "Yosef T.", time: "45m ago" },
    { id: 3, type: "Stock Alert", item: "Red Buttons (SKU: BTN-RD-01) Low", user: "System", time: "1h ago" },
    { id: 4, type: "Moved", item: "Boxes Batch #B78 to Zone C", user: "Abebe K.", time: "2h ago" },
];

// Data for Inventory Pie Chart
const inventoryCategoryData = [
  { name: 'Fabrics', value: 450, fill: '#06B6D4' }, // Cyan 500
  { name: 'Trims', value: 300, fill: '#14B8A6' }, // Teal 500
  { name: 'Finished Goods', value: 150, fill: '#6366F1' }, // Indigo 500
  { name: 'Packaging Mat.', value: 100, fill: '#8B5CF6' }, // Violet 500
];
const COLORS = ['#06B6D4', '#14B8A6', '#6366F1', '#8B5CF6'];


// --- Helper Functions ---
const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'High': return 'bg-red-500/20 text-red-400 border border-red-500/30';
    case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
};

const getActivityIcon = (type) => {
    switch(type) {
        case "Received": return <LuTruck className="w-4 h-4 text-blue-400" />;
        case "Dispatched": return <LuPackageCheck className="w-4 h-4 text-teal-400" />;
        case "Stock Alert": return <LuTriangleAlert className="w-4 h-4 text-yellow-400" />; // Changed icon
        case "Moved": return <LuBoxes className="w-4 h-4 text-indigo-400" />;
        default: return <LuHistory className="w-4 h-4 text-gray-400" />;
    }
}

// --- WarehouseOverview Component ---
const WarehouseOverview = () => {
  const navigate = useNavigate();
  // Placeholder for user name - in a real app, get this from auth context
  const userName = "Warehouse Team";

  const handleQuickStockEntry = () => alert('Quick Stock Entry form/modal would open.');
  const handleViewTaskDetails = (taskId) => navigate(`/dashboard/warehouse/tasks#${taskId}`);
  const handleViewAllActivity = () => navigate('/dashboard/warehouse/activity-log'); // Placeholder for actual route

  return (
    <div className="space-y-10 text-white font-sans"> {/* Increased overall spacing */}
      {/* Header with Welcoming Message */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-semibold tracking-tight">Warehouse Operations</h1>
            {/* 2. Welcoming Message */}
            <p className="text-lg text-gray-400 mt-1">Welcome back, {userName}! Here's your current overview.</p>
        </div>
        <button
            onClick={handleQuickStockEntry}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-5 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
            <LuSquarePlus className="w-4 h-4 mr-2" /> Quick Stock Entry
        </button>
      </div>

      {/* Summary Cards Grid - Refined Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewSummaryData.map((item, index) => (
          <div key={index} className={`bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:scale-[1.03] hover:border-teal-500/70`}> {/* Enhanced shadow & border */}
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg ${item.iconBg} shadow-inner`}> {/* Icon bg with inner shadow */}
                <item.icon className={`w-7 h-7 ${item.color}`} style={{ transform: item.transform || 'none' }} />
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                item.trend.startsWith('+') ? 'bg-green-500/20 text-green-300' :
                item.trend.startsWith('-') ? 'bg-red-500/20 text-red-300' :
                item.trend === 'Critical' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-600/40 text-gray-200'
              }`}>
                {item.trend}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-50 mt-2">{item.value}</p> {/* Brighter value text */}
            <p className="text-sm text-gray-400 font-medium mt-1.5">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Priority Tasks & Inventory Category Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Tasks List - Refined Styling */}
        <div className="lg:col-span-2 p-6 bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-5 text-gray-100 flex items-center">
            <LuListTodo className="w-6 h-6 mr-3 text-teal-400"/> Priority Tasks
          </h2>
          {priorityTasksData.length > 0 ? (
            <ul className="space-y-3.5"> {/* Increased spacing */}
              {priorityTasksData.map(task => (
                <li key={task.id} onClick={() => handleViewTaskDetails(task.id)} className="p-4 bg-gray-700/60 rounded-lg flex justify-between items-center hover:bg-gray-700/80 transition-all duration-200 cursor-pointer border border-gray-600/50 hover:border-teal-500/70 shadow-md hover:shadow-lg">
                  <div>
                    <p className="text-base font-medium text-gray-100">{task.task}</p>
                    <p className="text-xs text-gray-400 mt-1">Assigned to: {task.department}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-md ${getPriorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic py-4">No high priority tasks at the moment.</p>
          )}
        </div>

        {/* Inventory by Category (Pie Chart) */}
        <div className="p-6 bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold mb-5 text-gray-100 flex items-center">
            <LuBoxes className="w-6 h-6 mr-3 text-indigo-400"/> Inventory by Category
          </h2>
          <ResponsiveContainer width="100%" height={280}> {/* Adjusted height */}
            <PieChart>
              <Pie
                data={inventoryCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100} // Adjusted outer radius
                innerRadius={50} // Added inner radius for donut chart
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Optional label
              >
                {inventoryCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none hover:opacity-80 transition-opacity duration-200"/>
                ))}
              </Pie>
              <Tooltip
                 contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                 itemStyle={{ color: '#E5E7EB' }}
                 cursor={{ fill: 'rgba(107, 114, 128, 0.15)' }}
              />
              <Legend
                iconSize={10}
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: '13px', color: '#D1D5DB', lineHeight: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Log - Refined */}
      <div className="p-6 bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-100 flex items-center">
                <LuHistory className="w-6 h-6 mr-3 text-blue-400"/> Recent Activity
            </h2>
            <button onClick={handleViewAllActivity} className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors duration-200">View All Logs</button>
          </div>
          {recentActivityData.length > 0 ? (
            <ul className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom scrollbar class */}
              {recentActivityData.map(activity => (
                <li key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-700/40 rounded-lg border border-gray-600/40 hover:bg-gray-700/60 transition-colors duration-200">
                  <span className="flex-shrink-0 p-2 bg-gray-600/50 rounded-full">{getActivityIcon(activity.type)}</span>
                  <div className="flex-grow text-sm">
                    <p className="text-gray-200"><strong className="font-medium text-gray-100">{activity.type}:</strong> {activity.item}</p>
                    <p className="text-xs text-gray-500">By {activity.user} - {activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic py-4">No recent activity logged.</p>
          )}
        </div>
        {/* Custom Scrollbar CSS (optional, add to your global CSS or style tag) */}
        <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #1f2937; /* gray-800 */
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #374151; /* gray-700 */
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #4b5563; /* gray-600 */
            }
        `}</style>
    </div>
  );
};

export default WarehouseOverview;
