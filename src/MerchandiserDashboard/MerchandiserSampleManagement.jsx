// src/MerchandiserDashboard/SampleManagement.jsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaSearch,
  FaSort,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaLayerGroup, // Icon for sample stages
  FaCalendarAlt,
  FaCommentDots, // For comments/revisions
  FaTrash,
  FaTimes,
  FaEdit
} from 'react-icons/fa';

// --- Mock Data for Sample Management ---
const mockSamples = [
  {
    id: 'SAMP-2025-001',
    orderId: 'ORD-2025-001',
    style: 'Men\'s Casual Shirt SS25',
    sampleType: 'Proto Sample',
    submissionDate: '2025-02-01',
    approvalDate: '2025-02-10',
    status: 'Approved',
    comments: 'Minor adjustment on collar width as per buyer comment.',
    revisions: [
      { date: '2025-02-05', comment: 'Buyer requested collar width reduction.' },
      { date: '2025-02-01', comment: 'Initial proto sample submitted.' }
    ]
  },
  {
    id: 'SAMP-2025-002',
    orderId: 'ORD-2025-001',
    style: 'Men\'s Casual Shirt SS25',
    sampleType: 'Fit Sample',
    submissionDate: '2025-03-01',
    approvalDate: '2025-03-08',
    status: 'Approved',
    comments: 'Fit approved. Proceed to PP sample.',
    revisions: [
      { date: '2025-03-05', comment: 'Second fit sample submitted after minor armhole adjustment.' },
      { date: '2025-03-01', comment: 'Initial fit sample submitted.' }
    ]
  },
  {
    id: 'SAMP-2025-003',
    orderId: 'ORD-2025-002',
    style: 'Women\'s Summer Dress SS25',
    sampleType: 'Proto Sample',
    submissionDate: '2025-02-15',
    approvalDate: '', // Empty if not approved yet
    status: 'Pending Review',
    comments: 'Awaiting buyer comments on design details and fabric drape.',
    revisions: [
      { date: '2025-02-15', comment: 'Initial proto sample submitted.' }
    ]
  },
  {
    id: 'SAMP-2025-004',
    orderId: 'ORD-2025-003',
    style: 'Unisex Hoodie FW25',
    sampleType: 'PP Sample',
    submissionDate: '2025-04-10',
    approvalDate: '',
    status: 'Rejected',
    comments: 'Fabric color not matching. Re-submission required.',
    revisions: [
      { date: '2025-04-15', comment: 'Rejected due to incorrect fabric color.' },
      { date: '2025-04-10', comment: 'PP sample submitted with current bulk fabric.' }
    ]
  },
  {
    id: 'SAMP-2025-005',
    orderId: 'ORD-2025-004',
    style: 'Athletic Tracksuit SS25',
    sampleType: 'Salesman Sample',
    submissionDate: '2025-04-20',
    approvalDate: '2025-04-25',
    status: 'Approved',
    comments: 'Salesman samples approved for production.',
    revisions: [
      { date: '2025-04-20', comment: 'Salesman sample submitted.' }
    ]
  },
];

const SampleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedSample, setSelectedSample] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSample, setNewSample] = useState({
    orderId: '',
    style: '',
    sampleType: 'Proto Sample',
    submissionDate: '',
    approvalDate: '',
    status: 'Pending Review',
    comments: '',
    revisions: []
  });
  const [sortBy, setSortBy] = useState('submissionDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const filteredAndSortedSamples = useMemo(() => {
    let filtered = mockSamples.filter(sample => {
      const matchesSearch = searchTerm
        ? Object.values(sample).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          ) || sample.revisions.some(rev => rev.comment.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      const matchesStatus = filterStatus === 'All' || sample.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return 0; // Fallback for other types
    });

    return filtered;
  }, [searchTerm, filterStatus, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'text-green-400 bg-green-900/30';
      case 'Pending Review':
        return 'text-yellow-400 bg-yellow-900/30';
      case 'Rejected':
        return 'text-red-400 bg-red-900/30';
      case 'Submitted':
        return 'text-blue-400 bg-blue-900/30';
      default:
        return 'text-gray-400 bg-gray-700/30';
    }
  };

  const handleAddNewSample = (e) => {
    e.preventDefault();
    const newId = `SAMP-2025-${String(mockSamples.length + 1).padStart(3, '0')}`;
    const newRecord = {
      ...newSample,
      id: newId,
      revisions: newSample.comments ? [{ date: newSample.submissionDate || new Date().toISOString().slice(0, 10), comment: `Initial submission: ${newSample.comments}` }] : []
    };
    mockSamples.unshift(newRecord); // Add to the beginning for visibility
    setNewSample({
      orderId: '', style: '', sampleType: 'Proto Sample', submissionDate: '',
      approvalDate: '', status: 'Pending Review', comments: '', revisions: []
    });
    setIsAddingNew(false);
    alert('New sample added (mock)!');
  };

  const handleUpdateSample = (e) => {
    e.preventDefault();
    // In a real app, send to backend
    const index = mockSamples.findIndex(s => s.id === selectedSample.id);
    if (index !== -1) {
      // Create a new revision entry if comments or status changed
      const updatedRevisions = [...selectedSample.revisions];
      if (selectedSample.comments !== mockSamples[index].comments || selectedSample.status !== mockSamples[index].status) {
        updatedRevisions.unshift({
          date: new Date().toISOString().slice(0, 10),
          comment: `Status: ${selectedSample.status}, Comment: ${selectedSample.comments || 'No new comment.'}`
        });
      }
      mockSamples[index] = { ...selectedSample, revisions: updatedRevisions };
    }
    setSelectedSample(null);
    alert('Sample updated (mock)!');
  };

  return (
    <div className="flex relative min-h-screen overflow-x-hidden bg-gray-900">
      {/* Main Content Area */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className={`flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out
                   ${selectedSample || isAddingNew ? 'lg:mr-[min(500px,33vw)]' : ''} w-full`}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Sample Management</h1>
            <p className="text-sm sm:text-lg text-gray-400 mt-1">Track and manage all fabric and garment sample submissions.</p>
          </div>
          <button
            onClick={() => { setSelectedSample(null); setIsAddingNew(true); }}
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 whitespace-nowrap"
          >
            <FaPlus className="w-4 h-4 mr-2" /> Add New Sample
          </button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, Order, Style, Comments..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status-filter" className="sr-only">Filter by Status</label>
            <select
              id="status-filter"
              className="w-full md:w-auto p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-teal-500 focus:border-teal-500 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              {['All', 'Approved', 'Pending Review', 'Rejected', 'Submitted'].map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Sample List Table */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200 flex items-center">
            <FaLayerGroup className="mr-2 text-indigo-400" /> All Samples ({filteredAndSortedSamples.length})
          </h3>
          {filteredAndSortedSamples.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <FaInfoCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg">No samples found matching your criteria.</p>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <table className="w-full divide-y divide-gray-700 table-fixed">
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer w-[20%]"
                      onClick={() => handleSort('id')}
                    >
                      ID {getSortIcon('id')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell w-[18%]"
                      onClick={() => handleSort('orderId')}
                    >
                      Order ID {getSortIcon('orderId')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden lg:table-cell w-[20%]"
                      onClick={() => handleSort('style')}
                    >
                      Style {getSortIcon('style')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hidden md:table-cell w-[18%]"
                      onClick={() => handleSort('sampleType')}
                    >
                      Type {getSortIcon('sampleType')}
                    </th>
                    <th
                      className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer w-[15%]"
                      onClick={() => handleSort('status')}
                    >
                      Status {getSortIcon('status')}
                    </th>
                    <th className="py-3 px-2 sm:px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-[9%]">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {filteredAndSortedSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-gray-800/80 transition-colors duration-150">
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium text-teal-300 overflow-hidden text-ellipsis whitespace-nowrap">
                        {sample.id}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden md:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {sample.orderId}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden lg:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {sample.style}
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm text-gray-300 hidden md:table-cell overflow-hidden text-ellipsis whitespace-nowrap">
                        {sample.sampleType}
                      </td>
                      <td className="py-2 px-2 sm:px-4 overflow-hidden text-ellipsis whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sample.status)}`}>
                          {sample.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-4 text-sm font-medium whitespace-nowrap">
                        <button
                          onClick={() => { setSelectedSample(sample); setIsAddingNew(false); }}
                          className="text-indigo-400 hover:text-indigo-600 mr-1 sm:mr-3 transition-colors duration-200 text-xs sm:text-sm"
                          title="View Details"
                        >
                          <FaEdit className="inline-block w-3 h-3 sm:w-4 sm:h-4" /> View/Edit
                        </button>
                        <button
                          onClick={() => alert(`Deleting sample ${sample.id}`)}
                          className="text-red-400 hover:text-red-600 transition-colors duration-200 text-xs sm:text-sm"
                          title="Delete Sample"
                        >
                          <FaTrash className="inline-block w-3 h-3 sm:w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Detail / Add New Side Panel */}
      <AnimatePresence>
        {(selectedSample || isAddingNew) && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 h-full w-full sm:w-[80vw] md:w-[min(600px,60vw)] lg:w-[min(500px,33vw)]
                       bg-gray-900 border-l border-gray-700 shadow-2xl p-6 sm:p-8 z-50 overflow-y-auto custom-scrollbar"
          >
            <button
              onClick={() => { setSelectedSample(null); setIsAddingNew(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors duration-200"
              title="Close Panel"
            >
              <FaTimes className="w-6 h-6" />
            </button>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-100 border-b border-gray-700 pb-3">
              {isAddingNew ? 'Add New Sample' : `Sample Details: ${selectedSample.id}`}
            </h2>

            {isAddingNew ? (
              // Add New Sample Form
              <form onSubmit={handleAddNewSample} className="space-y-4 text-sm">
                <div>
                  <label htmlFor="new-sample-order-id" className="block text-gray-400 mb-1">Order ID</label>
                  <input
                    type="text"
                    id="new-sample-order-id"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newSample.orderId}
                    onChange={(e) => setNewSample({ ...newSample, orderId: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-sample-style" className="block text-gray-400 mb-1">Style</label>
                  <input
                    type="text"
                    id="new-sample-style"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newSample.style}
                    onChange={(e) => setNewSample({ ...newSample, style: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-sample-type" className="block text-gray-400 mb-1">Sample Type</label>
                  <select
                    id="new-sample-type"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newSample.sampleType}
                    onChange={(e) => setNewSample({ ...newSample, sampleType: e.target.value })}
                  >
                    {['Proto Sample', 'Fit Sample', 'PP Sample', 'Salesman Sample', 'TOP Sample'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="new-submission-date" className="block text-gray-400 mb-1">Submission Date</label>
                  <input
                    type="date"
                    id="new-submission-date"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newSample.submissionDate}
                    onChange={(e) => setNewSample({ ...newSample, submissionDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="new-approval-date" className="block text-gray-400 mb-1">Approval Date (Optional)</label>
                  <input
                    type="date"
                    id="new-approval-date"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newSample.approvalDate}
                    onChange={(e) => setNewSample({ ...newSample, approvalDate: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="new-status" className="block text-gray-400 mb-1">Status</label>
                  <select
                    id="new-status"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newSample.status}
                    onChange={(e) => setNewSample({ ...newSample, status: e.target.value })}
                  >
                    {['Approved', 'Pending Review', 'Rejected', 'Submitted'].map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="new-comments" className="block text-gray-400 mb-1">Initial Comments</label>
                  <textarea
                    id="new-comments"
                    rows="3"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200"
                    value={newSample.comments}
                    onChange={(e) => setNewSample({ ...newSample, comments: e.target.value })}
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Add Sample
                  </button>
                </div>
              </form>
            ) : (
              // Sample Details View
              <div className="space-y-4 text-sm">
                <p><strong className="text-gray-400">Order ID:</strong> {selectedSample.orderId}</p>
                <p><strong className="text-gray-400">Style:</strong> {selectedSample.style}</p>
                <p><strong className="text-gray-400">Sample Type:</strong> {selectedSample.sampleType}</p>
                <p><strong className="text-gray-400">Submission Date:</strong> {selectedSample.submissionDate}</p>
                <p><strong className="text-gray-400">Approval Date:</strong> {selectedSample.approvalDate || 'N/A'}</p>
                <p>
                  <strong className="text-gray-400">Status:</strong>{' '}
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedSample.status)}`}>
                    {selectedSample.status}
                  </span>
                </p>
                <p><strong className="text-gray-400">Current Comments:</strong> {selectedSample.comments || 'N/A'}</p>

                {/* Revision History */}
                <h4 className="font-semibold text-gray-200 mb-2 mt-6 flex items-center border-b border-gray-700 pb-2">
                  <FaCommentDots className="mr-2 text-pink-400" /> Revision History
                </h4>
                {selectedSample.revisions && selectedSample.revisions.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedSample.revisions.map((rev, index) => (
                      <li key={index} className="bg-gray-800/50 p-2 rounded-md">
                        <p className="text-xs text-gray-500">{rev.date}</p>
                        <p className="text-gray-300">{rev.comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No revision history available.</p>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  {/* Mock Save Changes if editing */}
                  <button
                    onClick={() => alert('Simulating update for sample ' + selectedSample.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  >
                    Save Changes (Mock)
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SampleManagement;