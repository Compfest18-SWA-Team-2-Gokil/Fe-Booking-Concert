import { Building2, Plus } from 'lucide-react';

interface OrganizerWorkspaceHeaderProps {
  onCreateEvent: () => void;
}

export function OrganizerWorkspaceHeader({ onCreateEvent }: OrganizerWorkspaceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#0064D2]">
            <Building2 className="w-3.5 h-3.5" /> Organizer Workspace Hub
          </span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Pusat Kontrol & Event Organizer
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitoring penjualan tiket, kuota real-time, serta kelola seluruh event Anda.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onCreateEvent}
          className="flex items-center gap-2 bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold px-5 py-2.5 rounded-2xl shadow-sm text-xs cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Event Baru</span>
        </button>
      </div>
    </div>
  );
}
