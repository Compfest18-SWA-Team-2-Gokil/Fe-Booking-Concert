import { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { ReassignTicketPayload } from '../../infrastructure/adminApi';

interface ReassignTicketModalProps {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (unitId: string, payload: ReassignTicketPayload) => void;
}

export function ReassignTicketModal({
  isSubmitting,
  onClose,
  onSubmit,
}: ReassignTicketModalProps) {
  const [unitId, setUnitId] = useState('');
  const [targetOrderId, setTargetOrderId] = useState('');
  const [newSeatNumber, setNewSeatNumber] = useState('');
  const [reason, setReason] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!unitId.trim() || !targetOrderId.trim() || !reason.trim()) return;
    onSubmit(unitId.trim(), {
      target_order_id: targetOrderId.trim(),
      new_seat_number: newSeatNumber.trim() || undefined,
      reason: reason.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-lg text-gray-900">Pindahkan Kepemilikan Tiket</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Ticket Unit ID</label>
            <input
              type="text"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              placeholder="UUID unit tiket yang dipindahkan"
              required
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-[#0064D2] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Target Order ID</label>
            <input
              type="text"
              value={targetOrderId}
              onChange={(e) => setTargetOrderId(e.target.value)}
              placeholder="UUID order penerima tiket"
              required
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-[#0064D2] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Nomor Kursi Baru (Opsional)</label>
            <input
              type="text"
              value={newSeatNumber}
              onChange={(e) => setNewSeatNumber(e.target.value)}
              placeholder="Contoh: VIP-A12"
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#0064D2] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Alasan Reassign <span className="text-red-500">* (Wajib untuk Audit Log)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Sengketa ganti kursi atau pemindahan kepemilikan resmi"
              rows={3}
              required
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#0064D2] focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !unitId.trim() || !targetOrderId.trim() || !reason.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              {isSubmitting ? 'Memindahkan...' : 'Eksekusi Reassign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
