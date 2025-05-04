import React from 'react';
// Import chart components from recharts
import {
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, Sector // Added PieChart elements
} from 'recharts';
// Import icons for summary cards
import { LuCalendarCheck, LuFileSpreadsheet, LuUsers, LuHourglass } from 'react-icons/lu';

// --- Mock Data ---
const summaryData = [
  { title: "Active Tasks", value: "48", change: "+5%", icon: LuCalendarCheck, color: "text-blue-400", bgColor: "bg-blue-900/30" },
  { title: "Reports Today", value: "15", change: "+2", icon: LuFileSpreadsheet, color: "text-teal-400", bgColor: "bg-teal-900/30" },
  { title: "Pending Approvals", value: "3", change: "-1", icon: LuHourglass, color: "text-yellow-400", bgColor: "bg-yellow-900/30" },
  { title: "Active Users", value: "25", change: "+1", icon: LuUsers, color: "text-indigo-400", bgColor: "bg-indigo-900/30" },
];

const taskCompletionData = [
  { name: 'Mon', Completed: 30, Overdue: 5 },
  { name: 'Tue', Completed: 45, Overdue: 3 },
  { name: 'Wed', Completed: 40, Overdue: 8 },
  { name: 'Thu', Completed: 55, Overdue: 2 },
  { name: 'Fri', Completed: 50, Overdue: 4 },
  { name: 'Sat', Completed: 20, Overdue: 1 },
  { name: 'Sun', Completed: 15, Overdue: 0 },
];

const reportsByDeptData = [
  { name: 'Cutting', value: 40, fill: '#2dd4bf' }, // teal-400
  { name: 'Production', value: 35, fill: '#38bdf8' }, // sky-400
  { name: 'Warehouse', value: 15, fill: '#a78bfa' }, // violet-400
  { name: 'Packaging', value: 10, fill: '#f472b6' }, // pink-400
  { name: 'Quality', value: 12, fill: '#34d399' }, // emerald-400
  { name: 'Merchandising', value: 8, fill: '#fbbf24' }, // amber-400
];

// --- AdminDashboard Component ---
const AdminDashboard = () => {
  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <h1 className="text-3xl font-semibold tracking-tight">Admin Overview</h1>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryData.map((item, index) => (
          <div key={index} className={`p-6 rounded-xl shadow-lg flex items-start space-x-4 ${item.bgColor} border border-gray-700/50`}>
            <div className={`p-3 rounded-full ${item.color} bg-gray-800/50`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{item.title}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
              {/* Optional: Add change indicator */}
              {/* <p className={`text-xs mt-1 ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{item.change}</p> */}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Completion Chart (Area Chart) */}
        <div className="lg:col-span-2 p-6 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Weekly Task Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={taskCompletionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/> {/* Teal */}
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOverdue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.8}/> {/* Red */}
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" /> {/* Darker grid */}
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                 contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                 itemStyle={{ color: '#E5E7EB' }}
                 cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }} // Gray-500 with opacity
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#D1D5DB' }} />
              <Area type="monotone" dataKey="Completed" stroke="#14B8A6" fillOpacity={1} fill="url(#colorCompleted)" />
              <Area type="monotone" dataKey="Overdue" stroke="#F87171" fillOpacity={1} fill="url(#colorOverdue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Reports by Department Chart (Pie Chart) */}
        <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-gray-200">Reports by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportsByDeptData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100} // Adjust size
                fill="#8884d8" // Default fill (overridden by Cell)
                dataKey="value"
                // Optional: Add labels inside/outside slices
                // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {reportsByDeptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                 contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', borderRadius: '8px' }}
                 itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#D1D5DB', paddingTop: '10px' }} layout="vertical" align="right" verticalAlign="middle"/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Placeholder for other sections like Recent Reports, Task Assignment etc. */}
      <div className="p-6 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50">
        <h2 className="text-lg font-semibold mb-4 text-gray-200">Recent Activity / Task Assignment (Placeholder)</h2>
        <p className="text-gray-400">This area can display recent report submissions, comments needing attention, or controls for assigning new schedules...</p>
      </div>

    </div>
  );
};

export default AdminDashboard;

