import { useState } from 'react';
import { X, Send } from 'lucide-react';
import type { OverrideOrderPayload } from '../../infrastructure/adminApi';

interface OverrideStatusModalProps {
  orderId: string;
  initialStatus: OverrideOrderPayload['status'];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: OverrideOrderPayload) => void;
}

export function OverrideStatusModal({
  orderId,
  initialStatus,
  isSubmitting,
  onClose,
  onSubmit,
}: OverrideStatusModalProps) {
  const [status, setStatus] = useState<OverrideOrderPayload['status']>(initialStatus);
  const [reason, setReason] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit({ status, reason: reason.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-lg text-gray-900">Manual Override Status Order</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Order ID</label>
            <input
              type="text"
              value={orderId}
              disabled
              className="w-full bg-gray-100 border border-gray-200 text-gray-800 rounded-xl px-3 py-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Status Baru</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OverrideOrderPayload['status'])}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#0064D2] focus:outline-none font-bold"
            >
              <option value="PAID">PAID (Konfirmasi Lunas)</option>
              <option value="REFUNDED">REFUNDED (Setujui Pengembalian Dana)</option>
              <option value="CANCELLED">CANCELLED (Batalkan Pesanan)</option>
              <option value="PAYMENT_DISCREPANCY">PAYMENT_DISCREPANCY (Tandai Anomali)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Alasan Override <span className="text-red-500">* (Wajib untuk Audit Log)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Pembeli telah transfer manual / Kompensasi kendala payment gateway"
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
              disabled={isSubmitting || !reason.trim()}
              className="flex-1 bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Memproses...' : 'Simpan Override'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
