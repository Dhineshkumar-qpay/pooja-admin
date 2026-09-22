import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
}

export function DataTable<T>({ columns, data, keyExtractor }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-dark-brown-100">
        <thead className="bg-ivory-100/80 backdrop-blur-sm">
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap border-b border-dark-brown-200"
            >
              S.No
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider whitespace-nowrap border-b border-dark-brown-200"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-dark-brown-100">
          {currentData.map((row, index) => (
            <tr key={keyExtractor(row)} className="hover:bg-ivory-50 transition-all duration-200 group">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-normal transition-colors">
                {startIndex + index + 1}
              </td>
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-black font-normal transition-colors">
                  {col.render ? col.render(row) : String((row as any)[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No records found.
        </div>
      )}
      
      {totalPages >= 1 && data.length > 0 && (
        <div className="px-6 py-4 border-t border-dark-brown-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Info */}
          <p className="text-xs text-dark-brown-400">
            Showing{' '}
            <span className="font-semibold text-dark-brown-700">{startIndex + 1}</span>
            {' '}–{' '}
            <span className="font-semibold text-dark-brown-700">{Math.min(endIndex, data.length)}</span>
            {' '}of{' '}
            <span className="font-semibold text-dark-brown-700">{data.length}</span>
            {' '}results
          </p>

          {/* Page numbers + prev/next */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dark-brown-200 text-xs font-medium text-dark-brown-600 hover:bg-ivory-100 hover:border-dark-brown-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-lg text-xs font-semibold transition-all ${
                  page === currentPage
                    ? 'bg-gradient-to-br from-saffron-600 to-temple-gold-500 text-white shadow-sm border border-transparent'
                    : 'border border-dark-brown-200 text-dark-brown-600 hover:bg-ivory-100 hover:border-dark-brown-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dark-brown-200 text-xs font-medium text-dark-brown-600 hover:bg-ivory-100 hover:border-dark-brown-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
