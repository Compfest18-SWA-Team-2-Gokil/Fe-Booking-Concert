import { Tag, Globe, Flame } from 'lucide-react';

interface BuyerPromoHeaderProps {
  totalPromos: number;
  filter: 'ALL' | 'VOUCHER' | 'PROMO';
  onFilterChange: (filter: 'ALL' | 'VOUCHER' | 'PROMO') => void;
}

export function BuyerPromoHeader({ totalPromos, filter, onFilterChange }: BuyerPromoHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0064D2] to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Voucher & Promo Saya
          </h1>
          <p className="text-sm text-gray-500">
            Gunakan kode voucher aktif di bawah ini untuk mendapatkan potongan harga tiket saat checkout.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => onFilterChange('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'ALL' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Semua Promo ({totalPromos})
        </button>
        <button
          onClick={() => onFilterChange('VOUCHER')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'VOUCHER' ? 'bg-[#0064D2] text-white shadow-sm' : 'text-gray-600 hover:text-[#0064D2] hover:bg-blue-50'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Voucher Global (Semua Event)</span>
        </button>
        <button
          onClick={() => onFilterChange('PROMO')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filter === 'PROMO' ? 'bg-orange-600 text-white shadow-sm' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Promo Khusus Konser</span>
        </button>
      </div>
    </div>
  );
}
