// src/components/dashboard/admin/ReportModal.jsx
import React from 'react';
import { LuX, LuUser, LuBuilding, LuCalendarDays } from 'react-icons/lu';

// Function to generate demo content based on department
const generateDemoContent = (report) => {
  switch (report.department) {
    case 'Cutting':
      return (
        <>
          <p className="font-semibold text-gray-300 mb-2">Cutting Summary - {report.date}</p>
          <p>Units Cut: 500/750</p>
          <p>Fabric Lot Used: #FL987-A</p>
          <p>Issues Encountered: Minor alignment issue on marker B, corrected.</p>
          <p className="mt-3 text-xs text-gray-500">Next Step: Transfer to Production.</p>
        </>
      );
    case 'Production':
      return (
        <>
          <p className="font-semibold text-gray-300 mb-2">Production Progress - Order #G123 - {report.date}</p>
          <p>Units Stitched (Sleeves): 480/500</p>
          <p>Units Stitched (Body): 450/500</p>
          <p>Machine Downtime: Machine #3 (15 mins) - Thread break.</p>
          <p className="mt-3 text-xs text-gray-500">Next Step: Collar attachment.</p>
        </>
      );
    case 'Warehouse':
       return (
        <>
          <p className="font-semibold text-gray-300 mb-2">Warehouse Stock Check - {report.date}</p>
          <p>Fabric Lot #FL987-A: 250m remaining.</p>
          <p>Trims (Buttons Type X): 1500 units.</p>
          <p>Received Goods: Shipment #SH102 (Labels).</p>
          <p className="mt-3 text-xs text-gray-500">Action: Update inventory system.</p>
        </>
      );
     case 'Quality Control':
       return (
        <>
          <p className="font-semibold text-gray-300 mb-2">QC Report - Batch #B45 - {report.date}</p>
          <p>Units Inspected: 100</p>
          <p>Passed: 98</p>
          <p>Failed: 2 (Reason: Stitching defect - sleeve hem)</p>
          <p className="mt-3 text-xs text-gray-500">Action: Rework failed units.</p>
        </>
      );
    // Add cases for other departments...
    default:
      return <p>This is a demo report content for {report.title}. Details would include specific metrics, progress updates, issues encountered, and next steps relevant to the {report.department} department.</p>;
  }
};

const ReportModal = ({ report, onClose }) => {
  if (!report) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center p-4 transition-opacity duration-300">
      {/* Modal Content */}
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700 transform transition-all duration-300 scale-95 opacity-0 animate-modal-scale-in">
         {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">{report.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-1 transition-colors"
            aria-label="Close modal"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-sm text-gray-300">
           {/* Report Meta Info */}
           <div className="grid grid-cols-3 gap-4 text-xs text-gray-400 border-b border-gray-700 pb-3 mb-4">
             <div className="flex items-center"><LuUser className="w-3.5 h-3.5 mr-1.5 text-teal-400"/> Submitted By: {report.submittedBy}</div>
             <div className="flex items-center"><LuBuilding className="w-3.5 h-3.5 mr-1.5 text-teal-400"/> Dept: {report.department}</div>
             <div className="flex items-center"><LuCalendarDays className="w-3.5 h-3.5 mr-1.5 text-teal-400"/> Date: {report.date}</div>
           </div>

           {/* Demo Report Content */}
           <div className="prose prose-sm prose-invert max-w-none"> {/* Basic prose styling */}
             {generateDemoContent(report)}
           </div>
        </div>

         {/* Modal Footer (Optional) */}
         {/* <div className="flex justify-end p-4 border-t border-gray-700">
           <button
             onClick={onClose}
             className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm"
           >
             Close
           </button>
         </div> */}
      </div>

      {/* Add CSS for animation if not using Tailwind animation directly */}
      <style jsx global>{`
        @keyframes modal-scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-scale-in {
          animation: modal-scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ReportModal;