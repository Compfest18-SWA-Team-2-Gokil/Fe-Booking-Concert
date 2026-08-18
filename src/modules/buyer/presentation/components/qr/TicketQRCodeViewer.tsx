import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2 } from 'lucide-react';

interface TicketQRCodeViewerProps {
  loading: boolean;
  qrValue: string;
  unitId: string;
  isAdmitted: boolean;
}

export function TicketQRCodeViewer({
  loading,
  qrValue,
  unitId,
  isAdmitted,
}: TicketQRCodeViewerProps) {
  return (
    <div className="space-y-4">
      {/* QR Visual */}
      <div className="flex justify-center my-1">
        {loading ? (
          <div className="w-[210px] h-[210px] bg-gray-100 rounded-2xl flex flex-col items-center justify-center gap-3 border border-gray-200">
            <div className="w-8 h-8 border-3 border-[#0064D2] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-500 font-semibold">Mengambil QR Tiket...</span>
          </div>
        ) : (
          <div className="bg-white p-3 rounded-xl shadow-sm inline-block relative border border-gray-100">
            <QRCodeSVG value={qrValue} size={210} level="M" includeMargin={true} />
            {isAdmitted && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-1" />
                <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Tiket Sudah Di-Scan
                </span>
                <span className="text-[10px] text-gray-500 font-medium mt-0.5">
                  Telah digunakan masuk venue
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ticket Unit Info */}
      <div className="bg-gray-50 rounded-xl p-3 text-left space-y-1.5 text-xs border border-gray-100 font-mono">
        <div className="flex justify-between text-gray-500">
          <span>Unit ID:</span>
          <span className="font-bold text-gray-900 truncate max-w-[200px]">{unitId}</span>
        </div>
        <div className="flex justify-between items-center text-gray-500">
          <span>Status Tiket:</span>
          {isAdmitted ? (
            <span className="font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-gray-500" />
              SUDAH DIGUNAKAN (ADMITTED)
            </span>
          ) : (
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              CONFIRMED / AKTIF
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
