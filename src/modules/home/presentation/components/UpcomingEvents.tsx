import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Event } from '../../../events/domain/models/Event';
import { EventCard } from '../../../events/presentation/components/EventCard';
import { useTicketTypes } from '../../../events/application/useTicketTypes';
import { useAuth } from '../../../auth/application/useAuth';
const drawkit10 = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786852214/draw10.webp';

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
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (!user) {
      navigate('/login');
    } else {
      onNavigateToEvents();
    }
  };

  return (
    <section id="upcoming-events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20 scroll-mt-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Event Mendatang Populer
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Amankan tiket konser artis favoritmu sebelum kuota kehabisan!
          </p>
        </div>
        <button
          onClick={handleViewAll}
          className="hidden sm:flex items-center gap-2 text-[#0064D2] hover:text-[#0052B0] font-bold text-sm bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-all cursor-pointer"
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
        /* State saat hasil pencarian/filter kosong atau belum ada event */
        <div className="text-center py-14 px-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <img
            src={drawkit10}
            alt="Tidak ada event"
            className="w-52 sm:w-64 max-h-56 object-contain mb-4 drop-shadow-sm"
          />
          <h4 className="text-xl font-bold text-gray-900 mb-1">
            Belum ada event konser yang tersedia
          </h4>
          <p className="text-gray-500 text-sm max-w-sm mb-6">
            Coba ubah kata kunci pencarian atau masuk ke akun untuk melihat jadwal konser terbaru.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onResetFilter}
              className="bg-[#0064D2] hover:bg-[#0052B0] text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Reset Filter
            </button>
            {!user && (
              <Link
                to="/login"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
              >
                Masuk ke Akun
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 text-center sm:hidden">
        <button
          onClick={handleViewAll}
          className="w-full bg-[#0064D2] text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2"
        >
          <span>Lihat Semua Event</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
