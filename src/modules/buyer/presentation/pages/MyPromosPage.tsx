import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowRight } from 'lucide-react';
import { useActivePromos } from '../../../admin/application/useAdminPromos';
import { showToast } from '../../../../shared/utils/alert';
import { BuyerPromoHeader } from '../components/promos/BuyerPromoHeader';
import { BuyerPromoCard } from '../components/promos/BuyerPromoCard';

export function MyPromosPage() {
  const navigate = useNavigate();
  const { data: promos = [], isLoading } = useActivePromos();
  const [filter, setFilter] = useState<'ALL' | 'VOUCHER' | 'PROMO'>('ALL');

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    showToast.success(`Kode voucher ${code} berhasil disalin!`);
  }

  function handleUsePromo(eventId?: string) {
    if (eventId) {
      navigate(`/checkout/${eventId}`);
    } else {
      navigate('/events');
    }
  }

  const filteredPromos = promos.filter((p) => {
    if (filter === 'ALL') return true;
    const actualType = p.type || (p.event_id ? 'PROMO' : 'VOUCHER');
    return actualType === filter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        <BuyerPromoHeader
          totalPromos={promos.length}
          filter={filter}
          onFilterChange={setFilter}
        />

        {isLoading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="animate-spin w-10 h-10 border-4 border-[#0064D2] border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Memuat promo aktif...</p>
          </div>
        ) : filteredPromos.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Promo Aktif</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
              Nantikan promo dan diskon tiket menarik dari kami berikutnya!
            </p>
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center gap-2 bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-md"
            >
              <span>Jelajahi Semua Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPromos.map((p) => (
              <BuyerPromoCard
                key={p.id}
                promo={p}
                onCopy={handleCopy}
                onUsePromo={handleUsePromo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
