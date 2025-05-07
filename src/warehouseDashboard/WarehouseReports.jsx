import React, { useState, useMemo } from 'react';
// Using common icons, hoping to avoid Vite cache issues.
// User should clear .vite cache if errors persist.
import {
  LuFileText, // Replaced LuFileCheck for "View Full Report" icon
  LuMessageSquare,
  LuFilter,
  LuSearch,
  LuUser, // Replaced LuUserCircle
  LuCalendarDays,
  LuBuilding,
  LuChevronDown, // For expand/collapse
  LuSend // For send comment button
} from 'react-icons/lu';
// Assuming ReportModal is in a shared location or adjust path
import ReportModal from '../AdminDashboard/ReportModal'; // Adjust path if ReportModal is elsewhere

// Mock Report Data (Warehouse sees reports from all departments)
const allDepartmentReports = [
  { id: 'R101', title: 'Daily Cutting Summary - May 3', submittedBy: 'Samuel G.', department: 'Cutting', date: '2025-05-03', status: 'Reviewed', commentsCount: 1, snippet: "500 units cut, Fabric Lot #FL987-A used. Minor delays due to machine maintenance, but back on track." },
  { id: 'R102', title: 'Production Progress - Order #G123', submittedBy: 'Hana L.', department: 'Production', date: '2025-05-03', status: 'New', commentsCount: 0, snippet: "Stitching for sleeves at 90% completion. Collars to start next. No major blockers reported." },
  { id: 'R103', title: 'Warehouse Stock Check - Fabrics', submittedBy: 'Yosef T.', department: 'Warehouse', date: '2025-05-02', status: 'Commented', commentsCount: 3, snippet: "Physical count matches system for Section A (Denims). Section B (Cottons) count scheduled for tomorrow." },
  { id: 'R104', title: 'QC Report - Batch #B45 Inline Inspection', submittedBy: 'Dawit M.', department: 'Quality Control', date: '2025-05-03', status: 'New', commentsCount: 0, snippet: "Initial inspection passed for 98/100 units. 2 minor stitching defects noted on sleeves, flagged for rework." },
  { id: 'R105', title: 'Packaging Complete - Order #G122', submittedBy: 'Liya A.', department: 'Packaging', date: '2025-05-02', status: 'Reviewed', commentsCount: 0, snippet: "Order #G122 (150 units) fully packed, labeled, and ready for dispatch. Awaiting pickup confirmation." },
  { id: 'R106', title: 'Merchandising Update - Fabric Sourcing for Fall Collection', submittedBy: 'Bereket B.', department: 'Merchandising', date: '2025-05-04', status: 'New', commentsCount: 0, snippet: "New sustainable fabric supplier for cotton variants confirmed. Samples expected by EOW." },
];

