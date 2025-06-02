import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPlusCircle,     // Add new line
  FaEdit,           // Edit line
  FaTrash,          // Delete line
  FaCog,            // Main icon for line management
  FaCheckCircle,    // Active status
  FaTimesCircle,    // Inactive status
  FaUsers,          // Supervisor icon
  FaRulerCombined,  // SAM icon
  FaBullseye,       // Target icon
  FaIndustry,       // Line icon
} from 'react-icons/fa';

// --- Mock Data for Production Lines ---
const mockProductionLines = [
  {
    id: 'line-1',
    name: 'Line 1 (Knits)',
    supervisor: 'Alice Smith',
    capacityUnitsPerHour: 100,
    activeStyle: 'Mens Polo T-shirt',
    samMinutes: 10, // Standard Allowed Minutes per unit for active style
    dailyTargetUnits: 480, // 8 hours * 60 min/hr / 10 SAM = 480 units (example target)
    status: 'Active',
    notes: 'Specializes in high-volume knitwear.',
  },
  {
    id: 'line-2',
    name: 'Line 2 (Wovens)',
    supervisor: 'Bob Johnson',
    capacityUnitsPerHour: 80,
    activeStyle: 'Ladies Blouse',
    samMinutes: 15,
    dailyTargetUnits: 320, // 8 hours * 60 min/hr / 15 SAM = 320 units
    status: 'Active',
    notes: 'Used for intricate woven garments.',
  },
  {
    id: 'line-3',
    name: 'Line 3 (Specialty)',
    supervisor: 'Charlie Brown',
    capacityUnitsPerHour: 60,
    activeStyle: 'Denim Jacket',
    samMinutes: 25,
    dailyTargetUnits: 192, // 8 hours * 60 min/hr / 25 SAM = 192 units
    status: 'Inactive',
    notes: 'Currently undergoing maintenance for new machine installation.',
  },
  {
    id: 'line-4',
    name: 'Line 4 (Training)',
    supervisor: 'Diana Prince',
    capacityUnitsPerHour: 40,
    activeStyle: 'Kids Trouser',
    samMinutes: 12,
    dailyTargetUnits: 200,
    status: 'Active',
    notes: 'Dedicated line for new operator training.',
  },
];

const ProductionLineManagement = () => {
  const [lines, setLines] = useState(mockProductionLines);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLine, setCurrentLine] = useState(null); // For edit functionality

  const handleAddEditLine = (lineData) => {
    if (lineData.id) {
      // Edit existing line
      setLines(lines.map(line => (line.id === lineData.id ? lineData : line)));
    } else {
      // Add new line
      const newId = `line-${lines.length + 1}`;
      setLines([...lines, { ...lineData, id: newId, status: 'Active' }]);
    }
    setIsModalOpen(false);
    setCurrentLine(null);
  };

  const handleDeleteLine = (id) => {
    if (window.confirm('Are you sure you want to delete this line?')) {
      setLines(lines.filter(line => line.id !== id));
    }
  };

  const handleEditClick = (line) => {
    setCurrentLine(line);
    setIsModalOpen(true);
  };

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
      className="space-y-8 text-white font-sans p-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Production Line Management</h1>
          <p className="text-lg text-gray-400 mt-1">Configure and manage your garment production lines.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={() => { setCurrentLine(null); setIsModalOpen(true); }}
          >
            <FaPlusCircle className="w-4 h-4 mr-2" /> Add New Line
          </button>
        </div>
      </motion.div>

      {/* Lines Table */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
          <FaCog className="mr-2" /> All Production Lines
        </h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Line Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Supervisor</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Active Style</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">SAM (Min)</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Daily Target</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className={line.status === 'Inactive' ? 'bg-gray-800/50 italic text-gray-500' : (lines.indexOf(line) % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80')}>
                  <td className="py-3 px-4 text-sm text-gray-300">{line.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{line.supervisor}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{line.activeStyle}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{line.samMinutes}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{line.dailyTargetUnits.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`flex items-center px-2 py-1 rounded-full text-xs font-semibold w-fit
                      ${line.status === 'Active' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'}`}>
                      {line.status === 'Active' ? <FaCheckCircle className="mr-1" /> : <FaTimesCircle className="mr-1" />}
                      {line.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      className="text-blue-400 hover:text-blue-300 mr-3"
                      onClick={() => handleEditClick(line)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteLine(line.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add/Edit Line Modal */}
      {isModalOpen && (
        <LineFormModal
          line={currentLine}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEditLine}
        />
      )}
    </motion.div>
  );
};

// --- Line Form Modal Component ---
const LineFormModal = ({ line, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: line?.name || '',
    supervisor: line?.supervisor || '',
    capacityUnitsPerHour: line?.capacityUnitsPerHour || '',
    activeStyle: line?.activeStyle || '',
    samMinutes: line?.samMinutes || '',
    dailyTargetUnits: line?.dailyTargetUnits || '',
    status: line?.status || 'Active',
    notes: line?.notes || '',
    id: line?.id || null, // Keep existing ID for edits
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 relative"
      >
        <h3 className="text-2xl font-semibold mb-6 text-white">{line ? 'Edit Production Line' : 'Add New Production Line'}</h3>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">
          &times;
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Line Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="supervisor" className="block text-sm font-medium text-gray-300 mb-1">Supervisor</label>
            <input
              type="text"
              id="supervisor"
              name="supervisor"
              value={formData.supervisor}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="activeStyle" className="block text-sm font-medium text-gray-300 mb-1">Active Style</label>
            <input
              type="text"
              id="activeStyle"
              name="activeStyle"
              value={formData.activeStyle}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="samMinutes" className="block text-sm font-medium text-gray-300 mb-1">SAM (Minutes/Unit)</label>
            <input
              type="number"
              id="samMinutes"
              name="samMinutes"
              value={formData.samMinutes}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="dailyTargetUnits" className="block text-sm font-medium text-gray-300 mb-1">Daily Target (Units)</label>
            <input
              type="number"
              id="dailyTargetUnits"
              name="dailyTargetUnits"
              value={formData.dailyTargetUnits}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div className="md:col-span-2 flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 mr-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200"
            >
              {line ? 'Save Changes' : 'Add Line'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductionLineManagement;