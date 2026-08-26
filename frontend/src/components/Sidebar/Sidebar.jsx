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
import { Button } from '../ui';

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
      className="w-72 bg-surface border-r border-border flex flex-col h-full overflow-hidden shrink-0 select-none text-text-primary relative"
    >
      {/* Mobile Drawer Close Header */}
      {isMobileOpen && (
        <div className="p-3 border-b border-border flex items-center justify-between md:hidden bg-white/95 backdrop-blur-xl">
          <span className="font-semibold text-xs text-text-primary uppercase tracking-wider">Navigation Menu</span>
          <button
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="p-1 rounded-md text-text-muted hover:bg-surface hover:text-text-primary"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Top Action Button: + New Analysis */}
      <div className="p-4 border-b border-border relative">
        <Button
          onClick={() => {
            onNewAnalysis();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center justify-center space-x-2"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          <span>New Analysis</span>
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Section 1: Uploaded Datasets */}
        <section aria-labelledby="datasets-heading">
          <div className="flex items-center justify-between mb-2.5">
            <h2 id="datasets-heading" className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Datasets ({datasets.length})
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onOpenUploadModal();
                if (onCloseMobile) onCloseMobile();
              }}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Upload
            </Button>
          </div>

          <div className="space-y-1.5">
            {datasets.length === 0 ? (
              <div className="text-xs text-text-muted italic py-2 px-2">
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
                        ? 'bg-primary/5 text-primary border-primary/20 shadow-sm'
                        : 'border-transparent text-text-secondary hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDataset(d.dataset_id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className="flex-1 text-left px-3 py-2 rounded-l-lg text-xs font-medium flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-primary relative z-10"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                        <FileSpreadsheet
                          className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-text-muted'}`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{d.filename}</span>
                      </div>
                      {isActive ? (
                        <Check className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                      ) : (
                        <span className="text-[10px] text-text-muted font-normal shrink-0">
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
                      className="mr-1 rounded-md p-1.5 text-text-muted hover:bg-error/10 hover:text-error transition-colors relative z-10"
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
          <section aria-label="Active Dataset Metadata" className="bg-surface/90 backdrop-blur-xl border border-border rounded-xl p-3.5 space-y-3 shadow-sm relative overflow-hidden">
            <div className="flex items-center space-x-2 text-text-primary font-semibold text-xs relative z-10">
              <Database className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
              <span className="truncate">{datasetDetails.filename}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center relative z-10">
              <div className="bg-surface-secondary border border-border rounded-lg p-2">
                <div className="text-[9px] text-text-muted font-medium uppercase tracking-wider">Records</div>
                <div className="text-xs font-bold text-text-primary mt-0.5 font-mono-tight">
                  {datasetDetails.record_count?.toLocaleString()}
                </div>
              </div>
              <div className="bg-surface-secondary border border-border rounded-lg p-2">
                <div className="text-[9px] text-text-muted font-medium uppercase tracking-wider">Columns</div>
                <div className="text-xs font-bold text-text-primary mt-0.5 font-mono-tight">
                  {datasetDetails.column_count}
                </div>
              </div>
            </div>

            <div className="bg-surface-secondary border border-border rounded-lg p-2 flex items-center justify-between relative z-10">
              <span className="text-[11px] text-text-muted">Completeness</span>
              <span className="text-xs font-bold text-success font-mono-tight">
                {datasetDetails.completeness}%
              </span>
            </div>

            {datasetDetails.quality_score && (
              <div className="bg-surface-secondary border border-border rounded-lg p-2 flex items-center justify-between relative z-10">
                <span className="text-[11px] text-text-muted">Quality Score</span>
                <span className="text-xs font-bold text-primary font-mono-tight">
                  {datasetDetails.quality_score.score}/100
                </span>
              </div>
            )}
          </section>
        )}

        {/* Section 3: Recent Interaction History */}
        <section aria-labelledby="history-heading">
          <div className="flex items-center justify-between mb-2">
            <h2 id="history-heading" className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center">
              <History className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              History ({historyLogs.length})
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefreshHistory}
              aria-label="Refresh question history"
              title="Refresh history"
              disabled={isLoadingHistory}
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingHistory ? 'animate-spin' : ''}`} aria-hidden="true" />
            </Button>
          </div>

          <div className="space-y-1">
            {historyLogs.length === 0 ? (
              <div className="text-xs text-text-muted italic py-2 px-2">
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
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-text-secondary hover:bg-surface hover:text-text-primary transition-colors flex items-start space-x-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary relative overflow-hidden"
                >
                  <BarChart2 className="w-3.5 h-3.5 text-text-muted group-hover:text-primary shrink-0 mt-0.5 relative z-10" aria-hidden="true" />
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
      <div className="p-3 border-t border-border bg-surface/90 backdrop-blur-xl text-[11px] text-text-muted flex items-center justify-between relative">
        <span className="flex items-center relative z-10">
          <Info className="w-3 h-3 mr-1.5 text-text-muted" aria-hidden="true" />
          AST Python Sandbox
        </span>
        <span className="font-mono-tight text-[10px] bg-surface-secondary text-text-secondary px-1.5 py-0.5 rounded border border-border relative z-10">
          v2.0
        </span>
      </div>
    </aside>
  );
}