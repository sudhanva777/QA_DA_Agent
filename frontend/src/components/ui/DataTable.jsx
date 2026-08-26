import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({
  data,
  title = 'Data Table',
  searchable = true,
  sortable = true,
  paginated = true,
  pageSize = 10,
  exportable = true,
  onRowClick,
  className = '',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const rawColumns = data?.columns;
  const rawRows = data?.rows;

  const filteredRows = useMemo(() => {
    if (!rawRows || !rawRows.length) return [];
    if (!searchQuery.trim()) return rawRows;
    const q = searchQuery.toLowerCase();
    const cols = rawColumns || [];
    return rawRows.filter((row) =>
      cols.some((col) => {
        const val = row[col];
        return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
      })
    );
  }, [rawRows, rawColumns, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!sortable || !sortConfig.key) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredRows, sortConfig]);

  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    if (!paginated) return sortedRows;
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize, paginated]);

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleExportCSV = () => {
    if (!rawRows || !rawRows.length) return;
    const headerStr = rawColumns.join(',');
    const rowStrs = rawRows.map((r) =>
      rawColumns
        .map((c) => {
          let val = r[c] === null || r[c] === undefined ? '' : String(r[c]);
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            val = `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerStr, ...rowStrs].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!data || !data.columns || !data.rows) {
    return (
      <div className={`card p-8 text-center ${className}`}>
        <Search className="w-10 h-10 mx-auto text-border mb-3" aria-hidden="true" />
        <p className="text-text-secondary">No data available</p>
      </div>
    );
  }

  const columns = data.columns;

  return (
    <div className={`card ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-border">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-text-primary">{title}</span>
          <span className="text-sm text-text-muted">({filteredRows.length} {filteredRows.length === 1 ? 'row' : 'rows'})</span>
        </div>
        <div className="flex items-center space-x-2">
          {searchable && (
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-3 py-1.5 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 text-text-primary placeholder-text-muted"
              />
            </div>
          )}
          {exportable && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-surface border border-border rounded-lg hover:bg-surface-secondary hover:border-border-hover transition-colors"
            >
              <Download className="w-4 h-4 mr-1.5 text-text-muted" aria-hidden="true" />
              CSV
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto max-h-[400px]">
        <table className="min-w-full divide-y divide-border text-left text-sm">
          <thead className="bg-surface-secondary text-text-secondary font-semibold sticky top-0 border-b border-border z-10">
            <tr>
              <th className="py-2.5 px-4 w-10 text-center text-text-muted font-mono text-xs">#</th>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="py-2.5 px-4 font-semibold text-text-primary whitespace-nowrap cursor-pointer select-none"
                  onClick={() => handleSort(col)}
                  style={sortable ? { cursor: 'pointer' } : {}}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col}</span>
                    {sortable && sortConfig.key === col && (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUp className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-text-secondary">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-text-muted italic">
                  No matching data rows found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rIdx) => {
                const globalRowIdx = (currentPage - 1) * pageSize + rIdx + 1;
                return (
                  <tr
                    key={rIdx}
                    className={onRowClick ? 'hover:bg-primary-light/50 cursor-pointer transition-colors' : 'even:bg-surface-secondary/50'}
                    onClick={() => onRowClick?.(row)}
                  >
                    <td className="py-2.5 px-4 text-center text-text-muted font-mono text-xs">
                      {globalRowIdx}
                    </td>
                    {columns.map((col, cIdx) => {
                      const val = row[col];
                      const isNum = typeof val === 'number';
                      return (
                        <td
                          key={cIdx}
                          className={`py-2.5 px-4 whitespace-nowrap ${isNum ? 'font-mono text-primary' : ''}`}
                        >
                          {val === null || val === undefined ? (
                            <span className="text-text-muted italic">null</span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {paginated && totalPages > 1 && (
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-sm text-text-muted">
          <span>
            Page <span className="font-semibold text-text-primary">{currentPage}</span> of{' '}
            <span className="font-semibold text-text-primary">{totalPages}</span>
          </span>
          <div className="flex items-center space-x-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg hover:bg-surface-secondary text-text-muted hover:text-text-primary disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg hover:bg-surface-secondary text-text-muted hover:text-text-primary disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}