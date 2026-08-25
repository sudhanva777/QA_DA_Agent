import React from 'react';
import {
  Lightbulb, TrendingUp, AlertTriangle, CheckCircle,
  Database, PieChart, Zap, AlertOctagon, Info
} from 'lucide-react';

const ICON_MAP = {
  Database: Database,
  TrendingUp: TrendingUp,
  AlertTriangle: AlertTriangle,
  CheckCircle: CheckCircle,
  PieChart: PieChart,
  Zap: Zap,
  Lightbulb: Lightbulb,
  AlertOctagon: AlertOctagon,
  Info: Info,
};

const TYPE_STYLES = {
  info: { bg: 'bg-brand-500/10', border: 'border-brand-500/20', iconColor: 'text-brand-400' },
  warning: { bg: 'bg-accent-amber/10', border: 'border-accent-amber/20', iconColor: 'text-accent-amber' },
  success: { bg: 'bg-accent-emerald/10', border: 'border-accent-emerald/20', iconColor: 'text-accent-emerald' },
  error: { bg: 'bg-accent-rose/10', border: 'border-accent-rose/20', iconColor: 'text-accent-rose' },
};

export default function InsightsPanel({ insights, isExpanded = true }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 mb-1">
        <Lightbulb className="w-4 h-4 text-brand-400" aria-hidden="true" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Auto-Generated Insights
        </h3>
        <span className="text-xs text-text-dim font-mono">({insights.length})</span>
      </div>

      <div className={`space-y-2.5 ${isExpanded ? '' : 'max-h-64 overflow-y-auto'}`}>
        {insights.map((insight, idx) => {
          const Icon = ICON_MAP[insight.icon] || Info;
          const style = TYPE_STYLES[insight.type] || TYPE_STYLES.info;

          return (
            <div
              key={idx}
              className={`rounded-xl border p-3.5 ${style.bg} ${style.border} shadow-xs`}
            >
              <div className="flex items-start space-x-2.5">
                <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${style.iconColor}`} aria-hidden="true" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-text-primary">{insight.title}</span>
                    <span className="text-[10px] text-text-muted font-medium bg-white/[0.04] px-1.5 py-0.2 rounded border border-white/[0.06]">{insight.category}</span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
