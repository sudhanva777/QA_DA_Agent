import React, { useState } from 'react';
import { Download, Maximize2, BarChart3, Image as ImageIcon, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';

const CHART_COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#A855F7'];

// Heatmap color scale - blue to red for correlations
const HEATMAP_COLORS = ['#1E1B4B', '#4338CA', '#6366F1', '#38BDF8', '#FDE047', '#F97316', '#EF4444', '#991B1B'];

function getHeatmapColor(value) {
  // value is between -1 and 1 for correlations
  const normalized = (value + 1) / 2; // 0 to 1
  const idx = Math.min(Math.floor(normalized * (HEATMAP_COLORS.length - 1)), HEATMAP_COLORS.length - 1);
  return HEATMAP_COLORS[idx];
}

function HeatmapChart({ data, _config }) {
  if (!data || data.length === 0) return null;
  
  // Extract unique x and y categories
  const xCategories = [...new Set(data.map(d => d.x))];
  const yCategories = [...new Set(data.map(d => d.y))];
  
  // Create a lookup for values
  const valueMap = {};
  data.forEach(d => {
    valueMap[`${d.x}-${d.y}`] = d.value;
  });

  return (
    <div className="w-full">
      <div className="h-[320px] flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 500 320" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="heatmapLegend" x1="0%" y1="0%" x2="100%" y2="0%">
              {HEATMAP_COLORS.map((color, i) => (
                <stop key={i} offset={`${(i / (HEATMAP_COLORS.length - 1)) * 100}%`} stopColor={color} />
              ))}
            </linearGradient>
          </defs>
          
          <g transform="translate(60, 20)">
            {/* Y-axis labels */}
            {yCategories.map((cat, i) => (
              <text
                key={`y-${cat}`}
                x="-10"
                y={i * 30 + 15}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="11"
                fill="#A1A1AA"
                className="axis-label"
              >
                {cat.length > 12 ? cat.substring(0, 12) + '…' : cat}
              </text>
            ))}
            
            {/* X-axis labels (rotated) */}
            {xCategories.map((cat, i) => (
              <text
                key={`x-${cat}`}
                x={i * 40 + 20}
                y={yCategories.length * 30 + 35}
                textAnchor="end"
                dominantBaseline="hanging"
                fontSize="11"
                fill="#A1A1AA"
                transform={`rotate(-45, ${i * 40 + 20}, ${yCategories.length * 30 + 35})`}
                className="axis-label"
              >
                {cat.length > 12 ? cat.substring(0, 12) + '…' : cat}
              </text>
            ))}
            
            {/* Heatmap cells */}
            {data.map((d, idx) => {
              const xIdx = xCategories.indexOf(d.x);
              const yIdx = yCategories.indexOf(d.y);
              const color = getHeatmapColor(d.value);
              return (
                <rect
                  key={idx}
                  x={xIdx * 40}
                  y={yIdx * 30}
                  width={36}
                  height={26}
                  fill={color}
                  rx={4}
                  ry={4}
                  opacity={0.9}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Value labels on cells */}
            {data.map((d, idx) => {
              const xIdx = xCategories.indexOf(d.x);
              const yIdx = yCategories.indexOf(d.y);
              return (
                <text
                  key={`val-${idx}`}
                  x={xIdx * 40 + 18}
                  y={yIdx * 30 + 17}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="#F5F5F7"
                  fontWeight="600"
                  className="font-mono"
                >
                  {d.value.toFixed(2)}
                </text>
              );
            })}
          </g>
          
          {/* Color legend */}
          <g transform="translate(60, 280)">
            <rect x="0" y="0" width="200" height="10" fill="url(#heatmapLegend)" rx="3" />
            <text x="0" y="-4" fontSize="9" fill="#71717A">-1.0</text>
            <text x="200" y="-4" fontSize="9" fill="#71717A" textAnchor="end">1.0</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function ChartViewer({ chartUrl, tableData, chartData, title = 'Generated Visualization' }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('both'); // 'static' | 'interactive' | 'both'

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const fullChartUrl = chartUrl
    ? chartUrl.startsWith('http')
      ? chartUrl
      : `${BASE_URL}${chartUrl}`
    : null;

  // Prefer backend-supplied chart payload, then fall back to a simple table-derived chart.
  const rechartsData = React.useMemo(() => {
    if (chartData?.data) {
      return chartData;
    }
    if (!tableData || !tableData.columns || !tableData.rows || tableData.rows.length === 0) {
      return null;
    }
    const cols = tableData.columns;
    if (cols.length >= 2) {
      const xKey = cols[0];
      const yKey = cols[1];
      const parsed = tableData.rows.slice(0, 15).map((r) => ({
        name: String(r[xKey] ?? ''),
        value: typeof r[yKey] === 'number' ? r[yKey] : parseFloat(r[yKey]) || 0,
      }));
      if (parsed.some((item) => !isNaN(item.value) && item.value !== 0)) {
        return { type: 'bar', data: parsed, xKey: 'name', yKey: 'value', labelY: yKey };
      }
    }
    return null;
  }, [chartData, tableData]);

  const handleDownload = () => {
    if (fullChartUrl) {
      const link = document.createElement('a');
      link.href = fullChartUrl;
      link.download = 'data_analysis_chart.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportPdf = async () => {
    const messageCard = document.querySelector('[data-message-card]');
    if (!messageCard) return;

    const rawMessage = messageCard.getAttribute('data-message');
    if (!rawMessage) return;

    try {
      const messageData = JSON.parse(rawMessage);
      const blob = await api.exportPdf(messageData, messageData.datasetId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const datasetName = messageData.datasetId || 'analysis';
      const safeName = datasetName.replace(/[^a-zA-Z0-9\-_]/g, '_');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `analysis_report_${safeName}_${timestamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF report downloaded!');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to export PDF';
      toast.error(errorMsg);
    }
  };

  if (!fullChartUrl && !rechartsData) {
    return (
      <div className="p-8 text-center bg-[#12121A] border border-white/[0.08] rounded-xl text-text-muted text-xs md:text-sm">
        <BarChart3 className="w-8 h-8 text-text-dim mx-auto mb-2" aria-hidden="true" />
        <span>No visualization chart required or generated for this query.</span>
      </div>
    );
  }

  const showStatic = fullChartUrl && (viewMode === 'static' || viewMode === 'both');
  const showInteractive = rechartsData && (viewMode === 'interactive' || viewMode === 'both');

  const tooltipStyle = {
    backgroundColor: '#12121A',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#F5F5F7',
    fontSize: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  };

  const renderRechartsChart = () => {
    if (!rechartsData) return null;
    const data = rechartsData.data;
    const chartType = rechartsData.type || 'bar';
    const chartTitle = rechartsData.title || title;
    const config = rechartsData.config || {};
    const seriesKeys = rechartsData.seriesKeys || [];

    // Handle heatmap separately since it uses custom SVG
    if (chartType === 'heatmap') {
      return (
        <div className="w-full">
          {chartTitle && <div className="text-xs font-semibold text-text-secondary mb-2 text-center">{chartTitle}</div>}
          <HeatmapChart data={data} config={config} />
        </div>
      );
    }

    return (
      <div className="w-full">
        {chartTitle && <div className="text-xs font-semibold text-text-secondary mb-2 text-center">{chartTitle}</div>}
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="name" stroke="#71717A" fontSize={11} angle={-20} textAnchor="end" />
                <YAxis stroke="#71717A" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366F1' }} name={config.yAxisLabel || 'Value'} />
                {seriesKeys.slice(1).map((key, idx) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={CHART_COLORS[(idx + 1) % CHART_COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            ) : chartType === 'area' ? (
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="name" stroke="#71717A" fontSize={11} angle={-20} textAnchor="end" />
                <YAxis stroke="#71717A" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#6366F1" fill="#6366F1" fillOpacity={0.25} strokeWidth={2} />
              </AreaChart>
            ) : chartType === 'pie' ? (
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} outerRadius={120} fill="#6366F1" label>
                  {data.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            ) : chartType === 'scatter' ? (
              <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="x" stroke="#71717A" fontSize={11} name={config.xAxisLabel || 'X'} />
                <YAxis dataKey="y" stroke="#71717A" fontSize={11} name={config.yAxisLabel || 'Y'} />
                <Tooltip contentStyle={tooltipStyle} />
                <Scatter data={data} fill="#6366F1" />
              </ScatterChart>
            ) : (
              /* Default: bar chart */
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                <XAxis dataKey="name" stroke="#71717A" fontSize={11} angle={-20} textAnchor="end" />
                <YAxis stroke="#71717A" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} name={config.yAxisLabel || 'Value'} />
                {seriesKeys.slice(1).map((key, idx) => (
                  <Bar key={key} dataKey={key} fill={CHART_COLORS[(idx + 1) % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-[#0E0E16] border border-white/10 rounded-xl overflow-hidden shadow-dark-card ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl flex flex-col bg-[#0E0E16]/95 backdrop-blur-2xl' : ''}`}>
      {/* Chart Header Toolbar */}
      <div className="p-3.5 border-b border-white/[0.08] bg-[#12121A] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-4 h-4 text-brand-400" aria-hidden="true" />
          <span className="text-xs md:text-sm font-semibold text-text-primary">{title}</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          {fullChartUrl && rechartsData && (
            <div className="flex items-center bg-[#08080E] border border-white/10 rounded-lg overflow-hidden mr-1">
              <button
                type="button"
                onClick={() => setViewMode('static')}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${viewMode === 'static' ? 'bg-brand-500 text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                Static
              </button>
              <button
                type="button"
                onClick={() => setViewMode('interactive')}
                className={`px-2.5 py-1 text-xs font-medium transition-colors border-x border-white/10 ${viewMode === 'interactive' ? 'bg-brand-500 text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                Interactive
              </button>
              <button
                type="button"
                onClick={() => setViewMode('both')}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${viewMode === 'both' ? 'bg-brand-500 text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                Both
              </button>
            </div>
          )}

          {fullChartUrl && (
            <button
              onClick={handleDownload}
              aria-label="Download chart image as PNG"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-[#12121A] hover:bg-[#181824] text-text-primary border border-white/10 rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-text-muted" aria-hidden="true" />
              PNG
            </button>
          )}

          {fullChartUrl && (
            <button
              onClick={handleExportPdf}
              aria-label="Export analysis as PDF report"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
              PDF
            </button>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 text-text-muted hover:text-text-primary bg-[#12121A] hover:bg-[#181824] border border-white/10 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Chart Body */}
      <div className={`p-4 bg-[#0A0A10] ${isFullscreen ? 'flex-1 overflow-auto' : ''}`}>
        <div className={`flex ${viewMode === 'both' && showStatic && showInteractive ? 'flex-col space-y-4' : 'items-center justify-center'}`}>
          {showStatic && (
            <div className="flex items-center justify-center min-h-[280px]">
              <img
                src={fullChartUrl}
                alt="Data Analysis Chart Visualization"
                className="max-h-[420px] w-auto object-contain rounded-xl border border-white/[0.08] shadow-dark-card"
              />
            </div>
          )}
          {showInteractive && (
            <div className="min-h-[280px]">
              {renderRechartsChart()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
