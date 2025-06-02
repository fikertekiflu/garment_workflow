import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaPlusCircle,        // Add new
  FaEdit,              // Edit
  FaTrash,             // Delete
  FaFilter,            // Filter
  FaCalendarAlt,       // Date filter
  FaClipboardCheck,    // Main icon for Inspection Log
  FaInfoCircle,        // Info for empty states
  FaLayerGroup,        // Style filter
  FaListOl,            // Line filter
  FaUserTag,           // Inspector filter
  FaShoppingBag,       // Buyer filter
} from 'react-icons/fa';

// --- Mock Data ---
// Predefined list of common defect types from your image
const commonDefectTypes = [
  'Open seam / Skip stitch / Broken stitch',
  'U/N - Uneven',
  'M/I - Missing / Incomplete',
  'Facing / Piping issue',
  'Loose / Permanent thread',
  'Sharp defects (needles)',
  'Incorrect parts / accessories',
  'Incorrect size / average',
  'Needle Mark',
  'Open Hole',
  'Repair',
  'Missing stitches',
  'Incorrect label',
  'Wrong placement',
  'Holes/runs',
  'Garment Damage',
  'Oil mark',
  'Stain',
  'Over Size / Undersize',
  'Incorrect measurement',
];

const mockInspections = [
  {
    id: 'insp-001',
    date: '2025-06-01',
    line: '2',
    style: 'Baby Trouser',
    orderNo: 'BTR-1234',
    inspector: 'Maria S.',
    buyer: 'BabyCo',
    inspectedUnits: 500,
    passedUnits: 485,
    reworkUnits: 10,
    rejectedUnits: 5,
    defects: [
      { type: 'Stitching Error', count: 8 },
      { type: 'Fabric Snag', count: 5 },
      { type: 'Button Missing', count: 2 },
    ],
    notes: 'Random checks throughout the shift. Minor issues.',
    defectPercentage: '3.0', // (10+5)/500 * 100
  },
  {
    id: 'insp-002',
    date: '2025-06-01',
    line: '3',
    style: 'Kids Shirt',
    orderNo: 'KST-5678',
    inspector: 'John D.',
    buyer: 'FashionKids',
    inspectedUnits: 400,
    passedUnits: 390,
    reworkUnits: 8,
    rejectedUnits: 2,
    defects: [
      { type: 'Print Misalignment', count: 6 },
      { type: 'Loose / Permanent thread', count: 4 },
    ],
    notes: 'End of line inspection. Print alignment needs attention.',
    defectPercentage: '2.5', // (8+2)/400 * 100
  },
  {
    id: 'insp-003',
    date: '2025-06-02',
    line: '1',
    style: 'Mens Polo',
    orderNo: 'MPO-9012',
    inspector: 'David L.',
    buyer: 'Gentleman Apparel',
    inspectedUnits: 600,
    passedUnits: 580,
    reworkUnits: 10,
    rejectedUnits: 10,
    defects: [
      { type: 'Incorrect Measurement', count: 12 },
      { type: 'Stitching Error', count: 8 },
    ],
    notes: 'Batch 1 pre-final inspection. Check measurements.',
    defectPercentage: '3.3', // (10+10)/600 * 100
  },
];


