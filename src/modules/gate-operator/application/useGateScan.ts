import { useState, useRef, useCallback, useEffect } from 'react';
import { checkinApi } from '../infrastructure/checkinApi';
import { showToast } from '../../../shared/utils/alert';

export interface ScanResult {
  time: string;
  result: 'admitted' | 'rejected';
  ticketUnitId?: string;
  eventId?: string;
  error?: string;
}

export function useGateScan() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [sessionStart] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [lastScannedText, setLastScannedText] = useState<string>('');

  const lastScanTimeRef = useRef<number>(0);

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
      }
    },
    [isProcessing, lastScannedText]
  );

  const clearHistory = useCallback(() => {
    setScanResults([]);
  }, []);

  return {
    isProcessing,
    scanResults,
    sessionDisplay,
    admittedCount,
    rejectedCount,
    processQR,
    clearHistory,
  };
}
