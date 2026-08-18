import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { checkinApi } from '../../../../modules/gate-operator/infrastructure/checkinApi';
import { showToast } from '../../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../../shared/utils/apiError';
import { TicketQRUnitTabs } from './qr/TicketQRUnitTabs';
import { TicketQRCodeViewer } from './qr/TicketQRCodeViewer';

interface TicketQRModalProps {
  orderId: string;
  eventId: string;
  eventName: string;
  unitIds: string[];
  onClose: () => void;
}

export function TicketQRModal({
  orderId,
  eventId,
  eventName,
  unitIds,
  onClose,
}: TicketQRModalProps) {
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUnitId = unitIds[selectedUnitIndex] ?? '';

  useEffect(() => {
    if (!currentUnitId || qrMap[currentUnitId]) return;

    let isMounted = true;
    const fetchQR = async () => {
      try {
        const res = await checkinApi.issueTicketQR({
          ticket_unit_id: currentUnitId,
          order_id: orderId,
          event_id: eventId,
        });
        if (isMounted) {
          setQrMap((prev) => ({ ...prev, [currentUnitId]: res.qr_content }));
          if (res.status) {
            setStatusMap((prev) => ({ ...prev, [currentUnitId]: res.status! }));
          }
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setLoading(false);
          showToast.error(getApiErrorMessage(err, 'Gagal memuat QR tiket, memakai kode cadangan.'));
        }
      }
    };

    setLoading(true);
    fetchQR();
    return () => {
      isMounted = false;
    };
  }, [currentUnitId, orderId, eventId, qrMap]);

  const qrContent = qrMap[currentUnitId];
  const unitStatus = statusMap[currentUnitId] || 'CONFIRMED';
  const displayQrValue = qrContent || `tiketin://${eventId}/${orderId}/${currentUnitId}`;

  function handleCopy() {
    navigator.clipboard.writeText(qrContent || displayQrValue);
    setCopied(true);
    showToast.success('Konten QR berhasil disalin!');
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 relative">
        <div className="bg-[#0064D2] text-white p-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">E-Ticket Pas Masuk</div>
          <h2 className="text-xl font-black truncate pr-8">{eventName}</h2>
          <p className="text-xs text-blue-100 font-mono mt-0.5 truncate">Order: {orderId}</p>
        </div>

        <TicketQRUnitTabs
          unitIds={unitIds}
          selectedIndex={selectedUnitIndex}
          statusMap={statusMap}
          onSelectIndex={setSelectedUnitIndex}
        />

        <div className="p-6 text-center">
          <TicketQRCodeViewer
            loading={loading}
            qrValue={displayQrValue}
            unitId={currentUnitId}
            isAdmitted={unitStatus === 'ADMITTED'}
          />

          <button
            onClick={handleCopy}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer mb-2"
          >
            {copied ? 'Tersalin ke Clipboard!' : 'Salin Kode QR'}
          </button>
          <button
            onClick={onClose}
            className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white font-extrabold py-3 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
