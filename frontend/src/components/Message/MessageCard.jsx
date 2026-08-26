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
import Tabs from '../ui/Tabs';
import DataTable from '../ui/DataTable';
import ChartViewer from '../Charts/ChartViewer';
import CodeBlock from '../CodeViewer/CodeBlock';

function escapeHtmlAttr(str) {
  return str
    .replace(/&/g, '&')
    .replace(/"/g, '"')
    .replace(/'/g, '\'')
    .replace(/</g, '<')
    .replace(/>/g, '>');
}

export default function MessageCard({ message }) {
  const [activeTab, setActiveTab] = useState('summary');

  if (message.role === 'user') {
    return (
      <div className="flex justify-end my-4">
        <div className="flex items-start space-x-2.5 max-w-2xl">
          <div className="bg-primary text-white rounded-2xl rounded-tr-none px-4 py-3 shadow-sm">
            <p className="text-sm md:text-base leading-relaxed font-normal">{message.content}</p>
            {message.datasetId && (
              <div className="mt-2 text-[11px] bg-black/10 px-2.5 py-0.5 rounded-full text-primary/90 font-mono font-medium inline-block border border-black/5">
                Dataset: {message.datasetId}
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
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
      data-message={escapeHtmlAttr(JSON.stringify(message))}
    >
      <div className="flex items-start space-x-3 w-full max-w-4xl">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center shadow-sm shrink-0 mt-1">
          <Bot className="w-5 h-5" aria-hidden="true" />
        </div>

        <div className="flex-1 card overflow-hidden shadow-sm">
          {/* Assistant Header */}
          <div className="px-5 py-3 border-b border-border bg-surface-secondary flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-text-primary">Analysis Result</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                <CheckCircle2 className="w-3 h-3 mr-1" aria-hidden="true" />
                Grounded Pandas Output
              </span>
            </div>

            {message.latency_ms && (
              <div className="flex items-center text-xs text-text-muted font-mono">
                <Clock className="w-3.5 h-3.5 mr-1 text-text-muted" aria-hidden="true" />
                <span>{Math.round(message.latency_ms)} ms</span>
              </div>
            )}
          </div>

          {/* Result Tabs Navigation */}
          <Tabs tabs={tabs} activeTab={activeTab} onChangeTab={setActiveTab} variant="underline" />

          {/* Tab Content Viewers */}
          <div className="p-5">
            {activeTab === 'summary' && (
              <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed text-text-secondary">
                <div className="bg-surface-secondary border-l-4 border-primary border border-border p-4 rounded-r-xl shadow-sm">
                  <h3 className="text-xs uppercase font-bold text-primary tracking-wider mb-2 flex items-center space-x-1.5">
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
              <ChartViewer 
                chartUrl={message.chart_url} 
                tableData={message.table} 
                chartData={message.chart_data} 
                message={message}
              />
            )}

            {activeTab === 'code' && (
              <CodeBlock code={message.generated_code} language="python" />
            )}

            {activeTab === 'logs' && (
              <div className="space-y-3 font-mono text-xs bg-[#0B0F1A] text-text-secondary p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-text-muted">Execution Status:</span>
                  <span className="text-success font-semibold uppercase">
                    {message.status || 'SUCCESS'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-text-muted">Total Latency:</span>
                  <span className="text-text-primary">{message.latency_ms ? `${Math.round(message.latency_ms)} ms` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-text-muted">Inference Engine:</span>
                  <span className="text-primary">Groq (llama-3.3-70b-versatile)</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-text-muted">Dataset Context:</span>
                  <span className="text-text-primary">{message.datasetId || 'Default Dataset'}</span>
                </div>
                {message.analysis_plan && (
                  <div className="pt-2 border-t border-border">
                    <div className="text-text-muted mb-1">Analysis Plan:</div>
                    <pre className="text-primary/90 whitespace-pre-wrap text-[11px] leading-relaxed">
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