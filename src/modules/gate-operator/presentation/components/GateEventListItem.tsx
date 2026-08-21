import { Calendar, MapPin, Tag, CheckCircle2, Clock } from 'lucide-react';
import type { AssignedEvent } from '../../infrastructure/checkinApi';
import { formatDate } from '../../../../core/utils/formatDate';

export function GateEventListItem({ event }: { event: AssignedEvent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
      {event.image_url ? (
        <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100 relative">
          <img src={event.image_url} alt={event.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full sm:w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center text-[#0064D2] shrink-0 border border-blue-100">
          <Calendar className="w-7 h-7 opacity-60" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Tugas Aktif
          </span>
          {event.category && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#0064D2] border border-blue-100">
              <Tag className="w-3 h-3" />
              {event.category}
            </span>
          )}
        </div>

        <h3 className="font-extrabold text-base text-gray-900 mb-1">{event.name}</h3>
        {event.description && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-2 leading-relaxed">{event.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
