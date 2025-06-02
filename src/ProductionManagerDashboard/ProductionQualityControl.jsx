import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,      // Main icon for Quality Control
  FaExclamationTriangle, // Defects
  FaClipboardCheck,   // Inspections
  FaPlusCircle,       // Add new inspection
  FaEdit,             // Edit inspection
  FaTrash,            // Delete inspection
  FaChartPie,         // For defect breakdown chart
  FaFilter,           // Filter icon
  FaInfoCircle,       // Info icon
  FaCalendarAlt,      // Date filter
  FaLayerGroup,       // Style filter
  FaListOl,           // Line filter
  FaChartLine,  
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// --- Mock Data for Quality Inspections ---
const mockQualityInspections = [
  {
    id: 'qi-1',
    date: '2025-06-01',
    line: '2',
    style: 'Baby Trouser',
    inspector: 'Maria S.',
    inspectedUnits: 500,
    passedUnits: 485,
    reworkUnits: 10,
    rejectedUnits: 5,
    defects: [
      { type: 'Stitching Error', count: 12 },
      { type: 'Fabric Snag', count: 3 },
      { type: 'Button Missing', count: 5 },
    ],
    notes: 'Random checks throughout the shift.',
  },
  {
    id: 'qi-2',
    date: '2025-06-01',
    line: '3',
    style: 'Kids Shirt',
    inspector: 'John D.',
    inspectedUnits: 400,
    passedUnits: 390,
    reworkUnits: 8,
    rejectedUnits: 2,
    defects: [
      { type: 'Print Misalignment', count: 5 },
      { type: 'Loose Thread', count: 5 },
    ],
    notes: 'End of line inspection for critical points.',
  },
  {
    id: 'qi-3',
    date: '2025-06-02',
    line: '2',
    style: 'Baby Trouser',
    inspector: 'Maria S.',
    inspectedUnits: 550,
    passedUnits: 530,
    reworkUnits: 15,
    rejectedUnits: 5,
    defects: [
      { type: 'Stitching Error', count: 10 },
      { type: 'Fabric Stain', count: 8 },
      { type: 'Button Missing', count: 2 },
    ],
    notes: 'Batch 1 complete inspection.',
  },
  {
    id: 'qi-4',
    date: '2025-06-02',
    line: '1',
    style: 'Mens Polo T-shirt',
    inspector: 'David L.',
    inspectedUnits: 600,
    passedUnits: 580,
    reworkUnits: 10,
    rejectedUnits: 10,
    defects: [
      { type: 'Stitching Error', count: 10 },
      { type: 'Incorrect Measurement', count: 5 },
      { type: 'Fabric Snag', count: 5 },
    ],
    notes: 'Pre-final inspection.',
  },
];

