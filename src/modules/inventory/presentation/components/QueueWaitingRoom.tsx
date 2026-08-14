import { Hourglass } from 'lucide-react';

interface QueueWaitingRoomProps {
  position?: number;
}

export function QueueWaitingRoom({ position }: QueueWaitingRoomProps) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      {/* Animated pulse ring */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-blue-50 text-[#0064D2] flex items-center justify-center animate-pulse shadow-md">
          <Hourglass className="w-10 h-10 text-[#0064D2]" />
        </div>
        <div className="absolute inset-0 rounded-3xl border-4 border-[#0064D2]/30 animate-ping pointer-events-none" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Kamu Sedang dalam Antrian</h2>
      <p className="text-gray-500 mb-6 max-w-md text-sm leading-relaxed">
        Kami sedang memproses antrianmu. Halaman ini akan otomatis diperbarui ketika giliranmu tiba.
      </p>

      {position != null && (
        <div className="bg-blue-50/80 border border-blue-100 rounded-2xl px-10 py-6 mb-6 shadow-inner">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Posisi Antrian Kamu</p>
          <p className="text-5xl font-black text-[#0064D2]">#{position}</p>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
        <div className="w-2 h-2 rounded-full bg-[#0064D2] animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-[#0064D2] animate-bounce [animation-delay:0.15s]" />
        <div className="w-2 h-2 rounded-full bg-[#0064D2] animate-bounce [animation-delay:0.3s]" />
        <span className="ml-1">Memeriksa status antrian setiap 3 detik...</span>
      </div>
    </div>
  );
}
