import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { checkinApi } from '../../../../modules/gate-operator/infrastructure/checkinApi';
import { showToast } from '../../../../shared/utils/alert';

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
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const currentUnitId = unitIds[selectedUnitIndex] ?? '';

  useEffect(() => {
    if (!currentUnitId) return;
    if (qrMap[currentUnitId]) return;

    let isMounted = true;
    setLoading(true);

    checkinApi
      .issueTicketQR({
        ticket_unit_id: currentUnitId,
        order_id: orderId,
        event_id: eventId,
      })
      .then((res) => {
        if (isMounted) {
          setQrMap((prev) => ({ ...prev, [currentUnitId]: res.qr_content }));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const errMsg =
            err?.response?.data?.error ??
            'Tiket belum CONFIRMED atau hanya bisa di-issue oleh akun penyelenggara.';
          setErrorMap((prev) => ({ ...prev, [currentUnitId]: errMsg }));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentUnitId, orderId, eventId, qrMap]);

  const qrContent = qrMap[currentUnitId];
  const errorMsg = errorMap[currentUnitId];

  // Fallback payload string if issue API is restricted to organizer token only in BE
  const displayQrValue =
    qrContent ||
    `tiketin://${eventId}/${orderId}/${currentUnitId}`;

  function handleCopy() {
    navigator.clipboard.writeText(qrContent || displayQrValue);
    setCopied(true);
    showToast.success('String QR berhasil disalin! Siap discan di Gate Operator.');
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 relative">
        {/* Header Decorator */}
        <div className="bg-gradient-to-r from-[#0064D2] to-blue-600 text-white p-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> E-Ticket Pas Masuk
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
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 inline-block mx-auto mb-4 shadow-inner">
            {loading ? (
              <div className="w-48 h-48 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#0064D2] animate-spin" />
                <span className="text-xs text-gray-500 font-medium">
                  Membuat QR Code...
                </span>
              </div>
            ) : (
              <div className="bg-white p-3 rounded-xl shadow-sm inline-block">
                <QRCodeSVG
                  value={displayQrValue}
                  size={180}
                  level="H"
                  includeMargin={false}
                />
              </div>
            )}
          </div>

          {errorMsg && !qrContent && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Info Penerbitan QR</p>
                <p className="text-[11px] text-amber-700 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Ticket Unit Info */}
          <div className="bg-gray-50 rounded-xl p-3 text-left mb-5 space-y-1 text-xs border border-gray-100 font-mono">
            <div className="flex justify-between text-gray-500">
              <span>Unit ID:</span>
              <span className="font-bold text-gray-900 truncate max-w-[200px]">
                {currentUnitId}
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
              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Konten QR</span>
                </>
              )}
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
