import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock } from 'lucide-react';
import type { Event } from '../../../events/domain/models/Event';
import { CATEGORY_LABELS } from '../../../events/domain/models/Event';
import { formatDate } from '../../../../core/utils/formatDate';

const GRADIENTS = [
  'from-violet-600 via-purple-600 to-indigo-700',
  'from-rose-500 via-pink-600 to-purple-600',
  'from-amber-500 via-orange-600 to-red-600',
  'from-emerald-500 via-[#0064D2] to-blue-700',
  'from-cyan-500 via-blue-600 to-[#0064D2]',
  'from-fuchsia-600 via-pink-500 to-rose-600',
];

function gradientFor(id: string): string {
  return GRADIENTS[id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % GRADIENTS.length];
}

interface OrganizerEventCardProps {
  event: Event;
  onOpenMetrics: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  isDeleting: boolean;
}

export function OrganizerEventCard({
  event,
  onOpenMetrics,
  onDelete,
  isDeleting,
}: OrganizerEventCardProps) {
  const navigate = useNavigate();
  const categoryLabel = event.category ? CATEGORY_LABELS[event.category] ?? event.category : 'Event';

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col transition-all duration-300">
      {/* Banner */}
      <div className={`relative h-40 flex items-center justify-center overflow-hidden ${event.image_url ? '' : `bg-gradient-to-br ${gradientFor(event.id)}`}`}>
        {event.image_url ? (
          <img src={event.image_url} alt={event.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-md">
            <Calendar className="w-7 h-7" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span className="bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-black text-gray-900 leading-snug mb-2 line-clamp-2">
            {event.name}
          </h2>
          {event.description && (
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{event.description}</p>
          )}
          <div className="space-y-1.5 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#0064D2] shrink-0" />
              <span className="font-medium text-gray-700">{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{new Date(event.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="truncate text-gray-700">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onOpenMetrics(event.id)}
            className="w-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-[#0064D2] font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Lihat Metrik Penjualan
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate(`/organizer/events/${event.id}/ticket-types`)}
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Kelola Tiket
            </button>
            <button
              onClick={() => navigate(`/organizer/events/${event.id}/gate-operators`)}
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Gate Operator
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate(`/organizer/events/${event.id}/edit`)}
              className="flex items-center justify-center bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(event.id, event.name)}
              disabled={isDeleting}
              className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
