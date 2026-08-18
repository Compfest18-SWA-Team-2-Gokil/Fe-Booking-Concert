import { Search } from 'lucide-react';

interface OrganizerRefundsFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  pendingCount: number;
  waitingAdminCount: number;
  completedCount: number;
}

export function OrganizerRefundsFilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  pendingCount,
  waitingAdminCount,
  completedCount,
}: OrganizerRefundsFilterBarProps) {
  const tabs = [
    { id: 'ALL', label: 'Semua' },
    {
      id: 'REFUND_REQUESTED',
      label: pendingCount > 0 ? `Perlu Disetujui (${pendingCount})` : 'Perlu Disetujui',
    },
    {
      id: 'REFUND_ORGANIZER_APPROVED',
      label: waitingAdminCount > 0 ? `Menunggu Admin (${waitingAdminCount})` : 'Menunggu Admin',
    },
    {
      id: 'REFUNDED',
      label: completedCount > 0 ? `Selesai (${completedCount})` : 'Selesai',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
      <div className="relative w-full sm:w-96">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari Order ID, email pembeli, nama event..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:bg-white transition-all"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onStatusFilterChange(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-[#0064D2] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
