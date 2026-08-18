import { useState, useRef, useCallback, useEffect } from 'react';
import { checkinApi } from '../infrastructure/checkinApi';
import { showToast } from '../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../shared/utils/apiError';

export interface ScanResult {
  time: string;
  result: 'admitted' | 'rejected';
  ticketUnitId?: string;
  eventId?: string;
  error?: string;
}

export function useGateScan() {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [sessionStart] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  const isProcessingRef = useRef(false);
  const lastScanRef = useRef<{ text: string; ts: number }>({ text: '', ts: 0 });
  const localAdmittedSet = useRef<Set<string>>(new Set());

  // Session duration timer
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - sessionStart) / 1000)), 1000);
    return () => clearInterval(t);
  }, [sessionStart]);

  const hours = Math.floor(elapsed / 3600);
  const mins = Math.floor((elapsed % 3600) / 60);
  const sessionDisplay = hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;

  const admittedCount = scanResults.filter((s) => s.result === 'admitted').length;
  const rejectedCount = scanResults.filter((s) => s.result === 'rejected').length;

  const processQR = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    // Guard 1: Jangan proses jika sedang ada request scan yang berlangsung
    if (isProcessingRef.current) return;

    // Guard 2: Debounce spam pembacaan frame kamera yang sama dalam 3 detik
    const now = Date.now();
    if (trimmed === lastScanRef.current.text && now - lastScanRef.current.ts < 3000) {
      return;
    }

    // Guard 3: Jika tiket ini sudah pernah di-admit di sesi scanner ini, beri notifikasi ramah
    if (localAdmittedSet.current.has(trimmed)) {
      showToast.info('Tiket ini sudah berhasil di-check-in');
      lastScanRef.current = { text: trimmed, ts: now };
      return;
    }

    isProcessingRef.current = true;
    lastScanRef.current = { text: trimmed, ts: now };

    const time = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    try {
      const res = await checkinApi.scanTicketQR({ qr_content: trimmed });
      localAdmittedSet.current.add(trimmed);

      setScanResults((prev) => [
        { time, result: 'admitted', ticketUnitId: res.ticket_unit_id, eventId: res.event_id },
        ...prev,
      ]);
      showToast.success('Tiket Valid - Masuk Diizinkan!');
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(err, 'QR tidak valid atau ditolak');

      setScanResults((prev) => [
        { time, result: 'rejected', error: errorMsg },
        ...prev,
      ]);
      showToast.error(errorMsg);
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  const clearHistory = useCallback(() => {
    setScanResults([]);
    localAdmittedSet.current.clear();
  }, []);

  return {
    isProcessing: isProcessingRef.current,
    scanResults,
    sessionDisplay,
    admittedCount,
    rejectedCount,
    processQR,
    clearHistory,
  };
}
