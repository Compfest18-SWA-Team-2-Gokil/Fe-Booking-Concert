import { useState, useEffect, useRef, useCallback } from 'react';
import {
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Wifi,
  ShieldCheck,
  Camera,
  CameraOff,
  RefreshCw,
  Keyboard,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuth } from '../../../auth/application/useAuth';
import { checkinApi } from '../../infrastructure/checkinApi';
import { showToast } from '../../../../shared/utils/alert';

interface ScanResult {
  time: string;
  result: 'admitted' | 'rejected';
  ticketUnitId?: string;
  eventId?: string;
  error?: string;
}

const QR_READER_ELEMENT_ID = 'gate-qr-reader';

export function ScanQRPage() {
  const { user } = useAuth();
  const [qrInput, setQrInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [sessionStart] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastScannedText, setLastScannedText] = useState<string>('');
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');

  const inputRef = useRef<HTMLInputElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const lastScanTimeRef = useRef<number>(0);

  // Session timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - sessionStart) / 1000)), 1000);
    return () => clearInterval(t);
  }, [sessionStart]);

  const hours = Math.floor(elapsed / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const sessionDisplay = hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;

  const admittedCount = scanResults.filter((s) => s.result === 'admitted').length;
  const rejectedCount = scanResults.filter((s) => s.result === 'rejected').length;

  // Process QR content
  const processQR = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isProcessing) return;

      // Debounce identical scans within 3 seconds
      const now = Date.now();
      if (trimmed === lastScannedText && now - lastScanTimeRef.current < 3000) {
        return;
      }

      lastScanTimeRef.current = now;
      setLastScannedText(trimmed);
      setIsProcessing(true);

      const time = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      try {
        const res = await checkinApi.scanTicketQR({ qr_content: trimmed });
        setScanResults((prev) => [
          {
            time,
            result: 'admitted',
            ticketUnitId: res.ticket_unit_id,
            eventId: res.event_id,
          },
          ...prev,
        ]);
        showToast.success('✅ Tiket Valid - Admitted');
      } catch (err: unknown) {
        const errorData = err as { response?: { data?: { error?: string } } };
        const errorMsg = errorData?.response?.data?.error ?? 'QR tidak valid / ditolak';
        setScanResults((prev) => [
          { time, result: 'rejected', error: errorMsg },
          ...prev,
        ]);
        showToast.error(`❌ Ditolak: ${errorMsg}`);
      } finally {
        setIsProcessing(false);
        setQrInput('');
      }
    },
    [isProcessing, lastScannedText]
  );

  // Stop live camera
  const stopCamera = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch {
        // Ignore stop error
      }
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Start live camera scanner
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      await stopCamera();

      // Check camera permissions
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        setCameraError('Kamera tidak ditemukan pada perangkat ini.');
        return;
      }

      const html5QrCode = new Html5Qrcode(QR_READER_ELEMENT_ID);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          processQR(decodedText);
        },
        () => {
          // Ignore frame decode errors
        }
      );

      setIsCameraActive(true);
    } catch (err) {
      setCameraError(
        'Gagal mengakses kamera. Pastikan izin kamera telah diberikan di browser.'
      );
      setIsCameraActive(false);
    }
  }, [stopCamera, processQR]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Handle manual keyboard submit
  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (qrInput.trim()) {
      processQR(qrInput);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black">Gate Scanner Kamera</h1>
              <p className="text-xs text-gray-400">Gate Operator · {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-950 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-800">
            <Wifi className="w-3.5 h-3.5" />
            Online
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 mb-6">
          <button
            onClick={() => {
              setMode('camera');
              if (!isCameraActive) startCamera();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              mode === 'camera'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Kamera Scanner</span>
          </button>
          <button
            onClick={() => {
              setMode('manual');
              stopCamera();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              mode === 'manual'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Input / Barcode Gun Manual</span>
          </button>
        </div>

        {/* CAMERA SCANNER VIEWPORT */}
        {mode === 'camera' && (
          <div className="bg-gray-900 rounded-3xl border border-gray-800 p-6 mb-6">
            <div className="relative rounded-3xl overflow-hidden bg-black/80 border border-gray-800 min-h-[340px] flex items-center justify-center mb-5">
              {/* HTML5 QR Code Mount Element (shown only when scanning) */}
              <div
                id={QR_READER_ELEMENT_ID}
                className={`w-full max-w-[360px] mx-auto overflow-hidden rounded-2xl ${
                  isCameraActive ? 'block' : 'hidden'
                }`}
              />

              {!isCameraActive && !cameraError && (
                <div className="w-full py-12 px-6 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gray-800 text-emerald-400 flex items-center justify-center mb-5 shadow-lg">
                    <Camera className="w-10 h-10" />
                  </div>
                  <h3 className="font-black text-2xl text-white mb-2 tracking-tight">Kamera Belum Aktif</h3>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
                    Aktifkan kamera untuk memindai QR code tiket secara otomatis dari layar HP pembeli.
                  </p>
                  <button
                    onClick={startCamera}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-8 py-3.5 rounded-2xl text-sm flex items-center gap-2.5 shadow-lg shadow-emerald-900/50 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                    Nyalakan Kamera
                  </button>
                </div>
              )}

              {cameraError && (
                <div className="w-full py-12 px-6 text-center flex flex-col items-center justify-center">
                  <div className="w-18 h-18 rounded-full bg-red-950/60 text-red-400 flex items-center justify-center mb-4">
                    <CameraOff className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-red-400 text-base mb-1">Akses Kamera Gagal</h3>
                  <p className="text-xs text-gray-400 max-w-xs mb-5">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* Viewfinder Target Overlays when scanning */}
              {isCameraActive && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-emerald-400/50 rounded-2xl relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                    <div className="w-full h-0.5 bg-emerald-400 shadow-lg shadow-emerald-400 animate-pulse absolute top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            {isCameraActive && (
              <div className="flex gap-2">
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CameraOff className="w-4 h-4" />
                  Matikan Kamera
                </button>
                <button
                  onClick={startCamera}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  title="Refresh Kamera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* MANUAL / BARCODE GUN VIEW */}
        {mode === 'manual' && (
          <div className="bg-gray-900 rounded-3xl border border-gray-800 p-6 mb-6">
            <p className="text-sm font-bold text-gray-200 mb-1">
              Input String QR / Barcode Scanner Gun
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Arahkan scanner eksternal atau tempel string QR tiket di bawah lalu tekan Enter.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <input
                ref={inputRef}
                type="text"
                value={qrInput}
                onChange={(e) => setQrInput(e.target.value)}
                placeholder="Tempel string QR tiket di sini..."
                autoFocus
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />

              <button
                type="submit"
                disabled={isProcessing || !qrInput.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-900 flex items-center gap-2 justify-center text-sm cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                {isProcessing ? 'Memverifikasi...' : 'Verifikasi Tiket'}
              </button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Admitted (Masuk)', value: admittedCount, color: 'text-emerald-400', icon: CheckCircle2 },
            { label: 'Ditolak', value: rejectedCount, color: 'text-red-400', icon: XCircle },
            { label: 'Durasi Sesi', value: sessionDisplay, color: 'text-blue-400', icon: Clock },
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
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-300">Riwayat Scan Terakhir</span>
              </div>
              <button
                onClick={() => setScanResults([])}
                className="text-[11px] text-gray-500 hover:text-gray-300 font-semibold"
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
        )}
      </div>
    </div>
  );
}
