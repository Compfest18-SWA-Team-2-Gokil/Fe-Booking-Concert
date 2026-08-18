import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X } from 'lucide-react';
import { checkinApi } from '../../../../modules/gate-operator/infrastructure/checkinApi';
import { showToast } from '../../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../../shared/utils/apiError';

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
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUnitId = unitIds[selectedUnitIndex] ?? '';

  useEffect(() => {
    if (!currentUnitId) return;
    if (qrMap[currentUnitId]) return;

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
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setLoading(false);
          showToast.error(getApiErrorMessage(err, 'Gagal memuat QR tiket, memakai kode fallback.'));
        }
      }
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag must be set before the async fetch
    setLoading(true);
    fetchQR();

    return () => {
      isMounted = false;
    };
  }, [currentUnitId, orderId, eventId, qrMap]);

  const qrContent = qrMap[currentUnitId];

  // Fallback payload string jika issue API belum ready
  const displayQrValue =
    qrContent ||
    `tiketin://${eventId}/${orderId}/${currentUnitId}`;

  function handleCopy() {
    navigator.clipboard.writeText(qrContent || displayQrValue);
    setCopied(true);
    showToast.success('Konten QR berhasil disalin!');
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 relative">
        {/* Header */}
        <div className="bg-[#0064D2] text-white p-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">
            E-Ticket Pas Masuk
          </div>
          <h2 className="text-xl font-black truncate pr-8">{eventName}</h2>
          <p className="text-xs text-blue-100 font-mono mt-0.5 truncate">
            Order: {orderId}
          </p>
        </div>

        {/* Ticket Selector if multiple tickets */}
        {unitIds.length > 1 && (
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-2.5 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-gray-500">Pilih Tiket:</span>
            <div className="flex gap-1.5 overflow-x-auto py-0.5">
              {unitIds.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedUnitIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedUnitIndex === idx
                      ? 'bg-[#0064D2] text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Tiket #{idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-6 text-center">
          {/* QR Container */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 inline-block mx-auto mb-4 shadow-inner">
            {loading ? (
              <div className="w-52 h-52 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-3 border-[#0064D2] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-500 font-medium">
                  Memuat QR Code...
                </span>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-xl shadow-sm inline-block">
                <QRCodeSVG
                  value={displayQrValue}
                  size={210}
                  level="M"
                  includeMargin={true}
                />
              </div>
            )}
          </div>

          {/* Ticket Unit Info */}
          <div className="bg-gray-50 rounded-xl p-3 text-left mb-5 space-y-1 text-xs border border-gray-100 font-mono">
            <div className="flex justify-between text-gray-500">
              <span>Unit ID:</span>
              <span className="font-bold text-gray-900 truncate max-w-[200px]">
                {currentUnitId || '(Memuat...)'}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Status:</span>
              <span className="font-bold text-emerald-600">CONFIRMED / ACTIVE</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              {copied ? 'Tersalin!' : 'Salin Konten QR'}
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
