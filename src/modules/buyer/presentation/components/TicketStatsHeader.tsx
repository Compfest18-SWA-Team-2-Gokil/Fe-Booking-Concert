interface TicketStatsHeaderProps {
  totalOrders: number;
  activeCount: number;
  pendingCount: number;
}

export function TicketStatsHeader({
  totalOrders,
  activeCount,
  pendingCount,
}: TicketStatsHeaderProps) {
  const stats = [
    { label: 'Total Pesanan', value: totalOrders, color: 'text-[#0064D2]' },
    { label: 'Tiket Aktif', value: activeCount, color: 'text-emerald-600' },
    { label: 'Menunggu Bayar', value: pendingCount, color: 'text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center"
        >
          <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
