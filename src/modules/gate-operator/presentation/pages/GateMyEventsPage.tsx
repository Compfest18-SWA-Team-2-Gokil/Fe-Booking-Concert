import { CalendarCheck, ShieldCheck } from 'lucide-react';
import { useAssignedEvents } from '../../application/useAssignedEvents';
import { GateEventListItem } from '../components/GateEventListItem';
import { GateEmptyState } from '../components/GateEmptyState';
import { Spinner } from '../../../../shared/components/ui/Spinner';

export function GateMyEventsPage() {
  const { data: events, isLoading, isError, error } = useAssignedEvents();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0064D2] text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Tugas Event Saya</h1>
              <p className="text-xs text-gray-500 mt-0.5">Daftar event aktif tempat Anda ditugaskan sebagai Gate Operator</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0064D2] text-xs font-bold border border-blue-100 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>{events?.length ?? 0} Event Aktif</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="w-8 h-8 text-[#0064D2]" />
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 text-sm">
            {error?.message || 'Gagal memuat daftar event tugas.'}
          </div>
        ) : !events || events.length === 0 ? (
          <GateEmptyState />
        ) : (
          <div className="space-y-3.5">
            {events.map((event) => (
              <GateEventListItem key={event.event_id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
