import { useState, useEffect, useRef } from 'react';
import { QrCode, CheckCircle2, XCircle, Clock, Wifi, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../auth/application/useAuth';
import axiosInstance from '../../../../core/api/axiosInstance';
import { showToast } from '../../../../shared/utils/alert';

interface ScanResult {
  time: string;
  result: 'admitted' | 'rejected';
  ticketUnitId?: string;
  eventId?: string;
  error?: string;
}

export function ScanQRPage() {
  const { user } = useAuth();
  const [qrInput, setQrInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [sessionStart] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - sessionStart) / 1000)), 1000);
    return () => clearInterval(t);
  }, [sessionStart]);

  const hours = Math.floor(elapsed / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const sessionDisplay = hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;

  const admittedCount = scanResults.filter((s) => s.result === 'admitted').length;
  const rejectedCount = scanResults.filter((s) => s.result === 'rejected').length;

  async function handleScan() {
    const content = qrInput.trim();
    if (!content) return;
    setIsScanning(true);
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    try {
      const res = await axiosInstance.post<{ ticket_unit_id: string; event_id: string }>(
        '/api/v1/checkin/scan',
        { qr_content: content }
      );
      setScanResults((prev) => [
        { time, result: 'admitted', ticketUnitId: res.data.ticket_unit_id, eventId: res.data.event_id },
        ...prev,
      ]);
      showToast.success('✅ Tiket Valid - Admitted');
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { error?: string } } };
      const errorMsg = errorData?.response?.data?.error ?? 'QR tidak valid';
      setScanResults((prev) => [
        { time, result: 'rejected', error: errorMsg },
        ...prev,
      ]);
      showToast.error(`❌ Ditolak: ${errorMsg}`);
    } finally {
      setQrInput('');
      setIsScanning(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleScan();
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black">Gate Scanner</h1>
              <p className="text-xs text-gray-400">Gate Operator · {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-950 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-800">
            <Wifi className="w-3.5 h-3.5" />
            Online
          </div>
        </div>

        {/* Scanner Input */}
        <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8 mb-6">
          <div className="w-48 h-48 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-2 border-transparent">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
            </div>
            <div className="absolute inset-4 flex items-center justify-center">
              <QrCode className="w-24 h-24 text-gray-700" />
            </div>
            {isScanning && (
              <div className="absolute inset-x-2 h-0.5 bg-emerald-400/60 blur-sm animate-bounce" style={{ top: '50%' }} />
            )}
          </div>

          <p className="text-sm text-gray-400 font-medium text-center mb-2">
            Scan atau paste QR Code tiket
          </p>
          <p className="text-xs text-gray-600 text-center mb-6">
            Arahkan barcode scanner ke input di bawah, atau paste konten QR secara manual
          </p>

          <input
            ref={inputRef}
            type="text"
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Konten QR tiket..."
            autoFocus
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={handleScan}
            disabled={isScanning || !qrInput.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-lg shadow-emerald-900 flex items-center gap-2 justify-center"
          >
            <QrCode className="w-4 h-4" />
            {isScanning ? 'Memverifikasi...' : 'Verifikasi Tiket'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Admitted', value: admittedCount, color: 'text-emerald-400', icon: CheckCircle2 },
            { label: 'Ditolak', value: rejectedCount, color: 'text-red-400', icon: XCircle },
            { label: 'Sesi', value: sessionDisplay, color: 'text-blue-400', icon: Clock },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center">
              <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Scan History */}
        {scanResults.length > 0 && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-bold text-gray-300">Scan Terakhir</span>
            </div>
            <div className="divide-y divide-gray-800">
              {scanResults.slice(0, 20).map((s, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {s.result === 'admitted' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${s.result === 'admitted' ? 'text-emerald-300' : 'text-red-300'}`}>
                        {s.result === 'admitted' ? 'Admitted' : 'Ditolak'}
                      </p>
                      <p className="text-[11px] text-gray-500 font-mono truncate">
                        {s.ticketUnitId ?? s.error ?? '-'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono shrink-0">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
