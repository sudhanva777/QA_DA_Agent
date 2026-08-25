import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const STATUS_CONFIG = {
  Excellent: { bg: 'bg-accent-emerald/10', border: 'border-accent-emerald/30', text: 'text-accent-emerald', barColor: 'bg-accent-emerald', Icon: CheckCircle },
  Good: { bg: 'bg-brand-500/10', border: 'border-brand-500/30', text: 'text-brand-300', barColor: 'bg-brand-500', Icon: CheckCircle },
  'Needs Review': { bg: 'bg-accent-amber/10', border: 'border-accent-amber/30', text: 'text-accent-amber', barColor: 'bg-accent-amber', Icon: AlertTriangle },
  'Needs Cleaning': { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', barColor: 'bg-orange-500', Icon: AlertTriangle },
  Critical: { bg: 'bg-accent-rose/10', border: 'border-accent-rose/30', text: 'text-accent-rose', barColor: 'bg-accent-rose', Icon: XCircle },
};

export default function QualityHeader({ qualityScore }) {
  if (!qualityScore) return null;

  const { score, status, dimensions, issue_counts, total_issues } = qualityScore;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Good;
  const StatusIcon = config.Icon;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-4`}>
      {/* Top Row: Score + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#12121A] border border-white/10 flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5 text-brand-400" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-text-primary">{score}</span>
              <span className="text-xs text-text-muted font-medium">/ 100</span>
            </div>
            <span className="text-xs text-text-muted">Data Quality Score</span>
          </div>
        </div>

        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
          <StatusIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{status}</span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="w-full bg-[#0A0A10] rounded-full h-2 mb-3 border border-white/[0.06] overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${config.barColor}`}
          style={{ width: `${Math.max(score, 2)}%` }}
        />
      </div>

      {/* Dimension Breakdown */}
      {dimensions && (
        <div className="grid grid-cols-5 gap-2 mb-3">
          {Object.entries(dimensions).map(([key, val]) => (
            <div key={key} className="text-center bg-[#12121A] rounded-lg p-2 border border-white/[0.06]">
              <div className="text-xs font-bold text-text-primary font-mono">{val}%</div>
              <div className="text-[10px] text-text-muted capitalize">{key}</div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Counts */}
      {issue_counts && total_issues > 0 && (
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <Info className="w-3.5 h-3.5 text-text-muted shrink-0" aria-hidden="true" />
          <span>
            {total_issues} issue{total_issues !== 1 ? 's' : ''} found
            {issue_counts.critical > 0 && <span className="ml-1 text-accent-rose font-semibold">({issue_counts.critical} critical)</span>}
            {issue_counts.high > 0 && <span className="ml-1 text-orange-400 font-semibold">({issue_counts.high} high)</span>}
          </span>
        </div>
      )}
    </div>
  );
}
