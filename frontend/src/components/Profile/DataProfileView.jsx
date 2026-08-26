import React, { useState } from 'react';
import {
  Columns, Hash, Type, Calendar, BarChart3, AlertTriangle,
  ChevronDown, ChevronRight, Database
} from 'lucide-react';
import { Badge, Card } from '../ui';

function ColumnDetailRow({ name, meta }) {
  const [expanded, setExpanded] = useState(false);

  const dtype = meta.dtype || 'object';
  const nullPct = meta.null_pct ?? 0;
  const uniqueCount = meta.unique_count ?? 0;

  const getDtypeIcon = (dt) => {
    if (dt.includes('int') || dt.includes('float')) return <Hash className="w-3.5 h-3.5 text-primary" />;
    if (dt.includes('datetime') || dt.includes('date')) return <Calendar className="w-3.5 h-3.5 text-primary" />;
    if (dt.includes('bool')) return <BarChart3 className="w-3.5 h-3.5 text-primary" />;
    return <Type className="w-3.5 h-3.5 text-text-muted" />;
  };

  return (
    <Card variant="bordered" className="overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-surface-secondary transition-colors text-left"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          {getDtypeIcon(dtype)}
          <span className="text-xs font-semibold text-text-primary truncate">{name}</span>
          <span className="text-[11px] text-text-muted font-mono">({dtype})</span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          {nullPct > 0 && (
            <Badge variant={nullPct > 20 ? 'error' : 'warning'} className="text-xs">
              {nullPct}% null
            </Badge>
          )}
          <span className="text-xs text-text-muted font-mono">{uniqueCount} unique</span>
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
            : <ChevronRight className="w-3.5 h-3.5 text-text-muted" />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-border">
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <Card variant="filled" padding="sm">
              <span className="text-text-muted">Nulls:</span>{' '}
              <span className="font-mono font-medium text-text-primary">{meta.null_count ?? 0}</span>
            </Card>
            <Card variant="filled" padding="sm">
              <span className="text-text-muted">Cardinality:</span>{' '}
              <span className="font-mono font-medium text-text-primary">{(meta.cardinality_pct ?? 0)}%</span>
            </Card>
          </div>

          {/* Numeric stats */}
          {meta.stats && (
            <div className="mt-2">
              <div className="text-[10px] uppercase font-bold text-text-muted mb-1">Numeric Statistics</div>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {['min', 'max', 'mean', 'median'].map((key) => (
                  <Card key={key} variant="filled" padding="sm" className="text-center">
                    <div className="text-[10px] text-text-muted uppercase">{key}</div>
                    <div className="text-xs font-mono font-medium text-primary">{meta.stats[key] ?? 'N/A'}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Date stats */}
          {meta.date_stats && (
            <div className="mt-2">
              <div className="text-[10px] uppercase font-bold text-text-muted mb-1">Date Range</div>
              <div className="text-xs text-text-secondary font-mono card p-2">
                {meta.date_stats.min_date} → {meta.date_stats.max_date} ({meta.date_stats.range_days} days)
              </div>
            </div>
          )}

          {/* Top categories */}
          {meta.top_categories && meta.top_categories.length > 0 && (
            <div className="mt-2">
              <div className="text-[10px] uppercase font-bold text-text-muted mb-1">Top Categories</div>
              <div className="space-y-1">
                {meta.top_categories.slice(0, 5).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-text-secondary truncate max-w-[200px]">{cat.category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-surface-secondary rounded-full h-1.5 overflow-hidden">
                        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.min(cat.percentage, 100)}%` }} />
                      </div>
                      <span className="text-text-muted w-12 text-right font-mono text-[11px]">{cat.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested type */}
          {meta.suggested_type && (
            <div className="mt-2 flex items-center space-x-2 text-xs bg-warning/10 p-2.5 rounded-lg border border-warning/20">
              <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" aria-hidden="true" />
              <span className="text-warning">
                Stored as <span className="font-mono font-semibold">{dtype}</span>, suggested: <span className="font-mono font-semibold text-text-primary">{meta.suggested_type}</span>
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default function DataProfileView({ profile }) {
  if (!profile) return null;

  const columns = profile.columns || {};
  const special = profile.special_columns || {};
  const colEntries = Object.entries(columns);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card variant="bordered" padding="md" className="text-center">
          <Database className="w-4 h-4 text-primary mx-auto mb-1" aria-hidden="true" />
          <div className="text-lg font-bold text-text-primary font-mono">{profile.dimensions?.rows?.toLocaleString()}</div>
          <div className="text-xs text-text-muted">Rows</div>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <Columns className="w-4 h-4 text-primary mx-auto mb-1" aria-hidden="true" />
          <div className="text-lg font-bold text-text-primary font-mono">{profile.dimensions?.columns}</div>
          <div className="text-xs text-text-muted">Columns</div>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <div className="text-lg font-bold text-warning font-mono">{profile.missingness?.overall_missing_pct}%</div>
          <div className="text-xs text-text-muted">Missing</div>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <div className="text-lg font-bold text-text-primary font-mono">{profile.duplication?.duplicate_pct}%</div>
          <div className="text-xs text-text-muted">Duplicates</div>
        </Card>
      </div>

      {/* Special Column Flags */}
      {(special.geographic_columns?.length > 0 ||
        special.currency_columns?.length > 0 ||
        special.potential_primary_keys?.length > 0) && (
        <div className="flex flex-wrap gap-2 text-xs">
          {special.potential_primary_keys?.map((c) => (
            <Badge key={c} variant="primary" className="font-medium">🔑 {c}</Badge>
          ))}
          {special.geographic_columns?.map((c) => (
            <Badge key={c} variant="success" className="font-medium">🌍 {c}</Badge>
          ))}
          {special.currency_columns?.map((c) => (
            <Badge key={c} variant="warning" className="font-medium">💲 {c}</Badge>
          ))}
        </div>
      )}

      {/* Column Explorer */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
          Column Explorer ({colEntries.length})
        </h3>
        <div className="space-y-1.5">
          {colEntries.map(([name, meta]) => (
            <ColumnDetailRow key={name} name={name} meta={meta} />
          ))}
        </div>
      </div>
    </div>
  );
}