// Helper for status pills
const getReportStatusPill = (status) => {
  let bgColor = 'bg-gray-500/20';
  let textColor = 'text-gray-300';
  let borderColor = 'border-gray-500/30';

  switch (status) {
    case 'New':
      bgColor = 'bg-blue-500/20'; textColor = 'text-blue-300'; borderColor = 'border-blue-500/30';
      break;
    case 'Reviewed':
      bgColor = 'bg-green-500/20'; textColor = 'text-green-300'; borderColor = 'border-green-500/30';
      break;
    case 'Commented':
      bgColor = 'bg-purple-500/20'; textColor = 'text-purple-300'; borderColor = 'border-purple-500/30';
      break;
  }
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor} ${borderColor}`}>{status}</span>;
};

// Department color mapping for timeline dot
const departmentColors = {
    'Cutting': 'bg-red-500',
    'Production': 'bg-sky-500',
    'Warehouse': 'bg-indigo-500',
    'Quality Control': 'bg-emerald-500',
    'Packaging': 'bg-rose-500',
    'Merchandising': 'bg-amber-500',
    'Default': 'bg-gray-500',
};

// --- Component Start ---
const WarehouseReports = () => {
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [selectedReportForView, setSelectedReportForView] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const handleViewReportModal = (reportId) => {
    const reportToShow = allDepartmentReports.find(r => r.id === reportId);
    setSelectedReportForView(reportToShow);
  };
  const handleCloseModal = () => setSelectedReportForView(null);

  const handleToggleComments = (reportId) => {
    setShowCommentsFor(showCommentsFor === reportId ? null : reportId);
    setCommentInput('');
  };

  const handleAddComment = (reportId) => {
    if (!commentInput.trim()) return;
    alert(`Warehouse Comment: "${commentInput}" for Report ID ${reportId}. (Mock action)`);
    setCommentInput('');
  };

  const departments = useMemo(() => ['All', ...new Set(allDepartmentReports.map(r => r.department))], []);

  const filteredReports = useMemo(() => {
    return allDepartmentReports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            report.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === 'All' || report.department === departmentFilter;
      return matchesSearch && matchesDepartment;
    });
  }, [allDepartmentReports, searchTerm, departmentFilter]);


  return (
    <>
      <div className="space-y-8 text-white font-sans"> {/* Increased main spacing */}
        {/* Header and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-semibold tracking-tight flex items-center">
            <LuFileText className="mr-3 text-purple-400" /> All Department Reports
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-800/40 rounded-lg border border-gray-700/50 mb-8">
            <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search reports by ID, Title, Submitter..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2.5 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
            </div>
            <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-md py-2.5 px-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 appearance-none"
            >
                {departments.map(dept => <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>)}
            </select>
        </div>


        {/* Reports Timeline/List View */}
        {filteredReports.length > 0 ? (
            <div className="space-y-6">
            {filteredReports.map((report, index) => (
                <div key={report.id} className="relative pl-10 pb-6 border-l-2 border-gray-700/70 last:border-l-transparent last:pb-0"> {/* Timeline line */}
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${departmentColors[report.department] || departmentColors.Default} border-2 border-gray-900`}></div>

                    <div className="ml-4 bg-gray-800/60 backdrop-blur-sm rounded-lg shadow-md border border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-purple-500/10">
                        <div className="p-5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                <h3 className="text-base font-semibold text-gray-100 mb-1 sm:mb-0" title={report.title}>
                                    {report.title}
                                </h3>
                                {getReportStatusPill(report.status)}
                            </div>
                            <div className="flex flex-wrap items-center text-xs text-gray-400 gap-x-3 gap-y-1 mb-3">
                                <span className="font-mono">ID: {report.id}</span>
                                <span className="flex items-center"><LuBuilding className="w-3 h-3 mr-1 text-gray-500"/>{report.department}</span>
                                <span className="flex items-center"><LuUser className="w-3 h-3 mr-1 text-gray-500"/>{report.submittedBy}</span>
                                <span className="flex items-center"><LuCalendarDays className="w-3 h-3 mr-1 text-gray-500"/>{report.date}</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-4 leading-relaxed">{report.snippet}</p>

                            <div className="flex justify-end items-center space-x-3">
                                <button onClick={() => handleToggleComments(report.id)} className="flex items-center text-xs text-purple-400 hover:text-purple-300 font-medium group" title="View/Add Comments">
                                    <LuMessageSquare className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" /> Comments ({report.commentsCount})
                                    <LuChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${showCommentsFor === report.id ? 'rotate-180' : ''}`} />
                                </button>
                                <button onClick={() => handleViewReportModal(report.id)} className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center group" title="View Full Report">
                                    <LuFileText className="w-4 h-4 mr-1.5 group-hover:scale-110 transition-transform" /> View Full
                                </button>
                            </div>
                        </div>

                        {/* Comment Section (Conditionally Rendered with Transition) */}
                        {showCommentsFor === report.id && (
                            <div className="bg-gray-700/30 px-5 py-4 border-t border-gray-700/50">
                                <h4 className="text-xs font-semibold text-gray-300 uppercase mb-2">Comments</h4>
                                <div className="text-xs text-gray-200 space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar mb-3">
                                    {report.commentsCount === 0 && <p className="italic text-gray-500">No comments yet.</p>}
                                    {report.id === 'R101' && <p><strong className="text-teal-400">Admin:</strong> Please double-check fabric lot #. (Mock)</p>}
                                    {report.id === 'R103' && <>
                                        <p><strong className="text-teal-400">Admin:</strong> Is this the final count for Blue Fabric? (Mock)</p>
                                        <p><strong className="text-sky-400">Merchandiser:</strong> Yes, confirmed. (Mock)</p>
                                    </>}
                                    {/* Add more mock comments based on report.id or fetch dynamically */}
                                </div>
                                <div className="flex space-x-2 pt-2">
                                    <input
                                    type="text"
                                    placeholder="Add your comment..."
                                    value={commentInput}
                                    onChange={(e) => setCommentInput(e.target.value)}
                                    className="flex-grow bg-gray-600 border border-gray-500 rounded-md px-3 py-1.5 text-xs text-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500 placeholder-gray-400"
                                    />
                                    <button
                                    onClick={() => handleAddComment(report.id)}
                                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 rounded-md text-xs font-medium transition duration-200 flex items-center"
                                    >
                                      <LuSend className="w-3.5 h-3.5 mr-1.5"/> Send
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-16 px-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <LuSearch className="w-16 h-16 mx-auto text-gray-500 mb-5" />
                <p className="text-gray-300 text-xl">No reports match your filters.</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
            </div>
        )}
      </div>
      <ReportModal report={selectedReportForView} onClose={handleCloseModal} />
      <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
        `}</style>
    </>
  );
};

export default WarehouseReports;