const QualityInspectionLog = () => {
  const [inspections, setInspections] = useState(mockInspections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInspection, setCurrentInspection] = useState(null); // For edit functionality

  // Filters state
  const [filterDate, setFilterDate] = useState('');
  const [filterLine, setFilterLine] = useState('');
  const [filterStyle, setFilterStyle] = useState('');
  const [filterInspector, setFilterInspector] = useState('');
  const [filterBuyer, setFilterBuyer] = useState('');

  const filteredInspections = inspections.filter(insp => {
    const dateMatch = !filterDate || insp.date === filterDate;
    const lineMatch = !filterLine || insp.line === filterLine;
    const styleMatch = !filterStyle || insp.style === filterStyle;
    const inspectorMatch = !filterInspector || insp.inspector.toLowerCase().includes(filterInspector.toLowerCase());
    const buyerMatch = !filterBuyer || insp.buyer.toLowerCase().includes(filterBuyer.toLowerCase());
    return dateMatch && lineMatch && styleMatch && inspectorMatch && buyerMatch;
  });

  // Get unique values for filters
  const getUnique = (key) => [...new Set(mockInspections.map(item => item[key]))];
  const uniqueDates = getUnique('date').sort();
  const uniqueLines = getUnique('line').sort();
  const uniqueStyles = getUnique('style').sort();
  const uniqueInspectors = getUnique('inspector').sort();
  const uniqueBuyers = getUnique('buyer').sort();


  const handleAddEditInspection = (inspectionData) => {
    // Calculate passed units and defect percentage
    const totalDefects = inspectionData.defects.reduce((sum, d) => sum + d.count, 0) +
                         (parseInt(inspectionData.reworkUnits) || 0) +
                         (parseInt(inspectionData.rejectedUnits) || 0);
    const passed = (parseInt(inspectionData.inspectedUnits) || 0) - totalDefects;
    const defectPerc = inspectionData.inspectedUnits > 0
                       ? ((totalDefects / inspectionData.inspectedUnits) * 100).toFixed(1)
                       : '0.0';

    const newInspection = {
      ...inspectionData,
      passedUnits: passed >= 0 ? passed : 0, // Ensure passed units isn't negative
      defectPercentage: defectPerc,
    };

    if (newInspection.id) {
      setInspections(inspections.map(insp => (insp.id === newInspection.id ? newInspection : insp)));
    } else {
      const newId = `insp-${Date.now()}`; // Simple unique ID
      setInspections([...inspections, { ...newInspection, id: newId }]);
    }
    setIsModalOpen(false);
    setCurrentInspection(null);
  };

  const handleDeleteInspection = (id) => {
    if (window.confirm('Are you sure you want to delete this inspection record?')) {
      setInspections(inspections.filter(insp => insp.id !== id));
    }
  };

  const handleEditClick = (inspection) => {
    setCurrentInspection(inspection);
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
          <h1 className="text-3xl font-semibold tracking-tight">Quality Inspection Log</h1>
          <p className="text-lg text-gray-400 mt-1">Detailed records of product quality inspections.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={() => { setCurrentInspection(null); setIsModalOpen(true); }}
          >
            <FaPlusCircle className="w-4 h-4 mr-2" /> Log New Inspection
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="flex items-center gap-2 w-full">
          <FaCalendarAlt className="text-gray-400" />
          <label htmlFor="filter-date" className="sr-only">Filter by Date</label>
          <select
            id="filter-date"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="">All Dates</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full">
          <FaListOl className="text-gray-400" />
          <label htmlFor="filter-line" className="sr-only">Filter by Line</label>
          <select
            id="filter-line"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterLine}
            onChange={(e) => setFilterLine(e.target.value)}
          >
            <option value="">All Lines</option>
            {uniqueLines.map(line => (
              <option key={line} value={line}>{`Line ${line}`}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full">
          <FaLayerGroup className="text-gray-400" />
          <label htmlFor="filter-style" className="sr-only">Filter by Style</label>
          <select
            id="filter-style"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterStyle}
            onChange={(e) => setFilterStyle(e.target.value)}
          >
            <option value="">All Styles</option>
            {uniqueStyles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full">
          <FaUserTag className="text-gray-400" />
          <label htmlFor="filter-inspector" className="sr-only">Filter by Inspector</label>
          <select
            id="filter-inspector"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterInspector}
            onChange={(e) => setFilterInspector(e.target.value)}
          >
            <option value="">All Inspectors</option>
            {uniqueInspectors.map(inspector => (
              <option key={inspector} value={inspector}>{inspector}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full">
          <FaShoppingBag className="text-gray-400" />
          <label htmlFor="filter-buyer" className="sr-only">Filter by Buyer</label>
          <select
            id="filter-buyer"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterBuyer}
            onChange={(e) => setFilterBuyer(e.target.value)}
          >
            <option value="">All Buyers</option>
            {uniqueBuyers.map(buyer => (
              <option key={buyer} value={buyer}>{buyer}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Inspection Records Table */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
          <FaClipboardCheck className="mr-2" /> All Inspection Records
        </h3>
        {filteredInspections.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Line</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Style</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Inspector</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Buyer</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Total Inspected</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Passed</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Rework</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Rejected</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Defect %</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.map((record, index) => (
                  <tr key={record.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/80'}>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.line}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.style}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.inspector}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.buyer}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.inspectedUnits}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.passedUnits}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.reworkUnits}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{record.rejectedUnits}</td>
                    <td className="py-3 px-4 text-sm text-red-300 font-medium">{record.defectPercentage}%</td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        className="text-teal-400 hover:text-teal-300 mr-3"
                        onClick={() => handleEditClick(record)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteInspection(record.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <FaInfoCircle className="w-12 h-12 mx-auto mb-3" />
            <p>No inspection records found for the selected filters.</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Inspection Modal */}
      {isModalOpen && (
        <InspectionFormModal
          inspection={currentInspection}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEditInspection}
          defectTypes={commonDefectTypes} // Pass defect types to the modal
        />
      )}
    </motion.div>
  );
};

// --- Inspection Form Modal Component ---
const InspectionFormModal = ({ inspection, onClose, onSave, defectTypes }) => {
  const [formData, setFormData] = useState({
    date: inspection?.date || new Date().toISOString().split('T')[0],
    line: inspection?.line || '',
    style: inspection?.style || '',
    orderNo: inspection?.orderNo || '',
    inspector: inspection?.inspector || '',
    buyer: inspection?.buyer || '',
    inspectedUnits: inspection?.inspectedUnits || '',
    reworkUnits: inspection?.reworkUnits || '',
    rejectedUnits: inspection?.rejectedUnits || '',
    notes: inspection?.notes || '',
    // Initialize defects with counts from inspection or all types with 0
    defects: inspection?.defects || defectTypes.map(type => ({ type, count: 0 })),
    id: inspection?.id || null,
  });

  // Ensure all commonDefectTypes are present in formData.defects
  useEffect(() => {
    const existingDefectMap = new Map(formData.defects.map(d => [d.type, d.count]));
    const updatedDefects = defectTypes.map(type => ({
      type,
      count: existingDefectMap.has(type) ? existingDefectMap.get(type) : 0
    }));
    setFormData(prev => ({ ...prev, defects: updatedDefects }));
  }, [inspection, defectTypes]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDefectChange = (type, count) => {
    setFormData(prev => ({
      ...prev,
      defects: prev.defects.map(d =>
        d.type === type ? { ...d, count: parseInt(count) || 0 } : d
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-4xl border border-gray-700 relative my-8"
      >
        <h3 className="text-2xl font-semibold mb-6 text-white">{inspection ? 'Edit Inspection Record' : 'Log New Inspection'}</h3>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">
          &times;
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <div>
            <label htmlFor="line" className="block text-sm font-medium text-gray-300 mb-1">Line</label>
            <input type="text" id="line" name="line" value={formData.line} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-1">Style</label>
            <input type="text" id="style" name="style" value={formData.style} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <div>
            <label htmlFor="orderNo" className="block text-sm font-medium text-gray-300 mb-1">Order No.</label>
            <input type="text" id="orderNo" name="orderNo" value={formData.orderNo} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label htmlFor="inspector" className="block text-sm font-medium text-gray-300 mb-1">Inspected By</label>
            <input type="text" id="inspector" name="inspector" value={formData.inspector} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" required />
          </div>
          <div>
            <label htmlFor="buyer" className="block text-sm font-medium text-gray-300 mb-1">Buyer</label>
            <input type="text" id="buyer" name="buyer" value={formData.buyer} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="inspectedUnits" className="block text-sm font-medium text-gray-300 mb-1">Total Inspected Units</label>
            <input type="number" id="inspectedUnits" name="inspectedUnits" value={formData.inspectedUnits} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" required />
          </div>

          {/* Defect Counts Section */}
          <div className="md:col-span-2 mt-4">
            <h4 className="text-lg font-semibold text-gray-200 mb-3">Defect Counts:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {formData.defects.map((d, index) => (
                <div key={d.type} className="flex items-center gap-2">
                  <label htmlFor={`defect-${index}`} className="block text-sm font-medium text-gray-400 flex-grow">{d.type}</label>
                  <input
                    type="number"
                    id={`defect-${index}`}
                    value={d.count}
                    onChange={(e) => handleDefectChange(d.type, e.target.value)}
                    className="w-20 p-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 text-center focus:ring-teal-500 focus:border-teal-500"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rework and Rejected Units */}
          <div>
            <label htmlFor="reworkUnits" className="block text-sm font-medium text-gray-300 mb-1">Units for Rework</label>
            <input type="number" id="reworkUnits" name="reworkUnits" value={formData.reworkUnits} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" min="0" />
          </div>
          <div>
            <label htmlFor="rejectedUnits" className="block text-sm font-medium text-gray-300 mb-1">Rejected Units</label>
            <input type="number" id="rejectedUnits" name="rejectedUnits" value={formData.rejectedUnits} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500" min="0" />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes / Remarks</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Any specific comments or observations..."
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
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition duration-200"
            >
              {inspection ? 'Save Changes' : 'Log Inspection'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default QualityInspectionLog;