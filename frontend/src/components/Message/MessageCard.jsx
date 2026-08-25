import React, { useState } from 'react';
import {
  FileText,
  Table as TableIcon,
  BarChart3,
  Code,
  Terminal,
  Bot,
  User,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Tabs from '../Common/Tabs';
import DataTable from '../Tables/DataTable';
import ChartViewer from '../Charts/ChartViewer';
import CodeBlock from '../CodeViewer/CodeBlock';

export default function MessageCard({ message }) {
  const [activeTab, setActiveTab] = useState('summary');

  if (message.role === 'user') {
    return (
      <div className="flex justify-end my-4">
        <div className="flex items-start space-x-2.5 max-w-2xl">
          <div className="bg-gradient-to-r from-brand-600 to-accent-violet text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-glow-sm">
            <p className="text-sm md:text-base leading-relaxed font-normal">{message.content}</p>
            {message.datasetId && (
              <div className="mt-2 text-[11px] bg-black/25 px-2.5 py-0.5 rounded-full text-brand-100 font-mono font-medium inline-block border border-white/10">
                Dataset: {message.datasetId}
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 text-brand-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
            <User className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }

  // Assistant Response Card
  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'table', label: 'Table', icon: TableIcon },
    { id: 'chart', label: 'Chart', icon: BarChart3 },
    { id: 'code', label: 'Generated Code', icon: Code },
    { id: 'logs', label: 'Logs', icon: Terminal },
  ];

  return (
    <div 
      className="flex justify-start my-5 w-full" 
      data-message-card
      data-message={JSON.stringify(message).replace(/"/g, '&quot;')}
    >
      <div className="flex items-start space-x-3 w-full max-w-4xl">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-violet text-white flex items-center justify-center shadow-glow-sm shrink-0 mt-1">
          <Bot className="w-5 h-5" aria-hidden="true" />
        </div>

        <div className="flex-1 bg-[#0E0E16] border border-white/10 rounded-2xl overflow-hidden shadow-dark-card">
          {/* Assistant Header */}
          <div className="px-5 py-3 border-b border-white/[0.08] bg-[#12121A] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-text-primary">Analysis Result</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/30">
                <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" />
                Grounded Pandas Output
              </span>
            </div>

            {message.latency_ms && (
              <div className="flex items-center text-xs text-text-muted font-mono">
                <Clock className="w-3.5 h-3.5 mr-1 text-text-dim" aria-hidden="true" />
                <span>{Math.round(message.latency_ms)} ms</span>
              </div>
            )}
          </div>

          {/* Result Tabs Navigation */}
          <Tabs tabs={tabs} activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Tab Content Viewers */}
          <div className="p-5">
            {activeTab === 'summary' && (
              <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-text-secondary">
                <div className="bg-[#12121A] border-l-4 border-brand-500 border border-white/[0.06] p-4 rounded-r-xl shadow-xs">
                  <h3 className="text-xs uppercase font-bold text-brand-300 tracking-wider mb-2 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Plain-English Answer</span>
                  </h3>
                  <p className="text-text-primary font-normal leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                    {message.answer || message.explanation || 'No summary available.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'table' && (
              <DataTable data={message.table} title="Supporting Tabular Data" />
            )}

            {activeTab === 'chart' && (
              <ChartViewer chartUrl={message.chart_url} tableData={message.table} chartData={message.chart_data} />
            )}

            {activeTab === 'code' && (
              <CodeBlock code={message.generated_code} language="python" />
            )}

            {activeTab === 'logs' && (
              <div className="space-y-3 font-mono text-xs bg-[#08080E] text-text-secondary p-4 rounded-xl border border-white/[0.06]">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-text-muted">Execution Status:</span>
                  <span className="text-accent-emerald font-semibold uppercase">
                    {message.status || 'SUCCESS'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-text-muted">Total Latency:</span>
                  <span className="text-text-primary">{message.latency_ms ? `${Math.round(message.latency_ms)} ms` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-text-muted">Inference Engine:</span>
                  <span className="text-brand-300">Groq (llama-3.3-70b-versatile)</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-text-muted">Dataset Context:</span>
                  <span className="text-text-primary">{message.datasetId || 'Default Dataset'}</span>
                </div>
                {message.analysis_plan && (
                  <div className="pt-2 border-t border-white/[0.06]">
                    <div className="text-text-muted mb-1">Analysis Plan:</div>
                    <pre className="text-brand-200/90 whitespace-pre-wrap text-[11px] leading-relaxed">
                      {JSON.stringify(message.analysis_plan, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