const ProductionQualityControl = () => {
  const [inspections, setInspections] = useState(mockQualityInspections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInspection, setCurrentInspection] = useState(null); // For edit functionality

  // Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterLine, setFilterLine] = useState('');
  const [filterStyle, setFilterStyle] = useState('');

  const filteredInspections = inspections.filter(insp => {
    const dateMatch = !filterDate || insp.date === filterDate;
    const lineMatch = !filterLine || insp.line === filterLine;
    const styleMatch = !filterStyle || insp.style === filterStyle;
    return dateMatch && lineMatch && styleMatch;
  });

  // Calculate summary metrics for filtered data
  const totalInspected = filteredInspections.reduce((sum, i) => sum + i.inspectedUnits, 0);
  const totalPassed = filteredInspections.reduce((sum, i) => sum + i.passedUnits, 0);
  const totalRejected = filteredInspections.reduce((sum, i) => sum + i.rejectedUnits, 0);
  const totalRework = filteredInspections.reduce((sum, i) => sum + i.reworkUnits, 0);
  const overallPassRate = totalInspected > 0 ? ((totalPassed / totalInspected) * 100).toFixed(1) : '0.0';
  const overallDefectRate = totalInspected > 0 ? (((totalRejected + totalRework) / totalInspected) * 100).toFixed(1) : '0.0';

  // Aggregate defects for charts
  const aggregatedDefects = filteredInspections.reduce((acc, inspection) => {
    inspection.defects.forEach(d => {
      acc[d.type] = (acc[d.type] || 0) + d.count;
    });
    return acc;
  }, {});

  const defectLabels = Object.keys(aggregatedDefects);
  const defectCounts = Object.values(aggregatedDefects);

  const pieChartData = {
    labels: defectLabels,
    datasets: [
      {
        data: defectCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e2e8f0', // Tailwind gray-200
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  const handleAddEditInspection = (inspectionData) => {
    if (inspectionData.id) {
      // Edit existing inspection
      setInspections(inspections.map(insp => (insp.id === inspectionData.id ? inspectionData : insp)));
    } else {
      // Add new inspection
      const newId = `qi-${inspections.length + 1}`;
      setInspections([...inspections, { ...inspectionData, id: newId }]);
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

  const uniqueDates = [...new Set(mockQualityInspections.map(i => i.date))];
  const uniqueLines = [...new Set(mockQualityInspections.map(i => i.line))];
  const uniqueStyles = [...new Set(mockQualityInspections.map(i => i.style))];


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
          <h1 className="text-3xl font-semibold tracking-tight">Quality Control</h1>
          <p className="text-lg text-gray-400 mt-1">Monitor product quality, track defects, and manage inspections.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            onClick={() => { setCurrentInspection(null); setIsModalOpen(true); }}
          >
            <FaPlusCircle className="w-4 h-4 mr-2" /> Log New Inspection
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaClipboardCheck className="w-8 h-8 text-indigo-400 mb-3" />
          <p className="text-sm text-gray-400">Total Units Inspected</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{totalInspected.toLocaleString()}</h2>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaCheckCircle className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-sm text-gray-400">Overall Pass Rate</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{overallPassRate}%</h2>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaExclamationTriangle className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-sm text-gray-400">Overall Defect Rate</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{overallDefectRate}%</h2>
        </div>

        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaChartPie className="w-8 h-8 text-purple-400 mb-3" />
          <p className="text-sm text-gray-400">Total Defects Reported</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{(totalRejected + totalRework).toLocaleString()}</h2>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaCalendarAlt className="text-gray-400" />
          <label htmlFor="filter-date" className="sr-only">Filter by Date</label>
          <select
            id="filter-date"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <option value="">All Dates</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaListOl className="text-gray-400" />
          <label htmlFor="filter-line" className="sr-only">Filter by Line</label>
          <select
            id="filter-line"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterLine}
            onChange={(e) => setFilterLine(e.target.value)}
          >
            <option value="">All Lines</option>
            {uniqueLines.map(line => (
              <option key={line} value={line}>{`Line ${line}`}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaLayerGroup className="text-gray-400" />
          <label htmlFor="filter-style" className="sr-only">Filter by Style</label>
          <select
            id="filter-style"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStyle}
            onChange={(e) => setFilterStyle(e.target.value)}
          >
            <option value="">All Styles</option>
            {uniqueStyles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Defect Breakdown Pie Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartPie className="mr-2" /> Defect Breakdown</h3>
          <div className="h-72">
            {defectLabels.length > 0 ? (
              <Pie data={pieChartData} options={pieChartOptions} />
            ) : (
              <div className="text-center text-gray-500 flex items-center justify-center h-full">No defect data available for selected filters.</div>
            )}
          </div>
        </motion.div>

        {/* Quality Trend (e.g., Daily Pass Rate) - Placeholder */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartLine className="mr-2" /> Pass Rate Trend (Placeholder)</h3>
          <div className="h-72 flex items-center justify-center text-gray-500">
            <p>Chart for Pass Rate Trend over time would go here.</p>
          </div>
        </motion.div>
      </div>


      {/* Inspection Records Table */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center">
          <FaClipboardCheck className="mr-2" /> Recent Inspection Records
        </h3>
        {filteredInspections.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Line</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Style</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Inspected By</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Units (I/P/R/Re)</th> {/* Inspected/Passed/Rejected/Rework */}
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Defects</th>
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
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {record.inspectedUnits}/{record.passedUnits}/{record.rejectedUnits}/{record.reworkUnits}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">
                      {record.defects.map(d => `${d.type} (${d.count})`).join(', ') || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        className="text-blue-400 hover:text-blue-300 mr-3"
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
            <p>No quality inspection records found for the selected filters.</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Inspection Modal */}
      {isModalOpen && (
        <InspectionFormModal
          inspection={currentInspection}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEditInspection}
        />
      )}
    </motion.div>
  );
};

// --- Inspection Form Modal Component ---
const InspectionFormModal = ({ inspection, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: inspection?.date || new Date().toISOString().split('T')[0],
    line: inspection?.line || '',
    style: inspection?.style || '',
    inspector: inspection?.inspector || '',
    inspectedUnits: inspection?.inspectedUnits || '',
    passedUnits: inspection?.passedUnits || '',
    reworkUnits: inspection?.reworkUnits || '',
    rejectedUnits: inspection?.rejectedUnits || '',
    defects: inspection?.defects.map(d => `${d.type}:${d.count}`).join('\n') || '', // Store as string for textarea
    notes: inspection?.notes || '',
    id: inspection?.id || null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Parse defects string into array of objects
    const parsedDefects = formData.defects
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => {
        const [type, count] = line.split(':');
        return { type: type.trim(), count: parseInt(count, 10) || 0 };
      });

    onSave({ ...formData, defects: parsedDefects });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 relative"
      >
        <h3 className="text-2xl font-semibold mb-6 text-white">{inspection ? 'Edit Inspection Record' : 'Log New Inspection'}</h3>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">
          &times;
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label htmlFor="line" className="block text-sm font-medium text-gray-300 mb-1">Line</label>
            <input type="text" id="line" name="line" value={formData.line} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-1">Style</label>
            <input type="text" id="style" name="style" value={formData.style} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label htmlFor="inspector" className="block text-sm font-medium text-gray-300 mb-1">Inspected By</label>
            <input type="text" id="inspector" name="inspector" value={formData.inspector} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label htmlFor="inspectedUnits" className="block text-sm font-medium text-gray-300 mb-1">Inspected Units</label>
            <input type="number" id="inspectedUnits" name="inspectedUnits" value={formData.inspectedUnits} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label htmlFor="passedUnits" className="block text-sm font-medium text-gray-300 mb-1">Passed Units</label>
            <input type="number" id="passedUnits" name="passedUnits" value={formData.passedUnits} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label htmlFor="reworkUnits" className="block text-sm font-medium text-gray-300 mb-1">Rework Units</label>
            <input type="number" id="reworkUnits" name="reworkUnits" value={formData.reworkUnits} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="rejectedUnits" className="block text-sm font-medium text-gray-300 mb-1">Rejected Units</label>
            <input type="number" id="rejectedUnits" name="rejectedUnits" value={formData.rejectedUnits} onChange={handleChange} className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="defects" className="block text-sm font-medium text-gray-300 mb-1">Defects (Type:Count, one per line)</label>
            <textarea
              id="defects"
              name="defects"
              rows="4"
              value={formData.defects}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Example:&#10;Stitching Error:12&#10;Fabric Snag:3"
            ></textarea>
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
              {inspection ? 'Save Changes' : 'Log Inspection'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProductionQualityControl;