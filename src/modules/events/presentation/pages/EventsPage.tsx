import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, Calendar, MapPin } from 'lucide-react';
import { useEvents } from '../../application/useEvents';
import { useHomeFilter } from '../../../home/application/useHomeFilter';
import { HeroSection } from '../../../home/presentation/components/HeroSection';
import { EventGrid } from '../components/EventGrid';
import { EventSkeleton } from '../components/EventSkeleton';
import { useAuth } from '../../../auth/application/useAuth';
import { formatDate } from '../../../../core/utils/formatDate';
import { CATEGORY_LABELS } from '../../domain/models/Event';
import type { EventCategory } from '../../domain/models/Event';
import type { Event } from '../../domain/models/Event';
const drawkit10 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852214/draw10.webp';

function EventListItem({ event }: { event: Event }) {
  const categoryLabel = event.category ? CATEGORY_LABELS[event.category] ?? event.category : 'Event';
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0064D2] flex items-center justify-center shrink-0">
        <Calendar className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 truncate">{event.name}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(event.date)}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
          <span className="bg-blue-50 text-[#0064D2] font-bold px-2 py-0.5 rounded-full">{categoryLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function EventsPage() {
  const { user } = useAuth();
  const isBuyer = user?.role === 'BUYER';
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const cityParam = searchParams.get('city') || '';
  const categoryParam = (searchParams.get('category') as EventCategory) || '';

  const { data: events, isLoading, error } = useEvents();

  const {
    searchQuery, setSearchQuery,
    selectedCity, setSelectedCity,
    selectedCategory, setSelectedCategory,
    filteredEvents, applyFilters, resetFilters,
  } = useHomeFilter(events);

  // Inisialisasi dari URL params jika ada
  useState(() => {
    if (queryParam) setSearchQuery(queryParam);
    if (cityParam) setSelectedCity(cityParam);
    if (categoryParam) setSelectedCategory(categoryParam);
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilters();
    setSearchParams((p) => {
      if (searchQuery) p.set('q', searchQuery); else p.delete('q');
      if (selectedCity) p.set('city', selectedCity); else p.delete('city');
      if (selectedCategory) p.set('category', selectedCategory); else p.delete('category');
      return p;
    });
    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleReset() {
    resetFilters();
    setSearchParams({});
  }

  return (
    <div className="w-full bg-white pb-16">
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearch={handleSearch}
      />

      <section id="events-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 scroll-mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Event Mendatang
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Amankan tiket sebelum kuota kehabisan!
            </p>
          </div>
          {filteredEvents && filteredEvents.length > 0 && (
            <span className="hidden sm:inline-block px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-[#0064D2]">
              {filteredEvents.length} Event Tersedia
            </span>
          )}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <EventSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-red-100 p-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Gagal Memuat Event</h3>
            <p className="text-gray-500 text-sm">Terjadi kesalahan koneksi ke server backend.</p>
          </div>
        )}

        {!isLoading && !error && filteredEvents && filteredEvents.length === 0 && (
          <div className="text-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <img src={drawkit10} alt="Tidak ada event" className="w-56 sm:w-64 max-h-60 object-contain mb-4 drop-shadow-sm" />
            <h4 className="text-xl font-bold text-gray-900 mb-1">Belum ada event yang sesuai</h4>
            <p className="text-gray-500 text-sm max-w-sm mb-6">
              Coba ubah kategori atau reset filter untuk melihat semua event.
            </p>
            <button
              onClick={handleReset}
              className="bg-[#0064D2] hover:bg-[#0052B0] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}

        {!isLoading && !error && filteredEvents && filteredEvents.length > 0 && (
          !user || isBuyer
            ? <EventGrid events={filteredEvents} />
            : <div className="space-y-3">{filteredEvents.map((e) => <EventListItem key={e.id} event={e} />)}</div>
        )}
      </section>
    </div>
  );
}
