import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '../../domain/models/Event';
import { CATEGORY_LABELS } from '../../domain/models/Event';
import type { TicketType } from '../../../inventory/domain/Ticket';
import { formatDate } from '../../../../core/utils/formatDate';
import { formatCurrency } from '../../../../core/utils/formatCurrency';

const GRADIENTS = [
  'from-violet-600 via-purple-600 to-indigo-700',
  'from-rose-500 via-pink-600 to-purple-600',
  'from-amber-500 via-orange-600 to-red-600',
  'from-emerald-500 via-[#0064D2] to-blue-700',
  'from-cyan-500 via-blue-600 to-[#0064D2]',
  'from-fuchsia-600 via-pink-500 to-rose-600',
];

function gradientFor(id: string): string {
  const idx =
    id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[idx];
}

interface EventCardProps {
  event: Event;
  ticketTypes?: TicketType[];
}

export function EventCard({ event, ticketTypes }: EventCardProps) {
  const navigate = useNavigate();
  const minPrice = ticketTypes?.length
    ? Math.min(...ticketTypes.map((t) => t.price))
    : null;

  const categoryLabel = event.category
    ? CATEGORY_LABELS[event.category] ?? event.category
    : 'Event';

  return (
    <div
      onClick={() => navigate(`/checkout/${event.id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col h-full border border-gray-100/60"
    >
      {/* Cover Image / Gradient */}
      <div
        className={`relative h-48 flex items-center justify-center overflow-hidden shrink-0 ${
          event.image_url ? '' : `bg-gradient-to-br ${gradientFor(event.id)}`
        }`}
      >
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-black/10 blur-xl pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Calendar className="w-8 h-8" />
            </div>
          </>
        )}

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
            {categoryLabel}
          </span>
          <span className="bg-black/40 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20">
            Official
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-[#0064D2] transition-colors line-clamp-2">
            {event.name}
          </h3>

          {event.description && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{event.description}</p>
          )}

          <div className="space-y-2 text-sm text-gray-500 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0064D2] flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-gray-700">{formatDate(event.date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-orange-50 text-[#FF6100] flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="truncate text-gray-600 font-medium">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Mulai dari</p>
            <p className="font-extrabold text-gray-900 text-lg">
              {minPrice != null ? formatCurrency(minPrice) : 'Lihat Tiket'}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/checkout/${event.id}`);
            }}
            className="bg-[#FF6100] hover:bg-[#E55500] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/20 group-hover:shadow-lg transition-all"
          >
            Beli Tiket
          </button>
        </div>
      </div>
    </div>
  );
}
