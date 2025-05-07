import React, { useState, useMemo } from 'react';
// Assuming these icons are working after cache clears or with workarounds if needed
import {
  LuListChecks,
  LuFilter,
  LuCalendarDays,
  LuTriangleAlert, // Used for high priority or as a general alert icon
  LuCheck,
  LuHourglass,
  LuSearch,
  LuPencil,
  LuClock,
  LuEye // For 'View Details' button
} from 'react-icons/lu';

// Mock Task Data (specific to warehouse execution)
const warehouseTasksData = [
  { id: 'T001', description: "Inspect Incoming Shipment #FS203", priority: "High", status: "Pending", assignedDate: "2025-05-07", relatedTo: "Shipment #FS203" },
  { id: 'T002', description: "Allocate Fabric Lot #FL987-A to Bin C-2", priority: "Medium", status: "Pending", assignedDate: "2025-05-07", relatedTo: "Fabric Lot #FL987-A" },
  { id: 'T003', description: "Pick items for Order #G124", priority: "High", status: "In Progress", assignedDate: "2025-05-08", relatedTo: "Order #G124" },
  { id: 'T004', description: "Cycle Count - Finished Goods Section", priority: "Low", status: "Pending", assignedDate: "2025-05-08", relatedTo: "Inventory Audit" },
  { id: 'T005', description: "Prepare Dispatch Note for Order #G122", priority: "Medium", status: "Completed", assignedDate: "2025-05-07", relatedTo: "Order #G122" },
  { id: 'T006', description: "Restock Shelving Unit B3", priority: "Low", status: "Pending", assignedDate: "2025-05-09", relatedTo: "General Maintenance" },
  { id: 'T007', description: "Verify Outgoing Order #G125 Contents", priority: "High", status: "In Progress", assignedDate: "2025-05-09", relatedTo: "Order #G125" },
];

// Helper for status pills - Refined for table
const getTaskStatusPill = (status) => {
  let pillClasses = "px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center justify-center min-w-[90px] ";
  switch (status) {
    case 'Pending':
      pillClasses += "bg-yellow-700/30 text-yellow-300 border border-yellow-600/50";
      return <span className={pillClasses}><LuHourglass className="w-3 h-3 mr-1.5"/>Pending</span>;
    case 'In Progress':
      pillClasses += "bg-blue-700/30 text-blue-300 border border-blue-600/50";
      return <span className={pillClasses}><LuClock className="w-3 h-3 mr-1.5"/>In Progress</span>;
    case 'Completed':
      pillClasses += "bg-green-700/30 text-green-300 border border-green-600/50";
      return <span className={pillClasses}><LuCheck className="w-3 h-3 mr-1.5"/>Completed</span>;
    default:
      pillClasses += "bg-gray-600/30 text-gray-300 border border-gray-500/50";
      return <span className={pillClasses}>{status}</span>;
  }
};

// This is the correct function name as defined
const getPriorityCellStyle = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-400 font-semibold';
      case 'Medium': return 'text-yellow-400 font-medium';
      case 'Low': return 'text-blue-400 font-normal';
      default: return 'text-gray-400 font-normal';
    }
};

// --- Component Start ---
const WarehouseTasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const handleViewTaskDetails = (taskId) => alert(`Viewing details for task ${taskId}`);
  const handleUpdateTaskStatus = (taskId) => alert(`Updating status for task ${taskId}. (Mock Action)`);

  const statuses = useMemo(() => ['All', ...new Set(warehouseTasksData.map(task => task.status))], []);
  const priorities = useMemo(() => ['All', ...new Set(warehouseTasksData.map(task => task.priority))], []);

  const filteredTasks = useMemo(() => {
    return warehouseTasksData.filter(task => {
      const matchesSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (task.relatedTo && task.relatedTo.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="space-y-8 text-white font-sans"> {/* Increased main spacing */}
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center">
          <LuListChecks className="mr-3 text-teal-400" /> Warehouse Tasks & Schedule
        </h1>
        {/* Add Task button can be added if needed */}
        {/* <button className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm">
            <LuPlus className="w-4 h-4 mr-2" /> Add New Task
        </button> */}
      </div>

      {/* Filters and Search Bar - Refined Styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-5 bg-gray-800/50 rounded-xl border border-gray-700/60 shadow-md">
        <div className="relative">
          <LuSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700/60 border border-gray-600/80 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-gray-700/60 border border-gray-600/80 rounded-lg py-2.5 px-3.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
        >
          {statuses.map(stat => <option key={stat} value={stat}>{stat === 'All' ? 'All Statuses' : stat}</option>)}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="w-full bg-gray-700/60 border border-gray-600/80 rounded-lg py-2.5 px-3.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
        >
          {priorities.map(prio => <option key={prio} value={prio}>{prio === 'All' ? 'All Priorities' : prio}</option>)}
        </select>
      </div>

      {/* Task Table View */}
      {filteredTasks.length > 0 ? (
        <div className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/60 overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]"> {/* Added min-width for horizontal scroll on small screens */}
            <thead className="bg-gray-700/40 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4">Task ID</th>
                <th scope="col" className="px-6 py-4">Description</th>
                <th scope="col" className="px-6 py-4">Related To</th>
                <th scope="col" className="px-6 py-4">Assigned Date</th>
                <th scope="col" className="px-6 py-4 text-center">Priority</th>
                <th scope="col" className="px-6 py-4 text-center">Status</th>
                <th scope="col" className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-700/30 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-500">{task.id}</td>
                  <td className="px-6 py-4 text-gray-100 max-w-xs truncate" title={task.description}>{task.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{task.relatedTo || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    <div className="flex items-center">
                        <LuCalendarDays className="w-3.5 h-3.5 mr-1.5 text-gray-500"/>
                        {task.assignedDate}
                    </div>
                  </td>
                  {/* Corrected function call here */}
                  <td className={`px-6 py-4 whitespace-nowrap text-center ${getPriorityCellStyle(task.priority)}`}>
                    {task.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getTaskStatusPill(task.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button onClick={() => handleViewTaskDetails(task.id)} className="p-1.5 text-gray-400 hover:text-teal-300 hover:bg-gray-700/50 rounded-md transition-colors" title="View Details">
                      <LuEye className="w-4 h-4" />
                    </button>
                    {task.status !== 'Completed' && (
                      <button onClick={() => handleUpdateTaskStatus(task.id)} className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-gray-700/50 rounded-md transition-colors" title="Update Status">
                        <LuPencil className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
         <div className="text-center py-16 px-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <LuSearch className="w-16 h-16 mx-auto text-gray-500 mb-5" />
            <p className="text-gray-300 text-xl">No tasks match your current filters.</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
         </div>
      )}
    </div>
  );
};

export default WarehouseTasks;
