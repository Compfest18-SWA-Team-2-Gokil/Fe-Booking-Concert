import { Flame, Ticket, Copy } from 'lucide-react';
import { useActivePromos } from '../../../admin/application/useAdminPromos';
import { formatCurrency } from '../../../../core/utils/formatCurrency';
import { showToast } from '../../../../shared/utils/alert';

interface PromoBannersProps {
  onNavigate: () => void;
}

const GRADIENTS = [
  'from-orange-500 to-amber-600',
  'from-blue-600 to-indigo-700',
  'from-emerald-500 to-teal-700',
  'from-purple-600 to-pink-600',
];

export function PromoBanners({ onNavigate }: PromoBannersProps) {
  const { data: activePromos = [], isLoading } = useActivePromos();

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    showToast.success(`Kode promo ${code} berhasil disalin ke clipboard!`);
  }

  if (isLoading || activePromos.length === 0) {
    return null; // Sembunyikan section jika tidak ada promo aktif dari Admin
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Promo Spesial Hari Ini</span>
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Gunakan kode voucher resmi dari admin untuk potongan harga tiket ekstra saat checkout
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activePromos.slice(0, 3).map((promo, idx) => {
          const gradient = GRADIENTS[idx % GRADIENTS.length];
          const discountLabel =
            promo.discount_type === 'PERCENTAGE'
              ? `Diskon ${promo.discount_value}%`
              : `Hemat ${formatCurrency(promo.discount_value)}`;

          return (
            <div
              key={promo.id}
              className={`relative rounded-3xl p-6 bg-gradient-to-r ${gradient} text-white shadow-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-white/20 backdrop-blur-md text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {discountLabel}
                  </div>
                  <Ticket className="w-6 h-6 text-white/80" />
                </div>
                <h3 className="font-black text-xl mb-1">{promo.title}</h3>
                <p className="text-white/85 text-xs mb-4 line-clamp-2">
                  {promo.description || `Minimal transaksi ${promo.min_order_amount > 0 ? formatCurrency(promo.min_order_amount) : 'tanpa minimum'}`}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => handleCopy(promo.code)}
                  title="Salin Kode Promo"
                  className="text-xs font-mono font-bold bg-black/30 hover:bg-black/40 px-3 py-1.5 rounded-lg border border-white/30 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>{promo.code}</span>
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={onNavigate}
                  className="bg-white text-gray-900 hover:bg-gray-100 text-xs font-black px-4 py-2 rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  Pilih Event
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
