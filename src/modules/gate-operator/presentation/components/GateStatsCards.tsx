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
      color: 'text-emerald-400',
      icon: CheckCircle2,
    },
    {
      label: 'Ditolak',
      value: rejectedCount,
      color: 'text-red-400',
      icon: XCircle,
    },
    {
      label: 'Durasi Sesi',
      value: sessionDisplay,
      color: 'text-blue-400',
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-center"
        >
          <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
          <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
          <p className="text-[11px] text-gray-500 font-medium">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
