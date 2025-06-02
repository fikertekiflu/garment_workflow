import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,      // Main icon for reports
  FaChartBar,       // Bar chart icon
  FaChartPie,       // Pie/Doughnut chart icon
  FaFilter,         // Filter icon
  FaCalendarAlt,    // Date filter
  FaLayerGroup,     // Style filter
  FaListOl,         // Line filter
  FaDollarSign,     // Cost related reports (if applicable)
  FaCogs,           // Utilization/Efficiency
  FaTag,            // Orders/Styles
  FaCheckCircle,    // <--- ADD THIS LINE (for Overall Quality Rate KPI)
  FaHourglassHalf,  // <--- ADD THIS LINE (for Total Downtime KPI)
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

// --- Extended Mock Data for Reports (Aggregated from DailyLog & QC concepts) ---
const mockProductionData = [
  // Daily production and quality summary for various lines/styles
  { date: '2025-05-27', line: '1', style: 'Mens Polo', output: 450, target: 480, defects: 15, rework: 5, downtimeMinutes: 30 },
  { date: '2025-05-27', line: '2', style: 'Baby Trouser', output: 780, target: 800, defects: 25, rework: 10, downtimeMinutes: 45 },
  { date: '2025-05-27', line: '3', style: 'Kids Shirt', output: 580, target: 600, defects: 10, rework: 3, downtimeMinutes: 20 },

  { date: '2025-05-28', line: '1', style: 'Mens Polo', output: 460, target: 480, defects: 10, rework: 3, downtimeMinutes: 25 },
  { date: '2025-05-28', line: '2', style: 'Baby Trouser', output: 750, target: 800, defects: 30, rework: 12, downtimeMinutes: 60 },
  { date: '2025-05-28', line: '3', style: 'Kids Shirt', output: 590, target: 600, defects: 8, rework: 2, downtimeMinutes: 15 },

  { date: '2025-05-29', line: '1', style: 'Mens Polo', output: 470, target: 480, defects: 8, rework: 2, downtimeMinutes: 15 },
  { date: '2025-05-29', line: '2', style: 'Baby Trouser', output: 810, target: 800, defects: 20, rework: 8, downtimeMinutes: 30 },
  { date: '2025-05-29', line: '3', style: 'Kids Shirt', output: 570, target: 600, defects: 15, rework: 5, downtimeMinutes: 30 },

  { date: '2025-05-30', line: '1', style: 'Mens Polo', output: 440, target: 480, defects: 20, rework: 7, downtimeMinutes: 40 },
  { date: '2025-05-30', line: '2', style: 'Baby Trouser', output: 790, target: 800, defects: 18, rework: 6, downtimeMinutes: 20 },
  { date: '2025-05-30', line: '3', style: 'Kids Shirt', output: 610, target: 600, defects: 7, rework: 1, downtimeMinutes: 10 },
];

const mockDefectTypes = [
    { type: 'Stitching Error', count: 85 },
    { type: 'Fabric Snag', count: 30 },
    { type: 'Button Missing', count: 20 },
    { type: 'Print Misalignment', count: 15 },
    { type: 'Loose Thread', count: 18 },
    { type: 'Incorrect Measurement', count: 25 },
    { type: 'Fabric Stain', count: 10 },
];


