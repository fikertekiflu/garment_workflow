import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartBar,         // Main icon for defect analysis, Pareto chart
  FaChartLine,        // Trend charts
  FaChartPie,         // Distribution charts
  FaFilter,           // General filter
  FaCalendarAlt,      // Date filter
  FaLayerGroup,       // Style filter
  FaListOl,           // Line filter
  FaUserTag,          // Inspector filter
  FaExclamationTriangle, // Defect count icon
  FaInfoCircle        // Info icon for empty states
} from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- Mock Data (Re-using/extending concepts from QualityInspectionLog) ---
const mockInspectionsForAnalysis = [
    {
      id: 'insp-001', date: '2025-06-01', line: '2', style: 'Baby Trouser', inspector: 'Maria S.',
      inspectedUnits: 500, reworkUnits: 10, rejectedUnits: 5,
      defects: [
        { type: 'Stitching Error', count: 8 }, { type: 'Fabric Snag', count: 5 }, { type: 'Button Missing', count: 2 },
      ]
    },
    {
      id: 'insp-002', date: '2025-06-01', line: '3', style: 'Kids Shirt', inspector: 'John D.',
      inspectedUnits: 400, reworkUnits: 8, rejectedUnits: 2,
      defects: [
        { type: 'Print Misalignment', count: 6 }, { type: 'Loose / Permanent thread', count: 4 },
      ]
    },
    {
      id: 'insp-003', date: '2025-06-02', line: '1', style: 'Mens Polo', inspector: 'David L.',
      inspectedUnits: 600, reworkUnits: 10, rejectedUnits: 10,
      defects: [
        { type: 'Incorrect Measurement', count: 12 }, { type: 'Stitching Error', count: 8 },
      ]
    },
    {
      id: 'insp-004', date: '2025-06-02', line: '2', style: 'Baby Trouser', inspector: 'Maria S.',
      inspectedUnits: 450, reworkUnits: 5, rejectedUnits: 5,
      defects: [
        { type: 'Fabric Snag', count: 7 }, { type: 'Stitching Error', count: 3 },
      ]
    },
    {
      id: 'insp-005', date: '2025-06-03', line: '1', style: 'Mens Polo', inspector: 'David L.',
      inspectedUnits: 550, reworkUnits: 15, rejectedUnits: 5,
      defects: [
        { type: 'Needle Mark', count: 8 }, { type: 'Oil mark', count: 4 }, { type: 'Stitching Error', count: 8 },
      ]
    },
    {
      id: 'insp-006', date: '2025-06-03', line: '3', style: 'Kids Shirt', inspector: 'John D.',
      inspectedUnits: 480, reworkUnits: 10, rejectedUnits: 0,
      defects: [
        { type: 'Holes/runs', count: 5 }, { type: 'Incorrect label', count: 5 },
      ]
    },
];


