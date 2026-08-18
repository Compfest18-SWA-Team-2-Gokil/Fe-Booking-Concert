import { Link } from 'react-router-dom';
import type { Event } from '../../../domain/models/Event';
import { EventCard } from '../EventCard';

interface EventDetailRecommendationsProps {
  events: Event[];
}

export function EventDetailRecommendations({ events }: EventDetailRecommendationsProps) {
  if (events.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-gray-200/60">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Event Untuk Kamu</h2>
          <p className="text-gray-500 text-sm mt-0.5">Jelajahi konser dan acara menarik lainnya</p>
        </div>
        <Link to="/events" className="text-[#0064D2] hover:text-[#0052B0] text-sm font-bold flex items-center gap-1">
          Lihat Semua Event &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((ev) => (
          <EventCard key={ev.id} event={ev} />
        ))}
      </div>
    </div>
  );
}
