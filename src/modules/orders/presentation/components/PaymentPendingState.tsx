import { useNavigate } from 'react-router-dom';

interface PaymentPendingStateProps {
  onRefetch: () => void;
  isFetching: boolean;
}

export function PaymentPendingState({ onRefetch, isFetching }: PaymentPendingStateProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>

      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 uppercase tracking-wider mb-2">
        Menunggu Verifikasi
      </span>

      <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
        Sedang Memproses Pembayaran
      </h2>

      <p className="text-gray-600 text-sm max-w-sm mx-auto mb-6">
        Jika kamu sudah menyelesaikan pembayaran di Xendit, sistem kami akan memperbarui status secara otomatis dalam beberapa detik.
      </p>

      <div className="space-y-3">
        <button
          onClick={onRefetch}
          disabled={isFetching}
          className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md cursor-pointer disabled:opacity-50"
        >
          {isFetching ? 'Memeriksa...' : 'Cek Status Sekarang'}
        </button>

        <button
          onClick={() => navigate('/my-tickets')}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
        >
          Lihat di Tiket Saya
        </button>
      </div>
    </>
  );
}
