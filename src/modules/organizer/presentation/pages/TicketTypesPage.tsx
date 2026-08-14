import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, CheckCircle2, Ticket } from 'lucide-react';
import { useEvents } from '../../../events/application/useEvents';
import { useTicketTypes } from '../../../events/application/useTicketTypes';
import axiosInstance from '../../../../core/api/axiosInstance';
import { formatCurrency } from '../../../../core/utils/formatCurrency';
import { showAlert, showToast } from '../../../../shared/utils/alert';

interface TicketType {
  id: string;
  event_id: string;
  name: string;
  price: number;
  kind: 'GA' | 'SEATED';
  total_quota: number;
  price_status: 'OPEN' | 'LOCKED';
}

interface CreateTicketTypePayload {
  name: string;
  price: number;
  kind: 'GA' | 'SEATED';
  total_quota: number;
}

export function TicketTypesPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: events } = useEvents();
  const { data: ticketTypes, isLoading } = useTicketTypes(eventId ?? '');
  const event = events?.find((e) => e.id === eventId);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [kind, setKind] = useState<'GA' | 'SEATED'>('GA');
  const [quota, setQuota] = useState('');
  const [provisionQty, setProvisionQty] = useState<Record<string, string>>({});

  const createType = useMutation({
    mutationFn: (payload: CreateTicketTypePayload) =>
      axiosInstance
        .post<TicketType>(`/api/v1/events/${eventId}/ticket-types`, payload)
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ticket-types', eventId] });
      showToast.success('Kategori tiket berhasil ditambahkan!');
      setShowForm(false);
      setName(''); setPrice(''); setQuota(''); setKind('GA');
    },
    onError: () => {
      showAlert.error('Gagal Menambahkan Tiket', 'Pastikan nama, harga, dan kuota valid.');
    },
  });

  const provision = useMutation({
    mutationFn: ({ ticketTypeId, quantity }: { ticketTypeId: string; quantity: number }) =>
      axiosInstance
        .post(`/api/v1/events/${eventId}/ticket-types/${ticketTypeId}/provision`, { quantity })
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ticket-types', eventId] });
      showToast.success('Berhasil melakukan provision tiket!');
    },
    onError: () => {
      showAlert.error('Gagal Provision', 'Terjadi kesalahan saat memproses unit tiket.');
    },
  });

  async function handleProvisionClick(ticketTypeId: string, ticketName: string) {
    const qty = Number(provisionQty[ticketTypeId]);
    if (!qty || qty <= 0) {
      showAlert.warning('Jumlah Tidak Valid', 'Silakan masukkan jumlah unit yang ingin di-provision.');
      return;
    }

    const isConfirmed = await showAlert.confirm({
      title: 'Provision Unit Tiket?',
      text: `Tambahkan ${qty} unit tiket untuk kategori "${ticketName}"?`,
      confirmText: 'Ya, Provision',
      cancelText: 'Batal',
      icon: 'question',
    });

    if (isConfirmed) {
      provision.mutate({ ticketTypeId, quantity: qty });
    }
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createType.mutate({ name, price: Number(price), kind, total_quota: Number(quota) });
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/organizer/dashboard')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-bold text-gray-900 truncate">{event?.name ?? 'Ticket Types'}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Kelola Ticket Types</h1>
            <p className="text-sm text-gray-500 mt-1">{event?.name}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-[#0064D2] text-white font-bold px-4 py-2.5 rounded-xl shadow-md hover:bg-[#0052B0] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Tipe Tiket
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4">Tipe Tiket Baru</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-1">Nama Kategori</label>
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="cth. Festival GA / VIP Standing"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Harga (Rp)</label>
                  <input
                    type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                    placeholder="350000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Total Kuota</label>
                  <input
                    type="number" required min="1" value={quota} onChange={(e) => setQuota(e.target.value)}
                    placeholder="1000"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-900 mb-1">Tipe</label>
                  <div className="flex gap-3">
                    {(['GA', 'SEATED'] as const).map((k) => (
                      <button
                        key={k} type="button" onClick={() => setKind(k)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-colors ${kind === k ? 'border-[#0064D2] bg-blue-50 text-[#0064D2]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                      >
                        {k === 'GA' ? 'General Admission' : 'Seated'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {createType.isError && (
                <p className="text-red-600 text-sm">Gagal membuat ticket type. Coba lagi.</p>
              )}
              <div className="flex gap-3">
                <button type="submit" disabled={createType.isPending}
                  className="flex-1 bg-[#0064D2] text-white font-bold py-2.5 rounded-xl hover:bg-[#0052B0] disabled:opacity-60 transition-colors text-sm"
                >
                  {createType.isPending ? 'Menyimpan...' : 'Simpan Ticket Type'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ticket Types List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : ticketTypes && ticketTypes.length > 0 ? (
          ticketTypes.map((tt) => (
            <div key={tt.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">{tt.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs font-bold bg-blue-50 text-[#0064D2] px-2.5 py-0.5 rounded-full">
                      {tt.kind === 'GA' ? 'General Admission' : 'Seated'}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${tt.price_status === 'LOCKED' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                      {tt.price_status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-900">{formatCurrency(tt.price)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Kuota: {tt.total_quota}</p>
                </div>
              </div>

              {/* Provision Units */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" />
                  Provision Tiket Unit
                </p>
                <div className="flex gap-3">
                  <input
                    type="number" min="1" max={tt.total_quota}
                    value={provisionQty[tt.id] ?? ''}
                    onChange={(e) => setProvisionQty((p) => ({ ...p, [tt.id]: e.target.value }))}
                    placeholder="Jumlah unit"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
                  />
                  <button
                    onClick={() => handleProvisionClick(tt.id, tt.name)}
                    disabled={provision.isPending || !provisionQty[tt.id]}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Provision
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm text-gray-500">
            Belum ada ticket type. Tambahkan yang pertama!
          </div>
        )}
      </div>
    </div>
  );
}
