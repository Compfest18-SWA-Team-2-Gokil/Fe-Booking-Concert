import { Flame, Ticket } from 'lucide-react';
import { PROMO_BANNERS } from '../../constants/homeData';

interface PromoBannersProps {
  onNavigate: () => void;
}

export function PromoBanners({ onNavigate }: PromoBannersProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Promo Spesial Hari Ini</span>
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
          </h2>
          <p className="text-gray-500 text-sm mt-1">Gunakan kode promo untuk potongan harga tiket ekstra</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PROMO_BANNERS.map((banner) => (
          <div
            key={banner.id}
            className={`relative rounded-3xl p-6 bg-gradient-to-r ${banner.gradient} text-white shadow-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
          >
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {banner.badge}
            </div>
            <Ticket className="w-8 h-8 mb-4 text-white/90" />
            <h3 className="font-extrabold text-xl mb-1">{banner.title}</h3>
            <p className="text-white/85 text-xs mb-5">{banner.subtitle}</p>
            <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <span className="text-xs font-mono font-bold bg-black/30 px-3 py-1.5 rounded-lg border border-white/30">
                {banner.code}
              </span>
              <button
                onClick={onNavigate}
                className="bg-white text-gray-900 hover:bg-gray-100 text-xs font-extrabold px-4 py-2 rounded-xl transition-colors shadow-md"
              >
                Pakai Promo
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
