import { useSearchParams } from 'react-router-dom';
import { AlertTriangle, Calendar, MapPin, Music } from 'lucide-react';
import { useEvents } from '../../application/useEvents';
import { useHomeFilter } from '../../../home/application/useHomeFilter';
import { HeroSection } from '../../../home/presentation/components/HeroSection';
import { EventGrid } from '../components/EventGrid';
import { EventSkeleton } from '../components/EventSkeleton';
import { useAuth } from '../../../auth/application/useAuth';
import { formatDate } from '../../../../core/utils/formatDate';
import drawkit10 from '../../../../assets/illustrator/DrawKit10.png';
import type { Event } from '../../domain/models/Event';

function EventListItem({ event }: { event: Event }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
        <Music className="w-5 h-5 text-[#0064D2]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 truncate">{event.name}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(event.date)}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
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

  const { data: events, isLoading, error } = useEvents();

  const {
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCity,
    filteredEvents,
    applyFilters,
    resetFilters,
  } = useHomeFilter(events);

  // Sync initial query params if present
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    applyFilters();
    if (searchQuery) {
      setSearchParams((prev) => {
        prev.set('q', searchQuery);
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete('q');
        return prev;
      });
    }

    if (selectedCity) {
      setSearchParams((prev) => {
        prev.set('city', selectedCity);
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete('city');
        return prev;
      });
    }

    document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleReset() {
    resetFilters();
    setSearchParams({});
  }

  return (
    <div className="w-full bg-white pb-16">
      {/* Hero Section matching the base homepage */}
      <HeroSection
        searchQuery={searchQuery || queryParam}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity || cityParam}
        onCityChange={setSelectedCity}
        onSearch={handleSearch}
      />

      {/* Main Events Section */}
      <section id="events-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16 scroll-mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Event Mendatang Populer
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Amankan tiket konser artis favoritmu sebelum kuota kehabisan!
            </p>
          </div>
          {filteredEvents && filteredEvents.length > 0 && (
            <span className="hidden sm:inline-block px-4 py-2 rounded-xl text-xs font-bold bg-blue-50 text-[#0064D2]">
              {filteredEvents.length} Event Tersedia
            </span>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-red-100 p-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Gagal Memuat Event</h3>
            <p className="text-gray-500 text-sm">Terjadi kesalahan koneksi ke server backend.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredEvents && filteredEvents.length === 0 && (
          <div className="text-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <img
              src={drawkit10}
              alt="Tidak ada event"
              className="w-56 sm:w-64 max-h-60 object-contain mb-4 drop-shadow-sm"
            />
            <h4 className="text-xl font-bold text-gray-900 mb-1">
              Belum ada event konser yang sesuai pencarian
            </h4>
            <p className="text-gray-500 text-sm max-w-sm mb-6">
              Coba ubah kata kunci pencarian atau reset filter untuk melihat semua event yang tersedia.
            </p>
            <button
              onClick={handleReset}
              className="bg-[#0064D2] hover:bg-[#0052B0] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Event Grid / List */}
        {!isLoading && !error && filteredEvents && filteredEvents.length > 0 && (
          isBuyer
            ? <EventGrid events={filteredEvents} />
            : <div className="space-y-3">{filteredEvents.map((e) => <EventListItem key={e.id} event={e} />)}</div>
        )}
      </section>
    </div>
  );
}

