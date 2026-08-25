import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Table as TableIcon } from 'lucide-react';

export default function DataTable({ data, title = 'Supporting Data' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const rawColumns = data?.columns;
  const rawRows = data?.rows;

  // Filter rows based on search query
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

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    if (!filteredRows.length) return [];
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  if (!data || !data.columns || !data.rows) {
    return (
      <div className="p-4 text-xs md:text-sm text-text-muted italic bg-[#12121A] border border-white/[0.06] rounded-xl">
        No tabular data returned for this query.
      </div>
    );
  }

  const columns = data.columns;
  const rows = data.rows;

  // Export to CSV helper
  const handleExportCSV = () => {
    if (!rows.length) return;
    const headerStr = columns.join(',');
    const rowStrs = rows.map((r) =>
      columns
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

  return (
    <div className="bg-[#0E0E16] border border-white/10 rounded-2xl overflow-hidden shadow-dark-card">
      {/* Table Toolbar */}
      <div className="p-3.5 border-b border-white/[0.08] bg-[#12121A] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <TableIcon className="w-4 h-4 text-brand-400" aria-hidden="true" />
          <span className="text-xs md:text-sm font-semibold text-text-primary">{title}</span>
          <span className="text-xs text-text-muted font-normal">
            ({filteredRows.length} {filteredRows.length === 1 ? 'row' : 'rows'})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Input */}
          <div className="relative">
            <label htmlFor="table-search" className="sr-only">Search table data</label>
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-dim" aria-hidden="true" />
            <input
              id="table-search"
              type="text"
              placeholder="Search table..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#08080E] border border-white/10 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 w-44 text-text-primary placeholder-text-dim transition-all"
            />
          </div>

          {/* Download CSV */}
          <button
            onClick={handleExportCSV}
            title="Download CSV"
            aria-label="Download table data as CSV"
            className="inline-flex items-center px-3 py-1.5 bg-[#12121A] hover:bg-[#181824] text-text-secondary hover:text-text-primary text-xs font-medium border border-white/10 rounded-lg transition-colors shadow-xs focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-text-muted" aria-hidden="true" />
            CSV
          </button>
        </div>
      </div>

      {/* Table Scrollable Container */}
      <div className="overflow-x-auto max-h-[380px]">
        <table className="min-w-full divide-y divide-white/[0.06] text-left text-xs">
          <thead className="bg-[#12121A] text-text-secondary font-semibold sticky top-0 border-b border-white/[0.08] z-10">
            <tr>
              <th className="py-2.5 px-4 w-12 text-center text-text-dim font-mono text-xs">#</th>
              {columns.map((col, idx) => (
                <th key={idx} className="py-2.5 px-4 font-semibold text-text-primary whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-text-secondary font-normal">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-6 text-center text-text-dim italic">
                  No matching data rows found.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, rIdx) => {
                const globalRowIdx = (currentPage - 1) * pageSize + rIdx + 1;
                return (
                  <tr
                    key={rIdx}
                    className="even:bg-[#0A0A10] odd:bg-[#0E0E16] hover:bg-brand-500/10 transition-colors"
                  >
                    <td className="py-2.5 px-4 text-center text-text-dim font-mono text-xs">
                      {globalRowIdx}
                    </td>
                    {columns.map((col, cIdx) => {
                      const val = row[col];
                      const isNum = typeof val === 'number';
                      return (
                        <td
                          key={cIdx}
                          className={`py-2.5 px-4 whitespace-nowrap ${
                            isNum ? 'font-mono text-brand-200' : 'text-text-secondary'
                          }`}
                        >
                          {val === null || val === undefined ? (
                            <span className="text-text-dim italic">null</span>
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

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-white/[0.08] bg-[#12121A] flex items-center justify-between text-xs text-text-muted">
          <span>
            Page <span className="font-semibold text-text-primary">{currentPage}</span> of{' '}
            <span className="font-semibold text-text-primary">{totalPages}</span>
          </span>

          <div className="flex items-center space-x-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
              className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
              className="p-1.5 rounded-lg hover:bg-white/[0.06] text-text-muted hover:text-text-primary disabled:opacity-30 disabled:hover:bg-transparent focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
