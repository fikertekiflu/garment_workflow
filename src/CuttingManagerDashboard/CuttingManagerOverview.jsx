import React from 'react';
import { motion } from 'framer-motion';
// Import Recharts components
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
// Import Lucide icons relevant to cutting management
import {
  LuScissors,        // For cutting orders/output
  LuRuler,          // For fabric usage/marker planning
  LuHourglass,      // For pending/on hold items
  LuGauge,          // For efficiency
  LuFileText,       // For reports/logs
  LuLayers,         // For fabric layers/spreading
  LuFactory,        // General production/factory
  LuClipboardCheck, // For completed tasks
  LuZap,            // For production speed/monitor
  LuWarehouse       // For warehouse-related activities
} from 'react-icons/lu';

// --- Mock Data for Cutting Manager ---

// Summary cards data
const cuttingSummaryData = [
  { title: "Today's Cut Quantity", value: "1,250 Pcs", change: "+150", icon: LuScissors, color: "text-teal-400", bgColor: "bg-teal-900/30", trendClass: "bg-green-500/20 text-green-300" },
  { title: "Pending Cut Orders", value: "7 Orders", change: "-2", icon: LuHourglass, color: "text-yellow-400", bgColor: "bg-yellow-900/30", trendClass: "bg-orange-500/20 text-orange-300" },
  { title: "Fabric in Progress", value: "3,500 Mts", change: "Allocated", icon: LuRuler, color: "text-blue-400", bgColor: "bg-blue-900/30", trendClass: "bg-blue-500/20 text-blue-300" },
  { title: "Overall Efficiency", value: "88%", change: "Avg", icon: LuGauge, color: "text-purple-400", bgColor: "bg-purple-900/30", trendClass: "bg-gray-600/40 text-gray-200" },
];

// Cutting Performance Chart Data
const cuttingPerformanceData = [
  { name: 'Day 1', Target: 1000, Actual: 950, Waste: 50 },
  { name: 'Day 2', Target: 1100, Actual: 1050, Waste: 40 },
  { name: 'Day 3', Target: 1200, Actual: 1250, Waste: 30 },
  { name: 'Day 4', Target: 1050, Actual: 980, Waste: 70 },
  { name: 'Day 5', Target: 1300, Actual: 1280, Waste: 20 },
  { name: 'Day 6', Target: 800, Actual: 750, Waste: 30 },
  { name: 'Day 7', Target: 900, Actual: 880, Waste: 20 },
];

// Fabric Utilization Pie Chart Data
const fabricUtilizationData = [
  { name: 'Usable Fabric', value: 92, fill: '#10B981' }, // Green-500 for success
  { name: 'Cutting Waste', value: 8, fill: '#EF4444' }, // Red-500 for waste
];
const FABRIC_COLORS = ['#10B981', '#EF4444']; // Corresponding colors for the pie chart

// Critical Cutting Orders (similar to Warehouse's priority tasks)
const criticalCuttingOrders = [
  { id: 'CO005', style: 'Men\'s Shirt - Classic', quantity: 300, due: '2 days', status: 'Pending Fabric' },
  { id: 'CO002', style: 'Women\'s Dress - Summer', quantity: 150, due: 'Today', status: 'Cutting In Progress' },
  { id: 'CO008', style: 'Kids T-Shirt - Graphic', quantity: 500, due: '3 days', status: 'Marker Planning' },
];

// Recent Cutting Activity
const recentCuttingActivity = [
  { id: 1, type: "Order Initiated", item: "CO010 (Denim Jeans)", user: "Admin", time: "15m ago", icon: LuFileText, color: "text-blue-400" },
  { id: 2, type: "Fabric Issued", item: "FL003 (Black Cotton)", user: "Warehouse", time: "40m ago", icon: LuWarehouse, color: "text-purple-400" },
  { id: 3, type: "Cutting Started", item: "CO002 (Women's Dress)", user: "Abebe K.", time: "1h ago", icon: LuScissors, color: "text-teal-400" },
  { id: 4, type: "Layers Spread", item: "CO008 (Kids T-Shirt)", user: "Manager T.", time: "2h ago", icon: LuLayers, color: "text-green-400" },
  { id: 5, type: "Efficiency Alert", item: "Machine 3 Below Target", user: "System", time: "3h ago", icon: LuGauge, color: "text-red-400" },
];

