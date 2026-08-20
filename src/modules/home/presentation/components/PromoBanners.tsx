import { Flame, Ticket, Copy } from 'lucide-react';
import { useActivePromos } from '../../../admin/application/useAdminPromos';
import { formatCurrency } from '../../../../core/utils/formatCurrency';
import { showToast } from '../../../../shared/utils/alert';

interface PromoBannersProps {
  onNavigate: () => void;
}

const CARD_THEMES = [
  {
    bg: 'bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white',
    border: 'border-amber-200/80 hover:border-amber-300',
    shadow: 'hover:shadow-amber-500/10',
    badge: 'bg-amber-100/90 text-amber-900 border-amber-200/80',
    iconColor: 'text-amber-500/70',
    codeBg: 'bg-white/90 border-amber-200 text-amber-950 hover:bg-amber-50',
    btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20',
    glow: 'bg-amber-300/20',
  },
  {
    bg: 'bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-white',
    border: 'border-blue-200/80 hover:border-blue-300',
    shadow: 'hover:shadow-blue-500/10',
    badge: 'bg-blue-100/90 text-blue-900 border-blue-200/80',
    iconColor: 'text-blue-500/70',
    codeBg: 'bg-white/90 border-blue-200 text-blue-950 hover:bg-blue-50',
    btn: 'bg-[#0064D2] hover:bg-[#0052B0] text-white shadow-blue-600/20',
    glow: 'bg-blue-300/20',
  },
  {
    bg: 'bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white',
    border: 'border-emerald-200/80 hover:border-emerald-300',
    shadow: 'hover:shadow-emerald-500/10',
    badge: 'bg-emerald-100/90 text-emerald-900 border-emerald-200/80',
    iconColor: 'text-emerald-500/70',
    codeBg: 'bg-white/90 border-emerald-200 text-emerald-950 hover:bg-emerald-50',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    glow: 'bg-emerald-300/20',
  },
  {
    bg: 'bg-gradient-to-br from-purple-50/90 via-pink-50/40 to-white',
    border: 'border-purple-200/80 hover:border-purple-300',
    shadow: 'hover:shadow-purple-500/10',
    badge: 'bg-purple-100/90 text-purple-900 border-purple-200/80',
    iconColor: 'text-purple-500/70',
    codeBg: 'bg-white/90 border-purple-200 text-purple-950 hover:bg-purple-50',
    btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20',
    glow: 'bg-purple-300/20',
  },
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
            <span>Promo & Voucher Spesial Hari Ini</span>
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Gunakan kode voucher resmi dari admin untuk potongan harga tiket ekstra saat checkout
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activePromos.slice(0, 3).map((promo, idx) => {
          const theme = CARD_THEMES[idx % CARD_THEMES.length];
          const discountLabel =
            promo.discount_type === 'PERCENTAGE'
              ? `Diskon ${promo.discount_value}%`
              : `Hemat ${formatCurrency(promo.discount_value)}`;

          return (
            <div
              key={promo.id}
              className={`relative rounded-3xl p-6 ${theme.bg} border ${theme.border} text-gray-900 shadow-sm hover:shadow-lg ${theme.shadow} overflow-hidden group hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between`}
            >
              {/* Subtle Ambient Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full blur-2xl pointer-events-none ${theme.glow}`} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3.5">
                  <div className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border shadow-2xs ${theme.badge}`}>
                    {discountLabel}
                  </div>
                  <Ticket className={`w-6 h-6 ${theme.iconColor}`} />
                </div>
                <h3 className="font-extrabold text-xl text-gray-900 mb-1">{promo.title}</h3>
                <p className="text-gray-500 text-xs mb-5 line-clamp-2 leading-relaxed">
                  {promo.description || `Minimal transaksi ${promo.min_order_amount > 0 ? formatCurrency(promo.min_order_amount) : 'tanpa minimum'}`}
                </p>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-3.5 border-t border-gray-200/70">
                <button
                  type="button"
                  onClick={() => handleCopy(promo.code)}
                  title="Salin Kode Promo"
                  className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs ${theme.codeBg}`}
                >
                  <span>{promo.code}</span>
                  <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </button>
                <button
                  onClick={onNavigate}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 ${theme.btn}`}
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
