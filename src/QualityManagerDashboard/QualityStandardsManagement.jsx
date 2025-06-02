import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBook,             // Main icon for standards
  FaPlusCircle,       // Add new
  FaEdit,             // Edit
  FaTrash,            // Delete
  FaSearch,           // Search filter
  FaInfoCircle,       // Info for empty states
  FaScroll,           // Icon for a single standard item
  FaRegListAlt        // Icon for criteria list
} from 'react-icons/fa';

// --- Mock Data ---
const mockStandards = [
  {
    id: 'std-001',
    name: 'T-Shirt Production Standard V1.2',
    description: 'Comprehensive quality requirements for all basic T-shirt production.',
    appliesTo: 'Knitwear (T-Shirts)',
    version: '1.2',
    lastUpdated: '2025-05-20',
    criteria: [
      'Stitch density: 12-14 stitches per inch on all seams.',
      'No loose threads exceeding 0.5 cm in length.',
      'Neck ribbing must be flat and symmetrical, without waving.',
      'Print alignment tolerance: +/- 2mm from design specification.',
      'Fabric weight within +/- 5% of specified GSM.',
      'Overall cleanliness: No oil stains, dirt marks, or foreign objects.',
    ],
  },
  {
    id: 'std-002',
    name: 'Zipper Quality Standard V2.0',
    description: 'Specific standards for zipper installation and functionality.',
    appliesTo: 'All products with zippers',
    version: '2.0',
    lastUpdated: '2025-06-01',
    criteria: [
      'Zipper puller must operate smoothly without snagging or stiffness.',
      'Zipper tape must be free from fraying or damage.',
      'Zipper teeth must align perfectly when closed.',
      'Zipper length must match design spec within +/- 1mm.',
      'Zipper color must match fabric color (unless contrasting spec).',
    ],
  },
  {
    id: 'std-003',
    name: 'Button & Buttonhole Standard V1.0',
    description: 'Quality checks for button attachment and buttonhole finishing.',
    appliesTo: 'All products with buttons/buttonholes',
    version: '1.0',
    lastUpdated: '2025-04-15',
    criteria: [
      'Buttons securely attached (no wobbling, minimum 4 stitches).',
      'Buttonholes clean, fully opened, and free of loose threads.',
      'Button alignment consistent and straight.',
      'Correct button size and type as per specification.',
    ],
  },
];

const QualityStandardsManagement = () => {
  const [standards, setStandards] = useState(mockStandards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStandard, setCurrentStandard] = useState(null); // For edit functionality
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStandards = standards.filter(standard =>
    standard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.appliesTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEditStandard = (standardData) => {
    if (standardData.id) {
      setStandards(standards.map(std => (std.id === standardData.id ? standardData : std)));
    } else {
      const newId = `std-${Date.now()}`; // Simple unique ID
      setStandards([...standards, { ...standardData, id: newId, lastUpdated: new Date().toISOString().split('T')[0] }]);
    }
    setIsModalOpen(false);
    setCurrentStandard(null);
  };

  const handleDeleteStandard = (id) => {
    if (window.confirm('Are you sure you want to delete this quality standard?')) {
      setStandards(standards.filter(std => std.id !== id));
    }
  };

  const handleEditClick = (standard) => {
    setCurrentStandard(standard);
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
          <h1 className="text-3xl font-semibold tracking-tight">Quality Standards Management</h1>
          <p className="text-lg text-gray-400 mt-1">Define and manage quality benchmarks and inspection criteria.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={() => { setCurrentStandard(null); setIsModalOpen(true); }}
          >
            <FaPlusCircle className="w-4 h-4 mr-2" /> New Standard
          </button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 flex items-center gap-4">
        <FaSearch className="text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search standards by name, description, or application..."
          className="flex-grow bg-gray-700 text-gray-200 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      {/* Standards List */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
          <FaBook className="mr-2" /> All Quality Standards
        </h3>
        {filteredStandards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStandards.map((standard) => (
              <motion.div
                key={standard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 border border-gray-700 rounded-lg p-5 flex flex-col hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-gray-100">{standard.name}</h4>
                  <div className="flex space-x-2">
                    <button
                      className="text-teal-400 hover:text-teal-300"
                      onClick={() => handleEditClick(standard)}
                      title="Edit Standard"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteStandard(standard.id)}
                      title="Delete Standard"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-2 truncate">{standard.description}</p>
                <p className="text-xs text-gray-500 mb-4">Applies to: <span className="font-medium text-gray-400">{standard.appliesTo}</span></p>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FaRegListAlt className="mr-2 text-gray-400" />
                  Criteria: {standard.criteria.length} items
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  Version: <span className="font-medium text-gray-400 ml-1">{standard.version}</span> | Last Updated: <span className="font-medium text-gray-400 ml-1">{standard.lastUpdated}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <FaInfoCircle className="w-12 h-12 mx-auto mb-3" />
            <p>No quality standards found. Click "New Standard" to add one.</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Standard Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <StandardFormModal
            standard={currentStandard}
            onClose={() => setIsModalOpen(false)}
            onSave={handleAddEditStandard}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- Standard Form Modal Component ---
const StandardFormModal = ({ standard, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: standard?.name || '',
    description: standard?.description || '',
    appliesTo: standard?.appliesTo || '',
    version: standard?.version || '1.0',
    criteria: standard?.criteria || [''], // Start with one empty criterion
    id: standard?.id || null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCriterionChange = (index, value) => {
    const newCriteria = [...formData.criteria];
    newCriteria[index] = value;
    setFormData(prev => ({ ...prev, criteria: newCriteria }));
  };

  const addCriterion = () => {
    setFormData(prev => ({ ...prev, criteria: [...prev.criteria, ''] }));
  };

  const removeCriterion = (index) => {
    setFormData(prev => ({
      ...prev,
      criteria: prev.criteria.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty criteria before saving
    const trimmedCriteria = formData.criteria.filter(c => c.trim() !== '');
    onSave({ ...formData, criteria: trimmedCriteria });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-3xl border border-gray-700 relative my-8"
      >
        <h3 className="text-2xl font-semibold mb-6 text-white">{standard ? 'Edit Quality Standard' : 'New Quality Standard'}</h3>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">
          &times;
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Standard Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" placeholder="A brief description of what this standard covers."></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appliesTo" className="block text-sm font-medium text-gray-300 mb-1">Applies To</label>
              <input type="text" id="appliesTo" name="appliesTo" value={formData.appliesTo} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" placeholder="e.g., All products, Knitwear, Style X-123" />
            </div>
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-300 mb-1">Version</label>
              <input type="text" id="version" name="version" value={formData.version} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
              <FaRegListAlt className="mr-2" /> Quality Criteria
            </h4>
            {formData.criteria.map((criterion, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={criterion}
                  onChange={(e) => handleCriterionChange(index, e.target.value)}
                  className="flex-grow p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500"
                  placeholder={`Criterion #${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeCriterion(index)}
                  className="text-red-400 hover:text-red-300 p-2"
                  title="Remove criterion"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addCriterion}
              className="mt-3 flex items-center text-teal-400 hover:text-teal-300 text-sm font-medium"
            >
              <FaPlusCircle className="mr-2" /> Add Criterion
            </button>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 mr-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition duration-200"
            >
              {standard ? 'Save Changes' : 'Create Standard'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default QualityStandardsManagement;