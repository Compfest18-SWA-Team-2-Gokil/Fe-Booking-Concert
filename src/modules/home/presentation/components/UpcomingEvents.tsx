import { ArrowRight } from 'lucide-react';
import type { Event } from '../../../events/domain/models/Event';
import { EventCard } from '../../../events/presentation/components/EventCard';
import { useTicketTypes } from '../../../events/application/useTicketTypes';

function EventCardFetched({ eventId, ...rest }: { eventId: string } & Parameters<typeof EventCard>[0]) {
  const { data: ticketTypes } = useTicketTypes(eventId);
  return <EventCard {...rest} ticketTypes={ticketTypes} />;
}

interface UpcomingEventsProps {
  events: Event[] | undefined;
  isLoading: boolean;
  onResetFilter: () => void;
  onNavigateToEvents: () => void;
}

export function UpcomingEvents({ events, isLoading, onResetFilter, onNavigateToEvents }: UpcomingEventsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="inline-block text-xs font-bold text-[#0064D2] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full mb-2">
            Jadwal Konser Terdekat
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Event Mendatang Populer
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Amankan tiket konser artis favoritmu sebelum kuota kehabisan!
          </p>
        </div>
        <button
          onClick={onNavigateToEvents}
          className="hidden sm:flex items-center gap-2 text-[#0064D2] hover:text-[#0052B0] font-bold text-sm bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-all"
        >
          <span>Lihat Semua Event</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse h-80 flex flex-col justify-between">
              <div className="h-40 bg-gray-200 rounded-xl mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="h-10 bg-gray-200 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCardFetched key={event.id} event={event} eventId={event.id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg font-medium">Belum ada event konser yang sesuai pencarian.</p>
          <button
            onClick={onResetFilter}
            className="mt-4 bg-[#0064D2] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md"
          >
            Reset Filter
          </button>
        </div>
      )}

      <div className="mt-10 text-center sm:hidden">
        <button
          onClick={onNavigateToEvents}
          className="w-full bg-[#0064D2] text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2"
        >
          <span>Lihat Semua Event</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
