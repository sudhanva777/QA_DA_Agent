import React, { useState } from 'react';
import { X, Sparkles, Wrench, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Button, Card } from '../ui';

const CLEANING_OPERATIONS = [
  { id: 'trim_whitespace', label: 'Trim Whitespace', description: 'Remove leading/trailing spaces from text columns' },
  { id: 'normalize_casing', label: 'Normalize Casing', description: 'Standardize text to title case in low-cardinality columns' },
  { id: 'normalize_currencies', label: 'Clean Currencies', description: 'Strip currency symbols ($, €, £) and convert to numeric' },
  { id: 'normalize_percentages', label: 'Clean Percentages', description: 'Strip % symbols and convert to numeric values' },
  { id: 'fix_date_formats', label: 'Fix Date Formats', description: 'Parse date strings into proper datetime columns' },
  { id: 'remove_duplicates', label: 'Remove Duplicates', description: 'Drop exact duplicate rows' },
  { id: 'remove_empty_columns', label: 'Remove Empty Columns', description: 'Drop columns that are 100% null' },
  { id: 'remove_constant_columns', label: 'Remove Constants', description: 'Drop columns with only one unique value' },
  { id: 'handle_missing', label: 'Handle Missing Values', description: 'Impute numeric with median, text with mode' },
  { id: 'handle_outliers', label: 'Handle Outliers', description: 'Clip numeric values to IQR bounds' },
];

export default function CleaningModal({
  isOpen,
  onClose,
  datasetId,
  validationIssues,
  onCleaningComplete,
}) {
  const [selectedOps, setSelectedOps] = useState(new Set(['trim_whitespace', 'normalize_casing', 'remove_duplicates']));
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaningResult, setCleaningResult] = useState(null);

  if (!isOpen) return null;

  const toggleOp = (opId) => {
    setSelectedOps((prev) => {
      const next = new Set(prev);
      if (next.has(opId)) {
        next.delete(opId);
      } else {
        next.add(opId);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedOps(new Set(CLEANING_OPERATIONS.map((op) => op.id)));
  };

  const deselectAll = () => {
    setSelectedOps(new Set());
  };

  const handleClean = async () => {
    if (selectedOps.size === 0) {
      toast.error('Select at least one cleaning operation.');
      return;
    }
    setIsCleaning(true);
    setCleaningResult(null);
    try {
      const result = await api.cleanDataset(datasetId, Array.from(selectedOps));
      setCleaningResult(result);
      toast.success(`Dataset cleaned → ${result.cleaned_dataset_id}`);
      if (onCleaningComplete) {
        onCleaningComplete(result);
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.error || 'Cleaning failed.';
      toast.error(msg);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cleaning-modal-title"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="card-elevated max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl border border-border relative animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-surface-secondary flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Wrench className="w-4 h-4" aria-hidden="true" />
            </div>
            <h2 id="cleaning-modal-title" className="text-base font-bold text-text-primary">
              Smart Data Cleaning
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close cleaning dialog"
            leftIcon={<X className="w-5 h-5" />}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {!cleaningResult ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm text-text-secondary">
                  Select operations to clean <span className="font-semibold font-mono text-text-primary">{datasetId}</span>.
                  Original dataset is never overwritten.
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={selectAll}>Select All</Button>
                  <Button variant="ghost" size="sm" onClick={deselectAll}>Clear</Button>
                </div>
              </div>

              <div className="space-y-2">
                {CLEANING_OPERATIONS.map((op) => (
                  <label
                    key={op.id}
                    className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedOps.has(op.id)
                        ? 'bg-primary/5 border-primary/30 text-primary shadow-sm'
                        : 'bg-surface-secondary border-border hover:bg-surface hover:text-text-primary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOps.has(op.id)}
                      onChange={() => toggleOp(op.id)}
                      className="mt-0.5 rounded border-border bg-surface text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="text-xs md:text-sm font-semibold text-text-primary">{op.label}</div>
                      <div className="text-xs text-text-muted mt-0.5">{op.description}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Validation Issues Preview */}
              {validationIssues && validationIssues.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                    Detected Issues ({validationIssues.length})
                  </h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {validationIssues.slice(0, 8).map((issue, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs card p-2">
                        <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          issue.severity === 'CRITICAL' || issue.severity === 'HIGH' ? 'text-error' : 'text-warning'
                        }`} aria-hidden="true" />
                        <span className="text-text-secondary">{issue.message}</span>
                      </div>
                    ))}
                    {validationIssues.length > 8 && (
                      <div className="text-xs text-text-muted italic">... and {validationIssues.length - 8} more</div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Cleaning Result Report */
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-success">
                <CheckCircle className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm font-semibold text-text-primary">{cleaningResult.message}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Card variant="bordered" padding="md">
                  <div className="text-xs text-text-muted font-medium mb-1">Before</div>
                  <div className="text-sm font-mono text-text-secondary">{cleaningResult.stats_before?.rows} rows · {cleaningResult.stats_before?.columns} cols · {cleaningResult.stats_before?.nulls} nulls</div>
                </Card>
                <Card variant="filled" padding="md" className="border-success/30 bg-success/5">
                  <div className="text-xs text-success font-medium mb-1">After</div>
                  <div className="text-sm font-mono text-text-primary">{cleaningResult.stats_after?.rows} rows · {cleaningResult.stats_after?.columns} cols · {cleaningResult.stats_after?.nulls} nulls</div>
                </Card>
              </div>

              {cleaningResult.modifications && cleaningResult.modifications.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Modifications</h3>
                  <ul className="space-y-1">
                    {cleaningResult.modifications.map((mod, idx) => (
                      <li key={idx} className="text-xs text-text-secondary flex items-start space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" aria-hidden="true" />
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-xs text-text-muted">
                Cleaned dataset saved as <span className="font-semibold font-mono text-primary">{cleaningResult.cleaned_dataset_id}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-surface-secondary flex items-center justify-end space-x-3 rounded-b-xl">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            {cleaningResult ? 'Done' : 'Cancel'}
          </Button>
          {!cleaningResult && (
            <Button
              type="button"
              onClick={handleClean}
              disabled={isCleaning || selectedOps.size === 0}
              leftIcon={isCleaning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            >
              {isCleaning ? 'Cleaning...' : 'Clean Dataset'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}