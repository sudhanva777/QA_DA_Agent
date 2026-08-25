import React from 'react';
import { 
  Plus, 
  FileSpreadsheet, 
  History, 
  Database, 
  BarChart2, 
  Check,
  RefreshCw,
  Info,
  Trash2,
  X,
  Sparkles
} from 'lucide-react';

export default function Sidebar({
  datasets = [],
  activeDataset,
  onSelectDataset,
  datasetDetails,
  historyLogs = [],
  onSelectHistory,
  onNewAnalysis,
  onOpenUploadModal,
  onDeleteDataset,
  isLoadingHistory,
  onRefreshHistory,
  isMobileOpen = false,
  onCloseMobile
}) {
  return (
    <aside
      role="complementary"
      aria-label="Sidebar Navigation"
      className="w-[280px] bg-[var(--bg-base)]/95 backdrop-blur-xl border-r border-[var(--border-subtle)] flex flex-col h-full overflow-hidden shrink-0 select-none text-[var(--text-primary)] relative"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[var(--accent-primary)]/5 blur-xl" />
      </div>

      {/* Mobile Drawer Close Header */}
      {isMobileOpen && (
        <div className="p-3 border-b border-[var(--border-subtle)] flex items-center justify-between md:hidden bg-[var(--bg-glass)] backdrop-blur-xl">
          <span className="font-semibold text-xs text-[var(--text-primary)] uppercase tracking-wider">Navigation Menu</span>
          <button
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="p-1 rounded-md text-[var(--text-muted)] hover:bg-white/[0.08] hover:text-[var(--text-primary)]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Top Action Button: + New Analysis */}
      <div className="p-4 border-b border-[var(--border-subtle)] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 via-transparent to-[var(--accent-secondary)]/5" />
        <button
          onClick={() => {
            onNewAnalysis();
            if (onCloseMobile) onCloseMobile();
          }}
          className="btn-primary w-full py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2 shadow-[var(--shadow-glow-sm)] hover:shadow-[var(--shadow-glow)] relative z-10"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Section 1: Uploaded Datasets */}
        <section aria-labelledby="datasets-heading">
          <div className="flex items-center justify-between mb-2.5">
            <h2 id="datasets-heading" className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Datasets ({datasets.length})
            </h2>
            <button
              onClick={() => {
                onOpenUploadModal();
                if (onCloseMobile) onCloseMobile();
              }}
              className="text-[11px] text-[var(--accent-primary)] hover:text-[var(--accent-primary-glow)] font-semibold focus:outline-none focus:underline"
            >
              + Upload
            </button>
          </div>

          <div className="space-y-1.5">
            {datasets.length === 0 ? (
              <div className="text-xs text-[var(--text-dim)] italic py-2 px-2">
                No datasets uploaded yet
              </div>
            ) : (
              datasets.map((d) => {
                const isActive = activeDataset === d.dataset_id;
                return (
                  <div
                    key={d.dataset_id}
                    className={`flex items-center rounded-lg border transition-all relative overflow-hidden ${
                      isActive
                        ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary-glow)] border-[var(--accent-primary)]/30 shadow-[var(--shadow-glow-sm)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDataset(d.dataset_id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className="flex-1 text-left px-3 py-2 rounded-l-lg text-xs font-medium flex items-center justify-between focus:outline-none relative z-10"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        <FileSpreadsheet
                          className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{d.filename}</span>
                      </div>
                      {isActive ? (
                        <Check className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                      ) : (
                        <span className="text-[10px] text-[var(--text-dim)] font-normal shrink-0">
                          {d.size_formatted}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDataset?.(d.dataset_id);
                      }}
                      aria-label={`Remove dataset ${d.filename}`}
                      title="Remove dataset"
                      className="mr-1 rounded-md p-1.5 text-[var(--text-muted)] hover:bg-[var(--accent-hot)]/10 hover:text-[var(--accent-hot)] transition-colors relative z-10"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Section 2: Active Dataset Metadata Card */}
        {datasetDetails && (
          <section aria-label="Active Dataset Metadata" className="bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-subtle)] rounded-xl p-3.5 space-y-3 shadow-[var(--shadow-card)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 via-transparent to-[var(--accent-secondary)]/5" />
            <div className="flex items-center space-x-2 text-[var(--text-primary)] font-semibold text-xs relative z-10">
              <Database className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
              <span className="truncate">{datasetDetails.filename}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center relative z-10">
              <div className="bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg p-2">
                <div className="text-[9px] text-[var(--text-muted)] font-medium uppercase tracking-wider">Records</div>
                <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5 font-mono-tight">
                  {datasetDetails.record_count?.toLocaleString()}
                </div>
              </div>
              <div className="bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg p-2">
                <div className="text-[9px] text-[var(--text-muted)] font-medium uppercase tracking-wider">Columns</div>
                <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5 font-mono-tight">
                  {datasetDetails.column_count}
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg p-2 flex items-center justify-between relative z-10">
              <span className="text-[11px] text-[var(--text-muted)]">Completeness</span>
              <span className="text-xs font-bold text-[var(--accent-tertiary)] font-mono-tight">
                {datasetDetails.completeness}%
              </span>
            </div>

            {datasetDetails.quality_score && (
              <div className="bg-[var(--bg-deep)] border border-[var(--border-subtle)] rounded-lg p-2 flex items-center justify-between relative z-10">
                <span className="text-[11px] text-[var(--text-muted)]">Quality Score</span>
                <span className="text-xs font-bold text-[var(--accent-primary)] font-mono-tight">
                  {datasetDetails.quality_score.score}/100
                </span>
              </div>
            )}
          </section>
        )}

        {/* Section 3: Recent Interaction History */}
        <section aria-labelledby="history-heading">
          <div className="flex items-center justify-between mb-2">
            <h2 id="history-heading" className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center">
              <History className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              History ({historyLogs.length})
            </h2>
            <button
              onClick={onRefreshHistory}
              aria-label="Refresh question history"
              title="Refresh history"
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingHistory ? 'animate-spin' : ''}`} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-1">
            {historyLogs.length === 0 ? (
              <div className="text-xs text-[var(--text-dim)] italic py-2 px-2">
                No past questions yet
              </div>
            ) : (
              historyLogs.slice(0, 15).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onSelectHistory) onSelectHistory(item);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-white/[0.05] hover:text-[var(--text-primary)] transition-colors flex items-start space-x-2 group focus:outline-none relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <BarChart2 className="w-3.5 h-3.5 text-[var(--text-dim)] group-hover:text-[var(--accent-primary)] shrink-0 mt-0.5 relative z-10" aria-hidden="true" />
                  <span className="line-clamp-2 font-normal leading-relaxed text-[11px] relative z-10">
                    {item.question}
                  </span>
                </button>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-deep)]/90 backdrop-blur-xl text-[11px] text-[var(--text-muted)] flex items-center justify-between relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-primary)]/5 to-transparent" />
        <span className="flex items-center relative z-10">
          <Info className="w-3 h-3 mr-1.5 text-[var(--text-dim)]" aria-hidden="true" />
          AST Python Sandbox
        </span>
        <span className="font-mono-tight text-[10px] bg-white/[0.06] text-[var(--text-secondary)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] relative z-10">
          v2.0
        </span>
      </div>
    </aside>
  );
}