import { useState, useEffect } from 'react';
import { MapPin, Search as SearchIcon, Tag } from 'lucide-react';
import type { EventCategory } from '../../../events/domain/models/Event';
import { CATEGORY_LABELS } from '../../../events/domain/models/Event';

import landingBg from '../../../../assets/landing.jpg';
import concertBg from '../../../../assets/concert.jpg';
import artBg from '../../../../assets/art.jpg';
import sportBg from '../../../../assets/sport.jpg';

const HERO_SLIDES = [
  {
    id: 'landing',
    name: 'Landing',
    image: landingBg,
  },
  {
    id: 'concert',
    name: 'Concert',
    image: concertBg,
  },
  {
    id: 'art',
    name: 'Art',
    image: artBg,
  },
  {
    id: 'sport',
    name: 'Sport',
    image: sportBg,
  },
];

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedCity: string;
  onCityChange: (v: string) => void;
  selectedCategory?: EventCategory | '';
  onCategoryChange?: (v: EventCategory | '') => void;
  onSearch: (e: React.FormEvent) => void;
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedCategory = '',
  onCategoryChange,
  onSearch,
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <section className="relative min-h-150 lg:min-h-165 flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Slides Carousel with Smooth Crossfade */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out transform scale-105 filter brightness-95 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/50 via-slate-900/40 to-slate-950/70" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 text-center flex flex-col items-center justify-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight mb-4 max-w-4xl mx-auto leading-tight drop-shadow-lg text-center" style={{ color: '#ffffff' }}>
          Temukan Events Impian Favoritmu
        </h1>

        <p className="text-white/95 text-base sm:text-lg mb-12 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-md text-center" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
          Pesan tiket konser artis lokal &amp; internasional dengan sistem antrian adil, transaksi aman, dan konfirmasi instan.
        </p>

        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl border border-white/60 text-left">
          <form onSubmit={onSearch} className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
            {/* 1. Cari Event */}
            <div className="w-full md:flex-1 px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50/80 rounded-xl transition-colors">
              <SearchIcon className="w-5 h-5 text-[#0064D2] shrink-0" />
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                  Cari Event
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Nama event atau artis..."
                  className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder-gray-400 font-medium mt-0.5"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-gray-200" />

            {/* 2. Kategori Dropdown */}
            {onCategoryChange && (
              <>
                <div className="w-full md:flex-1 px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50/80 rounded-xl transition-colors">
                  <Tag className="w-5 h-5 text-[#0064D2] shrink-0" />
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                      Kategori
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => onCategoryChange(e.target.value as EventCategory | '')}
                      className="w-full bg-transparent text-sm text-gray-600 outline-none cursor-pointer font-medium mt-0.5"
                    >
                      <option value="">Semua Kategori</option>
                      {(Object.keys(CATEGORY_LABELS) as EventCategory[]).map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="hidden md:block w-px h-10 bg-gray-200" />
              </>
            )}

            {/* 3. Lokasi Dropdown */}
            <div className="w-full md:flex-1 px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50/80 rounded-xl transition-colors">
              <MapPin className="w-5 h-5 text-[#0064D2] shrink-0" />
              <div className="flex-1">
                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider">
                  Lokasi
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

            {/* Submit Button */}
            <div className="w-full md:w-auto p-1">
              <button
                type="submit"
                className="w-full md:w-auto bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold text-base px-9 py-3.5 rounded-xl md:rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Carousel Indicator Dots (Concert, Art, Sport) */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Lihat banner ${slide.name}`}
              className={`group relative flex items-center justify-center h-4 p-1 cursor-pointer transition-all duration-300`}
            >
              <span
                className={`block h-2.5 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? 'w-8 bg-white shadow-lg shadow-white/60 ring-2 ring-white/40'
                    : 'w-2.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

