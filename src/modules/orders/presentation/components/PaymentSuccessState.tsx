import { Link, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { formatCurrency } from '../../../../core/utils/formatCurrency';

interface PaymentSuccessStateProps {
  order: any;
  matchingStored: any;
  targetOrderId: string;
  onOpenQR: () => void;
}

export function PaymentSuccessState({
  order,
  matchingStored,
  targetOrderId,
  onOpenQR,
}: PaymentSuccessStateProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
        <Check className="w-10 h-10" />
      </div>

      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider mb-2">
        Pembayaran Berhasil
      </span>

      <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight">
        Hore! Tiketmu Siap Dipakai
      </h1>

      <p className="text-gray-600 text-sm max-w-sm mx-auto mb-6">
        Pembayaran telah terverifikasi lunas. E-ticket dengan QR Pas Masuk sudah aktif dan siap digunakan di gate event.
      </p>

      <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left space-y-2.5 border border-gray-100 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Event:</span>
          <span className="font-bold text-gray-900 text-right truncate max-w-[220px]">
            {matchingStored?.eventName || order?.event_id || 'Konser Event'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">ID Pesanan:</span>
          <span className="font-mono text-xs text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 truncate max-w-[180px]">
            {targetOrderId}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Jumlah Tiket:</span>
          <span className="font-bold text-gray-900">
            {matchingStored?.unitIds?.length || 1} tiket
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="font-bold text-gray-900">Total Dibayar:</span>
          <span className="font-black text-[#0064D2] text-lg">
            {formatCurrency(order?.total_amount || matchingStored?.totalAmount || 0)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onOpenQR}
          className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3.5 rounded-xl font-black text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer hover:scale-[1.01]"
        >
          Lihat E-Ticket dan QR Pas Masuk
        </button>

        <button
          onClick={() => navigate('/my-tickets')}
          className="w-full bg-blue-50 hover:bg-blue-100 text-[#0064D2] py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
        >
          Ke Halaman Tiket Saya
        </button>

        <Link
          to="/events"
          className="block text-gray-500 hover:text-gray-800 text-xs font-semibold pt-1 transition-colors"
        >
          Cari Event Lainnya
        </Link>
      </div>
    </>
  );
}
