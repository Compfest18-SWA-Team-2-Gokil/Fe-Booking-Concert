import { AlertCircle } from 'lucide-react';

export function GateEmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-8 text-center max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">Belum Ada Tugas Event</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
        Akun Anda belum ditugaskan ke event mana pun oleh Organizer. Silakan hubungi koordinator acara untuk mendapatkan penugasan.
      </p>
    </div>
  );
}