const ProductionReports = () => {
  const [reportData, setReportData] = useState(mockProductionData);
  const [filterStartDate, setFilterStartDate] = useState('2025-05-27');
  const [filterEndDate, setFilterEndDate] = useState('2025-05-30');
  const [filterLine, setFilterLine] = useState('All');
  const [filterStyle, setFilterStyle] = useState('All');

  const getUniqueValues = (key) => [...new Set(mockProductionData.map(d => d[key]))];
  const uniqueLines = ['All', ...getUniqueValues('line')];
  const uniqueStyles = ['All', ...getUniqueValues('style')];
  const uniqueDates = [...new Set(mockProductionData.map(d => d.date))].sort();

  // Filter data based on selections
  const filteredData = reportData.filter(item => {
    const dateMatch = item.date >= filterStartDate && item.date <= filterEndDate;
    const lineMatch = filterLine === 'All' || item.line === filterLine;
    const styleMatch = filterStyle === 'All' || item.style === filterStyle;
    return dateMatch && lineMatch && styleMatch;
  });

  // --- KPI Calculations ---
  const totalUnitsProduced = filteredData.reduce((sum, item) => sum + item.output, 0);
  const totalTargetUnits = filteredData.reduce((sum, item) => item.target ? sum + item.target : sum, 0);
  const overallEfficiency = totalTargetUnits > 0 ? ((totalUnitsProduced / totalTargetUnits) * 100).toFixed(1) : '0.0';
  const totalDefects = filteredData.reduce((sum, item) => sum + item.defects + item.rework, 0);
  const overallQualityRate = totalUnitsProduced > 0 ? (((totalUnitsProduced - totalDefects) / totalUnitsProduced) * 100).toFixed(1) : '0.0';
  const totalDowntimeMinutes = filteredData.reduce((sum, item) => sum + item.downtimeMinutes, 0);


  // --- Chart Data Preparation ---

  // 1. Production Output Trend (Line Chart)
  const productionTrendLabels = [...new Set(filteredData.map(d => d.date))].sort();
  const productionOutputData = productionTrendLabels.map(date =>
    filteredData.filter(d => d.date === date).reduce((sum, d) => sum + d.output, 0)
  );
  const productionTargetData = productionTrendLabels.map(date =>
    filteredData.filter(d => d.date === date).reduce((sum, d) => d.target ? sum + d.target : sum, 0)
  );

  const outputTrendChartData = {
    labels: productionTrendLabels,
    datasets: [
      {
        label: 'Actual Output',
        data: productionOutputData,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Target Output',
        data: productionTargetData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderDash: [5, 5],
        tension: 0.3,
      },
    ],
  };

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += context.parsed.y.toLocaleString();
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
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
    },
  };


  // 2. Line Efficiency Comparison (Bar Chart)
  const lineEfficiencyData = {};
  filteredData.forEach(item => {
    if (!lineEfficiencyData[item.line]) {
      lineEfficiencyData[item.line] = { totalOutput: 0, totalTarget: 0 };
    }
    lineEfficiencyData[item.line].totalOutput += item.output;
    if(item.target) lineEfficiencyData[item.line].totalTarget += item.target;
  });

  const lineEfficiencyLabels = Object.keys(lineEfficiencyData);
  const lineEfficiencies = lineEfficiencyLabels.map(line => {
    const data = lineEfficiencyData[line];
    return data.totalTarget > 0 ? ((data.totalOutput / data.totalTarget) * 100).toFixed(1) : 0;
  });

  const lineEfficiencyChartData = {
    labels: lineEfficiencyLabels.map(line => `Line ${line}`),
    datasets: [
      {
        label: 'Efficiency (%)',
        data: lineEfficiencies,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const lineEfficiencyChartOptions = {
    ...commonChartOptions,
    scales: {
      x: { ...commonChartOptions.scales.x },
      y: {
        ...commonChartOptions.scales.y,
        beginAtZero: true,
        max: 110, // Max efficiency could be slightly above 100%
        title: {
          display: true,
          text: 'Efficiency (%)',
          color: '#e2e8f0'
        }
      },
    },
  };


  // 3. Overall Defect Category Distribution (Doughnut Chart)
  const allDefectCounts = mockDefectTypes.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + d.count;
    return acc;
  }, {});

  const topDefects = Object.entries(allDefectCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5); // Get top 5

  const defectDoughnutData = {
    labels: topDefects.map(([type]) => type),
    datasets: [
      {
        data: topDefects.map(([, count]) => count),
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

  const defectDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#e2e8f0',
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
          <h1 className="text-3xl font-semibold tracking-tight">Production Reports</h1>
          <p className="text-lg text-gray-400 mt-1">Comprehensive reports on production efficiency, quality, and utilization.</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="bg-gray-800/70 p-6 rounded-xl shadow-xl border border-gray-700/60 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaCalendarAlt className="text-gray-400" />
          <label htmlFor="start-date" className="sr-only">Start Date</label>
          <input
            type="date"
            id="start-date"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FaCalendarAlt className="text-gray-400" />
          <label htmlFor="end-date" className="sr-only">End Date</label>
          <input
            type="date"
            id="end-date"
            className="bg-gray-700 text-gray-200 rounded-md p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
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
            <option value="All">All Lines</option>
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
            <option value="All">All Styles</option>
            {uniqueStyles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Summary KPIs */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaCogs className="w-8 h-8 text-indigo-400 mb-3" />
          <p className="text-sm text-gray-400">Total Units Produced</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{totalUnitsProduced.toLocaleString()}</h2>
        </div>
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaChartLine className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-sm text-gray-400">Overall Efficiency</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{overallEfficiency}%</h2>
        </div>
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaCheckCircle className="w-8 h-8 text-purple-400 mb-3" />
          <p className="text-sm text-gray-400">Overall Quality Rate</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{overallQualityRate}%</h2>
        </div>
        <div className="bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-lg p-6 flex flex-col items-start">
          <FaHourglassHalf className="w-8 h-8 text-orange-400 mb-3" />
          <p className="text-sm text-gray-400">Total Downtime</p>
          <h2 className="text-3xl font-bold text-gray-100 mt-1">{totalDowntimeMinutes.toLocaleString()} mins</h2>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Output Trend Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartLine className="mr-2" /> Production Output Trend</h3>
          <div className="h-80">
            {productionTrendLabels.length > 0 ? (
              <Line data={outputTrendChartData} options={commonChartOptions} />
            ) : (
              <div className="text-center text-gray-500 flex items-center justify-center h-full">No production trend data for selected filters.</div>
            )}
          </div>
        </motion.div>

        {/* Line Efficiency Comparison Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartBar className="mr-2" /> Line Efficiency Comparison</h3>
          <div className="h-80">
            {lineEfficiencyLabels.length > 0 ? (
              <Bar data={lineEfficiencyChartData} options={lineEfficiencyChartOptions} />
            ) : (
              <div className="text-center text-gray-500 flex items-center justify-center h-full">No efficiency data for selected lines.</div>
            )}
          </div>
        </motion.div>

        {/* Top Defect Categories Chart */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaChartPie className="mr-2" /> Top Defect Categories</h3>
          <div className="h-80 flex items-center justify-center">
            {topDefects.length > 0 ? (
              <Doughnut data={defectDoughnutData} options={defectDoughnutOptions} />
            ) : (
              <div className="text-center text-gray-500">No defect data available.</div>
            )}
          </div>
        </motion.div>

        {/* Other Potential Report (e.g., Utilization over time, Cost of Quality) */}
        <motion.div variants={itemVariants} className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-200 flex items-center"><FaDollarSign className="mr-2" /> Cost of Quality (Placeholder)</h3>
          <div className="h-80 flex items-center justify-center text-gray-500">
            <p>This space can be used for other critical reports like Cost of Quality, Utilization trends, etc.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductionReports;