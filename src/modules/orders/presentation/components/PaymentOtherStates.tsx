import { useNavigate, Link } from 'react-router-dom';
import { X, RotateCcw } from 'lucide-react';

export function PaymentNotFoundState() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-50 text-[#0064D2] font-black text-2xl rounded-2xl flex items-center justify-center mx-auto mb-4">
          !
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Informasi Pesanan Tidak Ditemukan</h2>
        <p className="text-gray-500 text-sm mb-6">
          Tidak dapat menemukan ID pesanan. Silakan periksa daftar tiket di akunmu.
        </p>
        <Link
          to="/my-tickets"
          className="w-full inline-block bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-md"
        >
          Buka Tiket Saya
        </Link>
      </div>
    </div>
  );
}

export function PaymentCancelledState() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <X className="w-8 h-8" />
      </div>
      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 uppercase tracking-wider mb-2">
        Pesanan Dibatalkan
      </span>
      <h2 className="text-xl font-black text-gray-900 mb-2">Pembayaran Dibatalkan / Kadaluarsa</h2>
      <p className="text-gray-600 text-sm mb-6">
        Batas waktu pembayaran telah habis atau pesanan dibatalkan. Kuota tiket telah dikembalikan ke sistem.
      </p>
      <button
        onClick={() => navigate('/events')}
        className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors"
      >
        Pesan Ulang di Semua Event
      </button>
    </>
  );
}

export function PaymentRefundState() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <RotateCcw className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-black text-gray-900 mb-2">Status Refund</h2>
      <p className="text-gray-600 text-sm mb-6">
        Pesanan ini dalam status pengajuan refund / telah direfund oleh penyelenggara.
      </p>
      <button
        onClick={() => navigate('/my-tickets')}
        className="w-full bg-[#0064D2] text-white py-3 rounded-xl font-bold text-sm"
      >
        Kembali ke Tiket Saya
      </button>
    </>
  );
}
