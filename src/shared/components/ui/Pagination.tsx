import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

interface PaginationProps {
  pagination?: PaginationMeta;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export function Pagination({ pagination, onPageChange, className = '' }: PaginationProps) {
  if (!pagination || pagination.total_pages <= 1) return null;

  const { current_page, total_pages, total_items, per_page } = pagination;
  const startItem = (current_page - 1) * per_page + 1;
  const endItem = Math.min(current_page * per_page, total_items);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
      <p className="text-xs text-gray-500 font-medium">
        Menampilkan <span className="font-bold text-gray-800">{startItem}</span> -{' '}
        <span className="font-bold text-gray-800">{endItem}</span> dari{' '}
        <span className="font-bold text-gray-800">{total_items}</span> data
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page <= 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <div className="flex items-center gap-1 px-2">
          {Array.from({ length: total_pages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === total_pages || Math.abs(p - current_page) <= 1)
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && p - prev > 1;

              return (
                <div key={p} className="flex items-center">
                  {showEllipsis && <span className="px-1.5 text-xs text-gray-400">...</span>}
                  <button
                    onClick={() => onPageChange(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      p === current_page
                        ? 'bg-[#0064D2] text-white shadow-xs'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {p}
                  </button>
                </div>
              );
            })}
        </div>

        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page >= total_pages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
