import React, { useState, useMemo } from 'react';
// Using LuPencil as the workaround for LuEdit
import { LuUserCog, LuPlus, LuPencil, LuTrash2, LuSearch, LuFilter } from 'react-icons/lu';

// Mock User Data (Added more diverse statuses/departments for filtering)
const users = [
  { id: 1, name: "Abenezer Tilahun", role: "Admin", department: "Management", email: "abeni@example.com", status: "Active", avatarColor: "bg-red-500" },
  { id: 2, name: "Hana Lemma", role: "Production Manager", department: "Production", email: "hana.l@example.com", status: "Active", avatarColor: "bg-blue-500" },
  { id: 3, name: "Yosef Tadesse", role: "Warehouse", department: "Warehouse", email: "yosef.t@example.com", status: "Active", avatarColor: "bg-indigo-500" },
  { id: 4, name: "Bereket Berhanu", role: "Merchandiser", department: "Merchandising", email: "bereket.b@example.com", status: "Active", avatarColor: "bg-purple-500" },
  { id: 5, name: "Samuel Girma", role: "Cutting Manager", department: "Cutting", email: "samuel.g@example.com", status: "Inactive", avatarColor: "bg-pink-500" },
  { id: 6, name: "Liya Assefa", role: "Packaging", department: "Packaging", email: "liya.a@example.com", status: "Active", avatarColor: "bg-rose-500" },
  { id: 7, name: "Dawit Mekonnen", role: "Quality Manager", department: "Quality Control", email: "dawit.m@example.com", status: "Active", avatarColor: "bg-emerald-500" },
  { id: 8, name: "Sara Belay", role: "Production Staff", department: "Production", email: "sara.b@example.com", status: "Active", avatarColor: "bg-sky-500" },
  { id: 9, name: "Daniel Ayele", role: "Warehouse Staff", department: "Warehouse", email: "daniel.a@example.com", status: "Inactive", avatarColor: "bg-amber-500" },
];

// Helper to get initials for avatar
const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
};

// --- Component Start ---
const AdminUserManagement = () => {
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive'

  // Placeholder action handlers
  const handleAddUser = () => alert('Add New User form would open here.');
  const handleEditUser = (userId) => alert(`Edit User form for ID ${userId} would open here.`);
  const handleDeleteUser = (userId) => alert(`Confirm delete for User ID ${userId} would appear here.`);

  // Filter users based on search term and status
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  return (
    <div className="space-y-6 text-white">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-semibold tracking-tight flex items-center">
          <LuUserCog className="mr-3 text-teal-400" /> User Management
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-gray-700/50 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
           {/* Status Filter Dropdown */}
           <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 appearance-none"
           >
             <option value="All">All Statuses</option>
             <option value="Active">Active</option>
             <option value="Inactive">Inactive</option>
           </select>
          {/* Add User Button */}
          <button
            onClick={handleAddUser}
            className="w-full sm:w-auto flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm flex-shrink-0"
          >
            <LuPlus className="w-4 h-4 mr-2" /> Add User
          </button>
        </div>
      </div>

      {/* User Cards Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            // User Card
            <div key={user.id} className="bg-gradient-to-br from-gray-800 to-gray-800/70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700/50 p-5 flex flex-col transition-shadow hover:shadow-teal-500/20">
              {/* Card Header: Avatar, Name, Role */}
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${user.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 flex-shrink-0`}>
                  {getInitials(user.name)}
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className="text-base font-semibold text-gray-100 truncate" title={user.name}>{user.name}</p>
                  <p className="text-xs text-teal-400 truncate" title={user.role}>{user.role}</p>
                </div>
              </div>

              {/* Card Body: Department, Email, Status */}
              <div className="space-y-2 text-sm mb-4 flex-grow">
                <p className="text-gray-400"><strong className="text-gray-300 font-medium">Dept:</strong> {user.department}</p>
                <p className="text-gray-400 truncate" title={user.email}><strong className="text-gray-300 font-medium">Email:</strong> {user.email}</p>
                <p className="text-gray-400"><strong className="text-gray-300 font-medium">Status:</strong>
                  <span className={`ml-2 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                  }`}>
                    {user.status}
                  </span>
                </p>
              </div>

              {/* Card Footer: Actions */}
              <div className="mt-auto pt-3 border-t border-gray-700/30 flex justify-end space-x-3">
                <button onClick={() => handleEditUser(user.id)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Edit User">
                  <LuPencil className="w-4 h-4" /> {/* Using LuPencil workaround */}
                </button>
                <button onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:text-red-300 transition-colors" title="Delete User">
                  <LuTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
         // Message when no users match filters
         <div className="text-center py-10 px-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <LuSearch className="w-10 h-10 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No users found matching your criteria.</p>
         </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
