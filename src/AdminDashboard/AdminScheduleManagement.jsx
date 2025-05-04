import React, { useState, useMemo } from 'react';
// Using LuPencil workaround for LuEdit
// Using LuTriangleAlert as workaround for LuAlertTriangle
import { LuCalendarPlus, LuFilter, LuPencil, LuTrash, LuTriangleAlert, LuClock } from 'react-icons/lu'; // Changed LuAlertTriangle to LuTriangleAlert

// Mock Schedule Data
const schedules = [
  { id: 'S001', task: 'Cut Fabric - Order #G123', assignedTo: 'Cutting Dept.', dueDate: '2025-05-10', status: 'Pending', priority: 'High' },
  { id: 'S002', task: 'Stitch Sleeves - Order #G123', assignedTo: 'Production Dept.', dueDate: '2025-05-12', status: 'Pending', priority: 'High' },
  { id: 'S003', task: 'Prepare Shipping - Order #G122', assignedTo: 'Warehouse', dueDate: '2025-05-08', status: 'In Progress', priority: 'Medium' }, // Due soon
  { id: 'S004', task: 'Quality Check - Batch #B45', assignedTo: 'Quality Control', dueDate: '2025-05-09', status: 'Pending', priority: 'High' }, // Due soon
  { id: 'S005', task: 'Source Trims - Order #G124', assignedTo: 'Merchandising', dueDate: '2025-05-15', status: 'Pending', priority: 'Low' },
  { id: 'S006', task: 'Pack Order #G122', assignedTo: 'Packaging', dueDate: '2025-05-10', status: 'Completed', priority: 'Medium' },
  { id: 'S007', task: 'Final QC - Order #G123', assignedTo: 'Quality Control', dueDate: '2025-05-14', status: 'Pending', priority: 'High' },
];

// --- Helper Functions ---
const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-900/60 text-yellow-300';
    case 'In Progress': return 'bg-blue-900/60 text-blue-300';
    case 'Completed': return 'bg-green-900/60 text-green-300';
    default: return 'bg-gray-700 text-gray-300';
  }
};

const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

const isDueSoon = (dueDateStr, days = 3) => {
    const today = new Date();
    const dueDate = new Date(dueDateStr);
    const timeDiff = dueDate.getTime() - today.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    return dayDiff >= 0 && dayDiff <= days;
};

// --- Component Start ---
const AdminScheduleManagement = () => {
  // Placeholder action handlers
  const handleCreateSchedule = () => alert('Create New Schedule form would open here.');
  const handleEditSchedule = (scheduleId) => alert(`Edit Schedule form for ID ${scheduleId} would open here.`);
  const handleDeleteSchedule = (scheduleId) => alert(`Confirm delete for Schedule ID ${scheduleId} would appear here.`);
  const handleViewTask = (scheduleId) => alert(`View details for Task ID ${scheduleId}`);

  // Filter for urgent/upcoming tasks
  const urgentTasks = useMemo(() => {
    return schedules.filter(s =>
        s.status !== 'Completed' && (s.priority === 'High' || isDueSoon(s.dueDate, 3))
    ).slice(0, 4);
  }, [schedules]);

  return (
    <div className="space-y-8 text-white"> {/* Increased spacing */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">Schedule Management</h1>
        <div className="flex items-center space-x-3">
           {/* Placeholder for Filters */}
          <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
            <LuFilter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button
            onClick={handleCreateSchedule}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm"
          >
            <LuCalendarPlus className="w-4 h-4 mr-2" /> Create Schedule
          </button>
        </div>
      </div>

      {/* Urgent/Upcoming Highlights Section */}
      {urgentTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-300 flex items-center">
             {/* Using LuTriangleAlert icon */}
            <LuTriangleAlert className="w-5 h-5 mr-2 text-yellow-400" /> Priority Tasks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {urgentTasks.map(task => (
              <div key={task.id} className="bg-gradient-to-br from-gray-800 to-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-700/50 p-4 cursor-pointer hover:border-yellow-500/50 transition-colors duration-200" onClick={() => handleViewTask(task.id)}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-bold ${getPriorityColor(task.priority)}`}>{task.priority} Priority</span>
                   <span className={`px-2 py-0.5 inline-flex text-[10px] leading-4 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                </div>
                <p className="text-sm font-medium text-gray-200 mb-1 truncate" title={task.task}>{task.task}</p>
                <p className="text-xs text-gray-400 mb-2">To: {task.assignedTo}</p>
                <div className="flex items-center text-xs text-yellow-300">
                  <LuClock className="w-3 h-3 mr-1.5" />
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Schedule Table Section Title (Optional) */}
      <h2 className="text-xl font-semibold text-gray-300 pt-4 border-t border-gray-700/30">Full Schedule</h2>

      {/* Schedule Table */}
      <div className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50 overflow-x-auto"> {/* Added overflow-x-auto */}
        <table className="w-full text-left text-sm min-w-[700px]"> {/* Added min-width */}
          <thead className="bg-gray-700/50 text-xs text-gray-400 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3">Task ID</th>
              <th scope="col" className="px-6 py-3">Task Description</th>
              <th scope="col" className="px-6 py-3">Assigned To</th>
              <th scope="col" className="px-6 py-3">Due Date</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Priority</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-400">{schedule.id}</td>
                <td className="px-6 py-4 text-gray-200">{schedule.task}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{schedule.assignedTo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{schedule.dueDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                </td>
                 <td className={`px-6 py-4 whitespace-nowrap font-medium ${getPriorityColor(schedule.priority)}`}>
                  {schedule.priority}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button onClick={() => handleEditSchedule(schedule.id)} className="text-blue-400 hover:text-blue-300" title="Edit">
                    <LuPencil className="w-4 h-4" /> {/* Using LuPencil workaround */}
                  </button>
                  <button onClick={() => handleDeleteSchedule(schedule.id)} className="text-red-400 hover:text-red-300" title="Delete">
                    <LuTrash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminScheduleManagement;
