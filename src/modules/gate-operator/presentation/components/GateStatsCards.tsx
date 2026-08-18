import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface GateStatsCardsProps {
  admittedCount: number;
  rejectedCount: number;
  sessionDisplay: string;
}

export function GateStatsCards({
  admittedCount,
  rejectedCount,
  sessionDisplay,
}: GateStatsCardsProps) {
  const stats = [
    {
      label: 'Admitted (Masuk)',
      value: admittedCount,
      iconColor: 'text-emerald-500',
      valueColor: 'text-emerald-600',
      labelColor: 'text-emerald-600',
      icon: CheckCircle2,
    },
    {
      label: 'Ditolak',
      value: rejectedCount,
      iconColor: 'text-red-500',
      valueColor: 'text-red-600',
      labelColor: 'text-red-600',
      icon: XCircle,
    },
    {
      label: 'Durasi Sesi',
      value: sessionDisplay,
      iconColor: 'text-[#0064D2]',
      valueColor: 'text-gray-900',
      labelColor: 'text-gray-500',
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center"
        >
          <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.iconColor}`} />
          <p className={`text-2xl font-black ${s.valueColor}`}>{s.value}</p>
          <p className={`text-[11px] font-medium ${s.labelColor}`}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