// --- Helper Functions ---
const getOrderStatusBadge = (status) => {
  switch (status) {
    case 'Pending Fabric': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'Cutting In Progress': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'Marker Planning': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
    case 'Completed': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
};

// --- CuttingManagerOverview Component ---
const CuttingManagerOverview = () => {
  const userName = "Cutting Manager"; // Placeholder

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10 text-white font-sans p-8" // Added p-8 for padding
    >
      {/* Header with Welcoming Message */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Cutting Manager Dashboard</h1>
          <p className="text-lg text-gray-400 mt-1">Welcome back, {userName}! Here's your current overview.</p>
        </div>
        {/* You can add a quick action button here if needed, e.g., "New Cutting Plan" */}
        <button
            // onClick={handleNewCuttingPlan}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-5 rounded-lg transition duration-200 text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
            <LuScissors className="w-4 h-4 mr-2" /> New Cutting Plan
        </button>
      </motion.div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cuttingSummaryData.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:scale-[1.03] hover:border-teal-500/70`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-lg ${item.bgColor} shadow-inner`}>
                <item.icon className={`w-7 h-7 ${item.color}`} />
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.trendClass}`}>
                {item.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-50 mt-2">{item.value}</p>
            <p className="text-sm text-gray-400 font-medium mt-1.5">{item.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid: Cutting Performance & Fabric Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cutting Performance Chart (Area Chart) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 p-6 bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/60">
          <h2 className="text-xl font-semibold mb-5 text-gray-100 flex items-center">
            <LuFactory className="w-6 h-6 mr-3 text-blue-400"/> Daily Cutting Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cuttingPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                 <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                 contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                 itemStyle={{ color: '#E5E7EB' }}
                 cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#D1D5DB' }} />
              <Area type="monotone" dataKey="Actual" stroke="#14B8A6" fillOpacity={1} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="Target" stroke="#6366F1" fillOpacity={1} fill="url(#colorTarget)" />
              <Area type="monotone" dataKey="Waste" stroke="#EF4444" fillOpacity={1} fill="url(#colorWaste)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Fabric Utilization (Pie Chart) */}
        <motion.div variants={itemVariants} className="p-6 bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/60">
          <h2 className="text-xl font-semibold mb-5 text-gray-100 flex items-center">
            <LuRuler className="w-6 h-6 mr-3 text-green-400"/> Fabric Utilization
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={fabricUtilizationData}
                cx="50%" cy="50%" labelLine={false} outerRadius={100} innerRadius={50}
                fill="#8884d8" dataKey="value" nameKey="name"
              >
                {fabricUtilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={FABRIC_COLORS[index % FABRIC_COLORS.length]} className="focus:outline-none hover:opacity-80 transition-opacity duration-200"/>
                ))}
              </Pie>
              <Tooltip
                 contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                 itemStyle={{ color: '#E5E7EB' }}
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
        </motion.div>
      </div>

      {/* Critical Cutting Orders List */}
      <motion.div variants={itemVariants} className="p-6 bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl">
        <h2 className="text-xl font-semibold mb-5 text-gray-100 flex items-center">
          <LuHourglass className="w-6 h-6 mr-3 text-red-400"/> Critical Cutting Orders
        </h2>
        {criticalCuttingOrders.length > 0 ? (
          <ul className="space-y-3.5">
            {criticalCuttingOrders.map(order => (
              <li key={order.id} className="p-4 bg-gray-700/60 rounded-lg flex justify-between items-center hover:bg-gray-700/80 transition-all duration-200 cursor-pointer border border-gray-600/50 hover:border-teal-500/70 shadow-md hover:shadow-lg">
                <div>
                  <p className="text-base font-medium text-gray-100">{order.style} ({order.quantity} Pcs)</p>
                  <p className="text-xs text-gray-400 mt-1">Order ID: {order.id} | Due: {order.due}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-md ${getOrderStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic py-4">No critical cutting orders at the moment.</p>
        )}
      </motion.div>

      {/* Recent Cutting Activity Log */}
      <motion.div variants={itemVariants} className="p-6 bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-100 flex items-center">
            <LuFileText className="w-6 h-6 mr-3 text-blue-400"/> Recent Cutting Activity
          </h2>
          <button
            // onClick={handleViewAllActivity}
            className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors duration-200">View All Logs</button>
        </div>
        {recentCuttingActivity.length > 0 ? (
          <ul className="space-y-3.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {recentCuttingActivity.map(activity => (
              <li key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-700/40 rounded-lg border border-gray-600/40 hover:bg-gray-700/60 transition-colors duration-200">
                <span className="flex-shrink-0 p-2 bg-gray-600/50 rounded-full">
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </span>
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
      </motion.div>
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
    </motion.div>
  );
};

export default CuttingManagerOverview;