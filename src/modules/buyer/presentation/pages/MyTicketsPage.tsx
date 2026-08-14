import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, ArrowRight, RefreshCw, ExternalLink } from 'lucide-react';
import { useQueries, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../auth/application/useAuth';
import {
  getStoredOrders,
  getOrder,
  requestRefund,
  type OrderStatus,
} from '../../../orders/infrastructure/ordersApi';
import { showAlert } from '../../../../shared/utils/alert';

const STATUS_CONFIG: Record<OrderStatus, { label: string; style: string; dot: string }> = {
  PENDING: {
    label: 'Menunggu Bayar',
    style: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
  PAYMENT_PENDING: {
    label: 'Menunggu Bayar',
    style: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
  PAID: {
    label: 'Aktif',
    style: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    style: 'bg-gray-100 text-gray-500 border border-gray-200',
    dot: 'bg-gray-400',
  },
  REFUND_REQUESTED: {
    label: 'Refund Diminta',
    style: 'bg-orange-50 text-orange-700 border border-orange-200',
    dot: 'bg-orange-500',
  },
  REFUNDED: {
    label: 'Direfund',
    style: 'bg-gray-100 text-gray-500 border border-gray-200',
    dot: 'bg-gray-400',
  },
};

export function MyTicketsPage() {
  const { user } = useAuth();
  const storedOrders = getStoredOrders();
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundedIds, setRefundedIds] = useState<Set<string>>(new Set());

  const orderQueries = useQueries({
    queries: storedOrders.map((o) => ({
      queryKey: ['order', o.orderId],
      queryFn: () => getOrder(o.orderId),
      retry: false,
    })),
  });

  const refund = useMutation({
    mutationFn: (orderId: string) => requestRefund(orderId),
    onSuccess: (_, orderId) => {
      setRefundedIds((prev) => new Set([...prev, orderId]));
      setRefundingId(null);
      showAlert.success(
        'Pengajuan Refund Berhasil',
        'Permintaan refund tiket telah dicatat. Tim kami akan memproses pengembalian dana.'
      );
    },
    onError: () => {
      setRefundingId(null);
      showAlert.error(
        'Gagal Mengajukan Refund',
        'Terjadi kendala saat mengajukan refund. Silakan coba kembali beberapa saat lagi.'
      );
    },
  });

  async function handleRefundClick(orderId: string, eventName: string) {
    const isConfirmed = await showAlert.confirm({
      title: 'Ajukan Refund Tiket?',
      text: `Apakah kamu yakin ingin mengajukan refund untuk pesanan "${eventName}"?`,
      confirmText: 'Ya, Ajukan Refund',
      cancelText: 'Batalkan',
      icon: 'warning',
      isDanger: true,
    });

    if (isConfirmed) {
      setRefundingId(orderId);
      refund.mutate(orderId);
    }
  }

  const tickets = storedOrders.map((stored, i) => ({
    stored,
    order: orderQueries[i]?.data ?? null,
    isLoading: orderQueries[i]?.isLoading ?? false,
  }));

  const activeCount = tickets.filter((t) => t.order?.status === 'PAID').length;
  const pendingCount = tickets.filter(
    (t) => t.order?.status === 'PENDING' || t.order?.status === 'PAYMENT_PENDING'
  ).length;

  if (storedOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#0064D2] flex items-center justify-center shadow-md shadow-blue-200">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tiket Saya</h1>
              <p className="text-sm text-gray-500">Halo, {user?.name}</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <Ticket className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Tiket</h2>
            <p className="text-gray-500 text-sm mb-6">Tiketmu akan muncul di sini setelah pembayaran berhasil dikonfirmasi.</p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-[#0064D2] text-white font-bold px-5 py-3 rounded-xl hover:bg-[#0052B0] transition-colors text-sm"
            >
              Cari Event <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#0064D2] flex items-center justify-center shadow-md shadow-blue-200">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tiket Saya</h1>
              <p className="text-sm text-gray-500">Halo, {user?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Total Pesanan', value: storedOrders.length, color: 'text-[#0064D2]' },
              { label: 'Tiket Aktif', value: activeCount, color: 'text-emerald-600' },
              { label: 'Menunggu Bayar', value: pendingCount, color: 'text-amber-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {tickets.map(({ stored, order, isLoading }) => {
            const status = order?.status ?? 'PENDING';
            const isRefunded = refundedIds.has(stored.orderId);
            const effectiveStatus: OrderStatus = isRefunded ? 'REFUND_REQUESTED' : status;
            const effectiveSt = STATUS_CONFIG[effectiveStatus];

            return (
              <div
                key={stored.orderId}
                className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md ${
                  status === 'CANCELLED' || status === 'REFUNDED' ? 'opacity-60' : ''
                }`}
              >
                <div className="h-1.5 bg-gradient-to-r from-[#0064D2] to-blue-400" />
                <div className="p-5 sm:p-6">
                  {isLoading ? (
                    <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${effectiveSt.style}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${effectiveSt.dot}`} />
                            {effectiveSt.label}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono truncate max-w-[120px]">{stored.orderId}</span>
                        </div>
                        <h2 className="font-black text-gray-900 text-lg leading-snug truncate mb-1">{stored.eventName}</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Ticket className="w-3.5 h-3.5 shrink-0" />
                            {stored.unitIds.length} tiket
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            {new Date(stored.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stored.totalAmount)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        {(status === 'PENDING' || status === 'PAYMENT_PENDING') && (
                          <a
                            href="/my-tickets"
                            onClick={(e) => { e.preventDefault(); window.location.reload(); }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-[#0064D2] hover:underline"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Cek Status
                          </a>
                        )}
                        {status === 'PAID' && !isRefunded && (
                          <button
                            onClick={() => handleRefundClick(stored.orderId, stored.eventName)}
                            disabled={refund.isPending && refundingId === stored.orderId}
                            className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {refund.isPending && refundingId === stored.orderId ? 'Memproses...' : 'Minta Refund'}
                          </button>
                        )}
                        <a
                          href={`/events`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Detail Event
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-[#0064D2] font-semibold text-sm hover:underline"
          >
            Cari event lainnya <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
