import React, { useState } from 'react';
import {
  Columns, Hash, Type, Calendar, BarChart3, AlertTriangle,
  ChevronDown, ChevronRight, Database
} from 'lucide-react';

function ColumnDetailRow({ name, meta }) {
  const [expanded, setExpanded] = useState(false);

  const dtype = meta.dtype || 'object';
  const nullPct = meta.null_pct ?? 0;
  const uniqueCount = meta.unique_count ?? 0;

  const getDtypeIcon = (dt) => {
    if (dt.includes('int') || dt.includes('float')) return <Hash className="w-3.5 h-3.5 text-brand-400" />;
    if (dt.includes('datetime') || dt.includes('date')) return <Calendar className="w-3.5 h-3.5 text-accent-cyan" />;
    if (dt.includes('bool')) return <BarChart3 className="w-3.5 h-3.5 text-accent-violet" />;
    return <Type className="w-3.5 h-3.5 text-text-muted" />;
  };

  return (
    <div className="border border-white/[0.06] rounded-xl bg-[#12121A] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          {getDtypeIcon(dtype)}
          <span className="text-xs font-semibold text-text-primary truncate">{name}</span>
          <span className="text-[11px] text-text-muted font-mono">({dtype})</span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          {nullPct > 0 && (
            <span className={`text-xs font-medium font-mono ${nullPct > 20 ? 'text-accent-rose' : 'text-accent-amber'}`}>
              {nullPct}% null
            </span>
          )}
          <span className="text-xs text-text-muted font-mono">{uniqueCount} unique</span>
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
            : <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          }
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-white/[0.04]">
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div className="bg-[#0A0A10] border border-white/[0.04] rounded-lg p-2">
              <span className="text-text-muted">Nulls:</span>{' '}
              <span className="font-mono font-medium text-text-primary">{meta.null_count ?? 0}</span>
            </div>
            <div className="bg-[#0A0A10] border border-white/[0.04] rounded-lg p-2">
              <span className="text-text-muted">Cardinality:</span>{' '}
              <span className="font-mono font-medium text-text-primary">{(meta.cardinality_pct ?? 0)}%</span>
            </div>
          </div>

          {/* Numeric stats */}
          {meta.stats && (
            <div className="mt-2">
              <div className="text-[10px] uppercase font-bold text-text-muted mb-1">Numeric Statistics</div>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {['min', 'max', 'mean', 'median'].map((key) => (
                  <div key={key} className="bg-[#0A0A10] border border-white/[0.04] rounded-lg p-1.5 text-center">
                    <div className="text-[10px] text-text-dim uppercase">{key}</div>
                    <div className="text-xs font-mono font-medium text-brand-300">{meta.stats[key] ?? 'N/A'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date stats */}
          {meta.date_stats && (
            <div className="mt-2">
              <div className="text-[10px] uppercase font-bold text-text-muted mb-1">Date Range</div>
              <div className="text-xs text-text-secondary font-mono bg-[#0A0A10] p-2 rounded-lg border border-white/[0.04]">
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
                      <div className="w-16 bg-[#0A0A10] rounded-full h-1.5 overflow-hidden">
                        <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${Math.min(cat.percentage, 100)}%` }} />
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
            <div className="mt-2 flex items-center space-x-2 text-xs bg-accent-amber/10 p-2.5 rounded-lg border border-accent-amber/20">
              <AlertTriangle className="w-3.5 h-3.5 text-accent-amber shrink-0" aria-hidden="true" />
              <span className="text-amber-300">
                Stored as <span className="font-mono font-semibold">{dtype}</span>, suggested: <span className="font-mono font-semibold text-text-primary">{meta.suggested_type}</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
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
        <div className="bg-[#12121A] border border-white/[0.08] rounded-xl p-3 text-center shadow-xs">
          <Database className="w-4 h-4 text-brand-400 mx-auto mb-1" aria-hidden="true" />
          <div className="text-lg font-bold text-text-primary font-mono">{profile.dimensions?.rows?.toLocaleString()}</div>
          <div className="text-xs text-text-muted">Rows</div>
        </div>
        <div className="bg-[#12121A] border border-white/[0.08] rounded-xl p-3 text-center shadow-xs">
          <Columns className="w-4 h-4 text-brand-400 mx-auto mb-1" aria-hidden="true" />
          <div className="text-lg font-bold text-text-primary font-mono">{profile.dimensions?.columns}</div>
          <div className="text-xs text-text-muted">Columns</div>
        </div>
        <div className="bg-[#12121A] border border-white/[0.08] rounded-xl p-3 text-center shadow-xs">
          <div className="text-lg font-bold text-accent-amber font-mono">{profile.missingness?.overall_missing_pct}%</div>
          <div className="text-xs text-text-muted">Missing</div>
        </div>
        <div className="bg-[#12121A] border border-white/[0.08] rounded-xl p-3 text-center shadow-xs">
          <div className="text-lg font-bold text-text-primary font-mono">{profile.duplication?.duplicate_pct}%</div>
          <div className="text-xs text-text-muted">Duplicates</div>
        </div>
      </div>

      {/* Special Column Flags */}
      {(special.geographic_columns?.length > 0 ||
        special.currency_columns?.length > 0 ||
        special.potential_primary_keys?.length > 0) && (
        <div className="flex flex-wrap gap-2 text-xs">
          {special.potential_primary_keys?.map((c) => (
            <span key={c} className="px-2.5 py-1 bg-brand-500/10 text-brand-300 rounded-full border border-brand-500/20 font-medium">🔑 {c}</span>
          ))}
          {special.geographic_columns?.map((c) => (
            <span key={c} className="px-2.5 py-1 bg-accent-emerald/10 text-accent-emerald rounded-full border border-accent-emerald/20 font-medium">🌍 {c}</span>
          ))}
          {special.currency_columns?.map((c) => (
            <span key={c} className="px-2.5 py-1 bg-accent-amber/10 text-accent-amber rounded-full border border-accent-amber/20 font-medium">💲 {c}</span>
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
