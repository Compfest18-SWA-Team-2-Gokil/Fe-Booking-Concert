import { Tag, Globe, Flame } from 'lucide-react';
import type { Promo } from '../../../infrastructure/promosApi';

interface AdminPromosHeaderProps {
  promos: Promo[];
  filterType: 'ALL' | 'VOUCHER' | 'PROMO';
  onFilterChange: (type: 'ALL' | 'VOUCHER' | 'PROMO') => void;
  onOpenCreateVoucher: () => void;
  onOpenCreatePromo: () => void;
}

export function AdminPromosHeader({
  promos,
  filterType,
  onFilterChange,
  onOpenCreateVoucher,
  onOpenCreatePromo,
}: AdminPromosHeaderProps) {
  const globalCount = promos.filter((p) => (p.type || (!p.event_id ? 'VOUCHER' : 'PROMO')) === 'VOUCHER').length;
  const eventCount = promos.filter((p) => (p.type || (!p.event_id ? 'VOUCHER' : 'PROMO')) === 'PROMO').length;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#0064D2]" /> Manajemen Voucher & Promo Event
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Buat voucher global atau diskon khusus konser event tertentu untuk meningkatkan antusiasme pembeli.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs">
          <button
            onClick={() => onFilterChange('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'ALL' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Semua ({promos.length})
          </button>
          <button
            onClick={() => onFilterChange('VOUCHER')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'VOUCHER' ? 'bg-white text-blue-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Voucher ({globalCount})
          </button>
          <button
            onClick={() => onFilterChange('PROMO')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filterType === 'PROMO' ? 'bg-white text-amber-700 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Promo Event ({eventCount})
          </button>
        </div>

        <button
          onClick={onOpenCreateVoucher}
          className="bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Globe className="w-4 h-4" />
          <span>+ Buat Voucher</span>
        </button>

        <button
          onClick={onOpenCreatePromo}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Flame className="w-4 h-4" />
          <span>+ Buat Promo</span>
        </button>
      </div>
    </div>
  );
}
