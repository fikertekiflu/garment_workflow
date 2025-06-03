// src/PackagingDashboard/PackagingQC.jsx

import React from 'react';
import { motion } from 'framer-motion';
import {
  LuClipboardCheck,  // Main icon for QC
  LuListChecks,      // Total checks icon
  LuCheck,           // Changed from LuCheckSquare to LuCheck (for passed summary)
  LuX,               // Changed from LuXSquare to LuX (for failed summary)
  LuHourglass,       // Pending checks icon
  LuFileText,        // Icon for recent reports list
  // LuCheck,           // Already imported above
  // LuX,               // Already imported above
  LuSearch,          // Icon for details action
  LuBell             // Re-inspect action icon
} from 'react-icons/lu';

// --- Mock Data for Packaging QC Checks ---
const mockQCChecks = [
  {
    id: 'QC001',
    orderId: 'ORD78901',
    packageId: 'PKG1001',
    style: 'Classic Polo Shirt',
    inspectionDate: '2025-06-02',
    result: 'Passed',
    issuesFound: [],
    inspector: 'Alice Johnson',
  },
  {
    id: 'QC002',
    orderId: 'ORD78902',
    packageId: 'PKG1002',
    style: 'Denim Jeans',
    inspectionDate: '2025-06-01',
    result: 'Failed',
    issuesFound: ['Loose stitching', 'Incorrect polybag size'],
    inspector: 'Bob Williams',
  },
  {
    id: 'QC003',
    orderId: 'ORD78903',
    packageId: 'PKG1003',
    style: 'Summer Dress',
    inspectionDate: '2025-06-03',
    result: 'Pending',
    issuesFound: [],
    inspector: 'Charlie Brown',
  },
  {
    id: 'QC004',
    orderId: 'ORD78904',
    packageId: 'PKG1004',
    style: 'Hoodie (Unisex)',
    inspectionDate: '2025-06-02',
    result: 'Passed',
    issuesFound: [],
    inspector: 'Alice Johnson',
  },
  {
    id: 'QC005',
    orderId: 'ORD78905',
    packageId: 'PKG1005',
    style: 'Kid\'s T-Shirt',
    inspectionDate: '2025-06-03',
    result: 'Failed',
    issuesFound: ['Label misprint', 'Wrong size sticker'],
    inspector: 'Bob Williams',
  },
  {
    id: 'QC006',
    orderId: 'ORD78906',
    packageId: 'PKG1006',
    style: 'Sports Bra',
    inspectionDate: '2025-06-03',
    result: 'Passed',
    issuesFound: [],
    inspector: 'Alice Johnson',
  },
];

const PackagingQC = () => {
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // --- Calculate Summary Stats ---
  const totalChecks = mockQCChecks.length;
  const passedChecks = mockQCChecks.filter(qc => qc.result === 'Passed').length;
  const failedChecks = mockQCChecks.filter(qc => qc.result === 'Failed').length;
  const pendingChecks = mockQCChecks.filter(qc => qc.result === 'Pending').length;

  // --- Helper to get result status color ---
  const getResultColor = (result) => {
    switch (result) {
      case 'Passed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-grow space-y-8 text-white font-sans p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <motion.div variants={pageVariants} initial="hidden" animate="visible">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center">
          <LuClipboardCheck className="mr-3 text-cyan-400" /> Packaging Quality Control
        </h1>
        <p className="text-sm sm:text-lg text-gray-400 mt-1">
          Monitor the quality inspection results of packaged goods.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total QC Checks */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuListChecks className="text-blue-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{totalChecks}</p>
          <p className="text-sm text-gray-400">Total QC Checks</p>
        </div>
        {/* Card 2: QC Checks Passed */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          {/* Using LuCheck for broader compatibility */}
          <LuCheck className="text-green-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{passedChecks}</p>
          <p className="text-sm text-gray-400">QC Checks Passed</p>
        </div>
        {/* Card 3: QC Checks Failed */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          {/* Using LuX for broader compatibility */}
          <LuX className="text-red-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{failedChecks}</p>
          <p className="text-sm text-gray-400">QC Checks Failed</p>
        </div>
        {/* Card 4: Pending QC Checks */}
        <div className="bg-gray-800/70 p-5 rounded-xl shadow-xl border border-gray-700/60 flex flex-col items-center justify-center text-center">
          <LuHourglass className="text-yellow-400 text-3xl mb-3" />
          <p className="text-lg font-bold">{pendingChecks}</p>
          <p className="text-sm text-gray-400">Pending QC Checks</p>
        </div>
      </motion.div>

      {/* QC Check List Table */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-4 sm:p-6 rounded-xl shadow-xl border border-gray-700/60">
        <h3 className="text-xl font-semibold mb-6 text-gray-200 flex items-center">
          <LuFileText className="mr-2 text-sky-400" /> Recent QC Reports
        </h3>
        <div className="w-full overflow-x-auto"> {/* Added overflow-x-auto for small screens */}
          <table className="min-w-full divide-y divide-gray-700 table-auto">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  QC ID
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Order ID
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Style
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Result
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                  Issues Found
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Inspector
                </th>
                <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {mockQCChecks.map(qc => (
                <tr key={qc.id} className="hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300">{qc.id}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">{qc.orderId}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">{qc.style}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden sm:table-cell">{qc.inspectionDate}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getResultColor(qc.result)}`}>
                      {qc.result}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-300 hidden lg:table-cell max-w-xs overflow-hidden text-ellipsis">
                    {qc.issuesFound && qc.issuesFound.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-gray-300 space-y-0.5">
                        {qc.issuesFound.map((issue, idx) => (
                          <li key={idx} className="truncate">{issue}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">None</span>
                    )}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-300 hidden md:table-cell">{qc.inspector}</td>
                  <td className="px-2 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button
                      onClick={() => alert(`Viewing details for QC: ${qc.id}`)}
                      className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 rounded-md mr-1 transition-colors duration-200"
                    >
                      <LuSearch className="inline-block mr-1 w-3 h-3" /> Details
                    </button>
                    {qc.result === 'Failed' && (
                      <button
                        onClick={() => alert(`Initiating re-inspection for QC: ${qc.id}`)}
                        className="text-orange-500 hover:text-orange-700 text-xs px-2 py-1 rounded-md transition-colors duration-200"
                      >
                        <LuBell className="inline-block mr-1 w-3 h-3" /> Re-inspect
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default PackagingQC;