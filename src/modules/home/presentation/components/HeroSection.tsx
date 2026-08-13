import { MapPin, Users, Calendar, Play } from 'lucide-react';
import landingBg from '../../../../assets/landing.jpg';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedCity: string;
  onCityChange: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export function HeroSection({ searchQuery, onSearchChange, selectedCity, onCityChange, onSearch }: HeroSectionProps) {
  return (
    <section className="relative min-h-[600px] lg:min-h-[660px] flex items-center justify-center overflow-hidden bg-slate-900">
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105 filter brightness-95"
        style={{ backgroundImage: `url(${landingBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-900/40 to-slate-950/70" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white !text-white tracking-tight mb-4 max-w-4xl mx-auto leading-tight drop-shadow-lg text-center" style={{ color: '#ffffff' }}>
          Temukan Events Impian Favoritmu
        </h1>

        <p className="text-white/95 !text-white/95 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-md text-center" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
          Pesan tiket konser artis lokal & internasional dengan sistem antrian adil, transaksi aman, dan konfirmasi instan.
        </p>

        <div className="inline-flex items-center gap-3 bg-white/25 backdrop-blur-md border border-white/40 rounded-full px-6 py-2.5 mb-12 shadow-xl hover:bg-white/35 transition-all cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-white text-[#0064D2] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 fill-[#0064D2] ml-0.5" />
          </div>
          <span className="text-white font-bold text-sm drop-shadow-sm">Watch Video</span>
        </div>

        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/60 text-left">
          <form onSubmit={onSearch} className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
            <div className="w-full md:flex-1 px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50/80 rounded-xl transition-colors">
              <MapPin className="w-5 h-5 text-[#0064D2] shrink-0" />
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                  Location / Konser
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search For A Destination..."
                  className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400 font-medium mt-0.5"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-gray-200" />

            <div className="w-full md:flex-1 px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50/80 rounded-xl transition-colors">
              <Users className="w-5 h-5 text-[#0064D2] shrink-0" />
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                  Lokasi Kota
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-600 outline-none cursor-pointer font-medium mt-0.5"
                >
                  <option value="">Semua Lokasi</option>
                  <option value="Jakarta">Jakarta</option>
                  <option value="Bandung">Bandung</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Bali">Bali</option>
                  <option value="Yogyakarta">Yogyakarta</option>
                </select>
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-gray-200" />

            <div className="w-full md:flex-1 px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50/80 rounded-xl transition-colors">
              <Calendar className="w-5 h-5 text-[#0064D2] shrink-0" />
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                  Date
                </label>
                <span className="block text-sm text-gray-400 font-medium mt-0.5">
                  Pick a date
                </span>
              </div>
            </div>

            <div className="w-full md:w-auto p-1">
              <button
                type="submit"
                className="w-full md:w-auto bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold text-base px-9 py-3.5 rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
