import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Users } from 'lucide-react';
import { useEvents } from '../../../events/application/useEvents';
import axiosInstance from '../../../../core/api/axiosInstance';
import { showAlert } from '../../../../shared/utils/alert';

export function GateOperatorPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { data: events } = useEvents();
  const event = events?.find((e) => e.id === eventId);

  const [userId, setUserId] = useState('');

  const assign = useMutation({
    mutationFn: (uid: string) =>
      axiosInstance
        .post<{ status: string }>(`/api/v1/events/${eventId}/gate-operators`, { user_id: uid })
        .then((r) => r.data),
    onSuccess: () => {
      setUserId('');
      showAlert.success(
        'Operator Ditambahkan',
        'Gate operator berhasil diberikan hak akses scanning untuk event ini.'
      );
    },
    onError: () => {
      showAlert.error(
        'Gagal Menambahkan Operator',
        'Pastikan User ID valid (format UUID) dan akun memiliki role GATE_OPERATOR.'
      );
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId.trim()) return;
    assign.mutate(userId.trim());
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/organizer/dashboard')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-bold text-gray-900 truncate">
            {event?.name ?? 'Gate Operators'}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0064D2]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Assign Gate Operator</h1>
              <p className="text-sm text-gray-500">{event?.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">User ID Gate Operator</label>
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Masukkan User ID (UUID) gate operator"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:border-transparent text-sm font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">
                User harus sudah terdaftar dengan role GATE_OPERATOR.
              </p>
            </div>

            <button
              type="submit"
              disabled={assign.isPending || !userId.trim()}
              className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3.5 rounded-xl font-extrabold shadow-md transition-colors disabled:opacity-60 cursor-pointer"
            >
              {assign.isPending ? 'Menyimpan...' : 'Assign Gate Operator'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
