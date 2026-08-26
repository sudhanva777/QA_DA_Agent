import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Badge, Card } from '../ui';

const STATUS_CONFIG = {
  Excellent: { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success', barColor: 'bg-success', Icon: CheckCircle },
  Good: { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', barColor: 'bg-primary', Icon: CheckCircle },
  'Needs Review': { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', barColor: 'bg-warning', Icon: AlertTriangle },
  'Needs Cleaning': { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', barColor: 'bg-warning', Icon: AlertTriangle },
  Critical: { bg: 'bg-error/10', border: 'border-error/30', text: 'text-error', barColor: 'bg-error', Icon: XCircle },
};

export default function QualityHeader({ qualityScore }) {
  if (!qualityScore) return null;

  const { score, status, dimensions, issue_counts, total_issues } = qualityScore;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Good;
  const StatusIcon = config.Icon;

  return (
    <Card variant="bordered" className={`${config.bg} ${config.border}`} padding="md">
      {/* Top Row: Score + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-surface-secondary border border-border flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-extrabold text-text-primary">{score}</span>
              <span className="text-xs text-text-muted font-medium">/ 100</span>
            </div>
            <span className="text-xs text-text-muted">Data Quality Score</span>
          </div>
        </div>

        <Badge variant="primary" className={`${config.bg} ${config.border} ${config.text}`}>
          <StatusIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{status}</span>
        </Badge>
      </div>

      {/* Score Bar */}
      <div className="w-full bg-surface-secondary rounded-full h-2 mb-3 border border-border overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${config.barColor}`}
          style={{ width: `${Math.max(score, 2)}%` }}
        />
      </div>

      {/* Dimension Breakdown */}
      {dimensions && (
        <div className="grid grid-cols-5 gap-2 mb-3">
          {Object.entries(dimensions).map(([key, val]) => (
            <Card key={key} variant="filled" padding="sm" className="text-center">
              <div className="text-xs font-bold text-text-primary font-mono">{val}%</div>
              <div className="text-[10px] text-text-muted capitalize">{key}</div>
            </Card>
          ))}
        </div>
      )}

      {/* Issue Counts */}
      {issue_counts && total_issues > 0 && (
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <Info className="w-3.5 h-3.5 text-text-muted shrink-0" aria-hidden="true" />
          <span>
            {total_issues} issue{total_issues !== 1 ? 's' : ''} found
            {issue_counts.critical > 0 && <Badge variant="error" className="ml-1">{issue_counts.critical} critical</Badge>}
            {issue_counts.high > 0 && <Badge variant="warning" className="ml-1">{issue_counts.high} high</Badge>}
          </span>
        </div>
      )}
    </Card>
  );
}