import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import type { ScanResult } from '../../application/useGateScan';

interface ScanHistoryListProps {
  scanResults: ScanResult[];
  onClear: () => void;
}

export function ScanHistoryList({ scanResults, onClear }: ScanHistoryListProps) {
  if (scanResults.length === 0) return null;

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-300">Riwayat Scan Terakhir</span>
        </div>
        <button
          onClick={onClear}
          className="text-[11px] text-gray-500 hover:text-gray-300 font-semibold cursor-pointer"
        >
          Bersihkan
        </button>
      </div>
      <div className="divide-y divide-gray-800 max-h-72 overflow-y-auto">
        {scanResults.slice(0, 30).map((s, i) => (
          <div key={i} className="px-5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {s.result === 'admitted' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <div className="min-w-0">
                <p
                  className={`text-sm font-bold truncate ${
                    s.result === 'admitted' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {s.result === 'admitted' ? 'TIKET ADMITTED' : 'TIKET DITOLAK'}
                </p>
                <p className="text-[11px] text-gray-400 font-mono truncate">
                  {s.ticketUnitId ?? s.error ?? '-'}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-gray-500 font-mono shrink-0">{s.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