const QualityDefectAnalysis = () => {
  const [inspections, setInspections] = useState(mockInspectionsForAnalysis);
  const [filterStartDate, setFilterStartDate] = useState('2025-06-01');
  const [filterEndDate, setFilterEndDate] = useState('2025-06-03');
  const [filterLine, setFilterLine] = useState('');
  const [filterStyle, setFilterStyle] = useState('');

  const getUnique = (key) => [...new Set(mockInspectionsForAnalysis.map(item => item[key]))];
  const uniqueDates = getUnique('date').sort();
  const uniqueLines = getUnique('line').sort();
  const uniqueStyles = getUnique('style').sort();


  const filteredInspections = useMemo(() => {
    return inspections.filter(insp => {
      const dateMatch = insp.date >= filterStartDate && insp.date <= filterEndDate;
      const lineMatch = !filterLine || insp.line === filterLine;
      const styleMatch = !filterStyle || insp.style === filterStyle;
      return dateMatch && lineMatch && styleMatch;
    });
  }, [inspections, filterStartDate, filterEndDate, filterLine, filterStyle]);

  // --- Aggregated Defect Data for Charts ---
  const aggregatedDefects = useMemo(() => {
    const defectCounts = {};
    let totalDefects = 0;
    let totalInspected = 0;

    filteredInspections.forEach(insp => {
      totalInspected += insp.inspectedUnits;
      insp.defects.forEach(d => {
        defectCounts[d.type] = (defectCounts[d.type] || 0) + d.count;
        totalDefects += d.count;
      });
      totalDefects += (insp.reworkUnits || 0) + (insp.rejectedUnits || 0); // Include rework/rejected units as "defects" for overall count
    });

    // Convert to array and sort for Pareto
    const sortedDefects = Object.entries(defectCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count); // Descending order of count

    let cumulativeCount = 0;
    const defectsWithCumulative = sortedDefects.map(d => {
      cumulativeCount += d.count;
      return {
        ...d,
        cumulativeCount,
        cumulativePercentage: totalDefects > 0 ? ((cumulativeCount / totalDefects) * 100).toFixed(1) : '0.0',
      };
    });

    return { totalDefects, totalInspected, defectsWithCumulative };
  }, [filteredInspections]);

  const { totalDefects, totalInspected, defectsWithCumulative } = aggregatedDefects;
  const overallDefectRate = totalInspected > 0 ? ((totalDefects / totalInspected) * 100).toFixed(1) : '0.0';


  // --- Chart Data Preparation ---

  // 1. Pareto Chart of Defect Types
  const paretoLabels = defectsWithCumulative.map(d => d.type);
  const paretoCounts = defectsWithCumulative.map(d => d.count);
  const paretoCumulativePercentages = defectsWithCumulative.map(d => parseFloat(d.cumulativePercentage));

  const paretoChartData = {
    labels: paretoLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Defect Count',
        data: paretoCounts,
        backgroundColor: 'rgba(0, 178, 178, 0.8)', // Teal
        borderColor: 'rgba(0, 178, 178, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Cumulative %',
        data: paretoCumulativePercentages,
        borderColor: 'rgb(255, 99, 132)', // Red for cumulative line
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        yAxisID: 'y1',
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  const paretoChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#e2e8f0' },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += context.parsed.y.toLocaleString() + (context.dataset.type === 'line' ? '%' : '');
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Defect Count', color: '#e2e8f0' },
        ticks: { color: '#94a3b8', beginAtZero: true },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Cumulative %', color: '#e2e8f0' },
        min: 0,
        max: 100,
        ticks: { color: '#94a3b8', callback: function(value) { return value + '%'; } },
        grid: { drawOnChartArea: false } // Only draw grid for primary y-axis
      },
    },
  };


  // 2. Defect Trend Over Time (Line Chart)
  const defectTrendData = useMemo(() => {
    const dailyDefects = {};
    const dailyInspected = {};

    filteredInspections.forEach(insp => {
      dailyDefects[insp.date] = (dailyDefects[insp.date] || 0) +
        insp.defects.reduce((sum, d) => sum + d.count, 0) +
        (insp.reworkUnits || 0) + (insp.rejectedUnits || 0);
      dailyInspected[insp.date] = (dailyInspected[insp.date] || 0) + insp.inspectedUnits;
    });

    const dates = Object.keys(dailyDefects).sort();
    const defectRates = dates.map(date => {
      const totalDef = dailyDefects[date];
      const totalInsp = dailyInspected[date];
      return totalInsp > 0 ? ((totalDef / totalInsp) * 100).toFixed(1) : 0;
    });

    return { dates, defectRates };
  }, [filteredInspections]);


  const defectTrendChartData = {
    labels: defectTrendData.dates,
    datasets: [
      {
        label: 'Daily Defect Rate (%)',
        data: defectTrendData.defectRates,
        borderColor: 'rgb(255, 99, 132)', // Red
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const defectTrendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e2e8f0' } },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(1) + '%';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        beginAtZero: true,
        max: 10, // Assuming defect rates usually below 10% for visualization
        title: {
          display: true,
          text: 'Defect Rate (%)',
          color: '#e2e8f0'
        }
      },
    },
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
          <h1 className="text-3xl font-semibold tracking-tight">Defect Analysis</h1>
          <p className="text-lg text-gray-400 mt-1">Identify key defect patterns and trends for continuous improvement.</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center gap-2 w-full">
          <FaCalendarAlt className="text-gray-400" />
          <label htmlFor="filter-start-date" className="sr-only">Start Date</label>
          <input
            type="date"
            id="filter-start-date"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full">
          <FaCalendarAlt className="text-gray-400" />
          <label htmlFor="filter-end-date" className="sr-only">End Date</label>
          <input
            type="date"
            id="filter-end-date"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
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
      </motion.div>

      {/* Summary KPIs */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaExclamationTriangle className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-sm text-gray-400">Total Defects (Selected Period)</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{totalDefects.toLocaleString()}</h2>
        </div>
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaChartLine className="w-8 h-8 text-orange-400 mb-3" />
          <p className="text-sm text-gray-400">Overall Defect Rate</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{overallDefectRate}%</h2>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pareto Chart of Defect Types */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartBar className="mr-2" /> Pareto Chart: Top Defect Types</h3>
          <div className="h-96">
            {paretoLabels.length > 0 ? (
              <Bar data={paretoChartData} options={paretoChartOptions} />
            ) : (
              <div className="text-center text-gray-500 flex items-center justify-center h-full">No defect data for Pareto analysis.</div>
            )}
          </div>
        </motion.div>

        {/* Defect Trend Over Time Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartLine className="mr-2" /> Defect Rate Trend</h3>
          <div className="h-96">
            {defectTrendData.dates.length > 0 ? (
              <Line data={defectTrendChartData} options={defectTrendChartOptions} />
            ) : (
              <div className="text-center text-gray-500 flex items-center justify-center h-full">No defect trend data for selected period.</div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Example: Defect Distribution by Line (Bar Chart - Placeholder) */}
      {/* <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartPie className="mr-2" /> Defect Distribution by Line (Placeholder)</h3>
        <div className="h-80 flex items-center justify-center text-gray-500">
          <p>This area can show defect distribution by production line or style, or other relevant breakdowns.</p>
        </div>
      </motion.div> */}
    </motion.div>
  );
};

export default QualityDefectAnalysis;