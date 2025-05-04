import React, { useState } from 'react';
import { LuFileCheck, LuMessageSquare, LuFilter } from 'react-icons/lu';
// 1. Import the modal component
import ReportModal from './ReportModal';

// Mock Report Data
const reports = [
  { id: 'R101', title: 'Daily Cutting Summary - May 3', submittedBy: 'Samuel G.', department: 'Cutting', date: '2025-05-03', status: 'Reviewed', comments: 1 },
  { id: 'R102', title: 'Production Progress - Order #G123', submittedBy: 'Hana L.', department: 'Production', date: '2025-05-03', status: 'New', comments: 0 },
  { id: 'R103', title: 'Warehouse Stock Check', submittedBy: 'Yosef T.', department: 'Warehouse', date: '2025-05-02', status: 'Commented', comments: 3 },
  { id: 'R104', title: 'QC Report - Batch #B45', submittedBy: 'Dawit M.', department: 'Quality Control', date: '2025-05-03', status: 'New', comments: 0 },
  { id: 'R105', title: 'Packaging Complete - Order #G122', submittedBy: 'Liya A.', department: 'Packaging', date: '2025-05-02', status: 'Reviewed', comments: 0 },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'New': return 'bg-blue-900/60 text-blue-300';
    case 'Reviewed': return 'bg-green-900/60 text-green-300';
    case 'Commented': return 'bg-purple-900/60 text-purple-300';
    default: return 'bg-gray-700 text-gray-300';
  }
};

const AdminReports = () => {
  // State for managing comments
  const [showComments, setShowComments] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  // 2. State for managing the report view modal
  const [selectedReportForView, setSelectedReportForView] = useState(null); // Holds the report object or null

  // Updated handler to open the modal
  const handleViewReport = (reportId) => {
    const reportToShow = reports.find(r => r.id === reportId);
    setSelectedReportForView(reportToShow); // Set the report object to show in modal
  };

  // Handler to close the modal
  const handleCloseModal = () => {
    setSelectedReportForView(null);
  };

  // Comment handlers remain the same
  const handleToggleComments = (reportId) => {
    setShowComments(showComments === reportId ? null : reportId);
    setCommentInput('');
  };
  const handleAddComment = (reportId) => {
    if (!commentInput.trim()) return;
    alert(`Adding comment "${commentInput}" to Report ID ${reportId}. (Mock action)`);
    setCommentInput('');
  };

  return (
    <> {/* Use Fragment to wrap component and modal */}
      <div className="space-y-6 text-white">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold tracking-tight">All Department Reports</h1>
          <button className="flex items-center bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-3 rounded-lg transition duration-200 text-sm">
            <LuFilter className="w-4 h-4 mr-2" /> Filter Reports
          </button>
        </div>

        {/* Reports List/Table */}
        <div className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-700/50 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3">Report ID</th>
                <th scope="col" className="px-6 py-3">Title</th>
                <th scope="col" className="px-6 py-3">Department</th>
                <th scope="col" className="px-6 py-3">Submitted By</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {reports.map((report) => (
                <React.Fragment key={report.id}>
                  <tr className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-400">{report.id}</td>
                    <td className="px-6 py-4 text-gray-200">{report.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{report.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{report.submittedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      {/* Call updated handleViewReport */}
                      <button onClick={() => handleViewReport(report.id)} className="text-blue-400 hover:text-blue-300" title="View Full Report">
                        <LuFileCheck className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleToggleComments(report.id)} className="text-purple-400 hover:text-purple-300 relative" title="View/Add Comments">
                        <LuMessageSquare className="w-4 h-4" />
                        {report.comments > 0 && (
                           <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 text-[8px] text-white items-center justify-center">{report.comments}</span>
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                  {/* Comment Section (Conditionally Rendered) */}
                  {showComments === report.id && (
                    <tr className="bg-gray-700/20">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase">Comments for {report.id}</h4>
                          <div className="text-xs text-gray-300 space-y-2 max-h-20 overflow-y-auto pr-2">
                            {report.comments === 0 && <p className="italic text-gray-500">No comments yet.</p>}
                            {report.comments > 0 && <p>Admin: Please double-check fabric lot #. (Mock)</p>}
                            {report.comments > 1 && <p>Merchandiser: Approved. (Mock)</p>}
                          </div>
                          <div className="flex space-x-2 pt-2 border-t border-gray-600/50">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              className="flex-grow bg-gray-700 border border-gray-600 rounded-md px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                            <button
                              onClick={() => handleAddComment(report.id)}
                              className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-md text-xs font-medium transition duration-200"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Conditionally render the modal */}
      <ReportModal report={selectedReportForView} onClose={handleCloseModal} />
    </>
  );
};

export default AdminReports;
