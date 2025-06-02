import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FaFileAlt,          // Main icon for reports
  FaPrint,            // Print button
  FaDownload,         // Download button
  FaChartLine,        // Chart icon
  FaClipboardCheck,   // Inspection icon
  FaInfoCircle,       // Info for empty states
  FaExclamationTriangle, // Defect icon
  FaCalendarAlt       // Date filter
} from 'react-icons/fa';

// --- Mock Data (Aggregated from previous components) ---
const allMockInspections = [
  { id: 'insp-jun-001', date: '2025-06-01', line: '2', style: 'Baby Trouser', inspectedUnits: 500, reworkUnits: 10, rejectedUnits: 5, defects: [{ type: 'Stitching Error', count: 8 }, { type: 'Fabric Snag', count: 5 }] },
  { id: 'insp-jun-002', date: '2025-06-01', line: '3', style: 'Kids Shirt', inspectedUnits: 400, reworkUnits: 8, rejectedUnits: 2, defects: [{ type: 'Print Misalignment', count: 6 }, { type: 'Loose Thread', count: 4 }] },
  { id: 'insp-jun-003', date: '2025-06-02', line: '1', style: 'Mens Polo', inspectedUnits: 600, reworkUnits: 10, rejectedUnits: 10, defects: [{ type: 'Incorrect Measurement', count: 12 }, { type: 'Stitching Error', count: 8 }] },
  { id: 'insp-jun-004', date: '2025-06-02', line: '2', style: 'Baby Trouser', inspectedUnits: 450, reworkUnits: 5, rejectedUnits: 5, defects: [{ type: 'Fabric Snag', count: 7 }, { type: 'Stitching Error', count: 3 }] },
  { id: 'insp-jun-005', date: '2025-06-03', line: '1', style: 'Mens Polo', inspectedUnits: 550, reworkUnits: 15, rejectedUnits: 5, defects: [{ type: 'Needle Mark', count: 8 }, { type: 'Oil mark', count: 4 }] },
  { id: 'insp-jun-006', date: '2025-06-03', line: '3', style: 'Kids Shirt', inspectedUnits: 480, reworkUnits: 10, rejectedUnits: 0, defects: [{ type: 'Holes/runs', count: 5 }, { type: 'Incorrect label', count: 5 }] },
  { id: 'insp-jun-007', date: '2025-06-04', line: '2', style: 'Baby Trouser', inspectedUnits: 520, reworkUnits: 12, rejectedUnits: 8, defects: [{ type: 'Stitching Error', count: 10 }] },
  { id: 'insp-jun-008', date: '2025-06-04', line: '1', style: 'Mens Polo', inspectedUnits: 580, reworkUnits: 7, rejectedUnits: 3, defects: [{ type: 'Incorrect Measurement', count: 5 }] },
];

const QualityReports = () => {
  const [reportType, setReportType] = useState('summary');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-04');

  const filteredInspections = useMemo(() => {
    return allMockInspections.filter(insp =>
      insp.date >= startDate && insp.date <= endDate
    );
  }, [startDate, endDate]);

  const reportData = useMemo(() => {
    let totalInspectedUnits = 0;
    let totalPassedUnits = 0;
    let totalReworkUnits = 0;
    let totalRejectedUnits = 0;
    let totalDefectsCounted = 0;
    const defectTypeBreakdown = {};
    const dailyInspections = {};

    filteredInspections.forEach(insp => {
      totalInspectedUnits += insp.inspectedUnits;
      totalReworkUnits += insp.reworkUnits || 0;
      totalRejectedUnits += insp.rejectedUnits || 0;

      const inspDefectsTotal = insp.defects.reduce((sum, d) => sum + d.count, 0);
      totalDefectsCounted += inspDefectsTotal;

      const derivedPassed = insp.inspectedUnits - (insp.reworkUnits || 0) - (insp.rejectedUnits || 0) - inspDefectsTotal;
      totalPassedUnits += derivedPassed > 0 ? derivedPassed : 0;

      insp.defects.forEach(d => {
        defectTypeBreakdown[d.type] = (defectTypeBreakdown[d.type] || 0) + d.count;
      });

      if (!dailyInspections[insp.date]) {
        dailyInspections[insp.date] = { count: 0, units: 0 };
      }
      dailyInspections[insp.date].count += 1;
      dailyInspections[insp.date].units += insp.inspectedUnits;
    });

    const totalAllDefects = totalDefectsCounted + totalReworkUnits + totalRejectedUnits;
    const overallDefectRate = totalInspectedUnits > 0
      ? ((totalAllDefects / totalInspectedUnits) * 100).toFixed(2)
      : '0.00';
    const overallPassedRate = totalInspectedUnits > 0
      ? ((totalPassedUnits / totalInspectedUnits) * 100).toFixed(2)
      : '0.00';

    const topDefects = Object.entries(defectTypeBreakdown)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const dailyTrendData = Object.keys(dailyInspections).sort().map(date => ({
      date,
      inspections: dailyInspections[date].count,
      units: dailyInspections[date].units,
    }));

    return {
      totalInspectedUnits,
      totalPassedUnits,
      totalReworkUnits,
      totalRejectedUnits,
      totalAllDefects,
      overallDefectRate,
      overallPassedRate,
      topDefects,
      dailyTrendData,
      filteredInspections,
    };
  }, [filteredInspections]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Simulating download of ' + reportType + ' report as PDF/CSV.');
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Quality Reports</h1>
          <p className="text-lg text-gray-400 mt-1">Generate and view comprehensive quality performance reports.</p>
        </div>
        <div className="flex gap-3">
          <button
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md"
            onClick={handlePrint}
          >
            <FaPrint className="w-4 h-4 mr-2" /> Print Report
          </button>
          <button
            className="flex items-center bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200 text-sm shadow-md"
            onClick={handleDownload}
          >
            <FaDownload className="w-4 h-4 mr-2" /> Download
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="report-type" className="block text-sm font-medium text-gray-300 mb-1">Report Type</label>
          <select
            id="report-type"
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="summary">Quality Summary Report</option>
            <option value="defect-breakdown">Defect Breakdown Report</option>
            <option value="inspection-volume">Inspection Volume Report</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400" />
          <input
            type="date"
            id="start-date"
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-400" />
          <input
            type="date"
            id="end-date"
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 min-h-[500px]">
        {filteredInspections.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <FaInfoCircle className="w-16 h-16 mx-auto mb-4" />
            <p className="text-xl font-medium">No data found for the selected date range and filters.</p>
          </div>
        ) : (
          <div>
            {reportType === 'summary' && (
              <>
                <h3 className="text-2xl font-semibold mb-6 text-gray-100 border-b border-gray-700 pb-3">Quality Summary Report</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">Total Inspected Units</p>
                    <p className="text-2xl font-bold text-teal-400">{reportData.totalInspectedUnits.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">Overall Defect Rate</p>
                    <p className="text-2xl font-bold text-red-400">{reportData.overallDefectRate}%</p>
                  </div>
                  <div className="bg-gray-900 p-5 rounded-lg shadow-md border border-gray-700">
                    <p className="text-sm text-gray-400 mb-1">Overall Passed Rate</p>
                    <p className="text-2xl font-bold text-green-400">{reportData.overallPassedRate}%</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default QualityReports;