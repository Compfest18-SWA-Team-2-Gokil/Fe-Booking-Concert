import { ExternalLink } from 'lucide-react';

interface HoldModalRedirectStepProps {
  invoiceUrl: string;
  createdOrderId: string;
  onCheckStatus: () => void;
  onGoToTickets: () => void;
}

export function HoldModalRedirectStep({
  invoiceUrl,
  onCheckStatus,
  onGoToTickets,
}: HoldModalRedirectStepProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-10 h-10 text-[#0064D2]" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Halaman Pembayaran Dibuka</h2>
        <p className="text-gray-500 text-sm mb-6">
          Selesaikan pembayaran di tab baru. Setelah selesai membayar, klik tombol di bawah untuk melihat tiketmu.
        </p>
        <div className="space-y-3">
          <a
            href={invoiceUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#FF6100] hover:bg-[#E55500] text-white py-3.5 rounded-xl font-extrabold shadow-md transition-colors text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka Halaman Pembayaran</span>
          </a>
          <button
            onClick={onCheckStatus}
            className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3 rounded-xl font-bold transition-colors text-sm shadow-md cursor-pointer"
          >
            Saya Sudah Bayar / Cek Status
          </button>
          <button
            onClick={onGoToTickets}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm cursor-pointer"
          >
            Ke Tiket Saya
          </button>
        </div>
      </div>
    </div>
  );
}
