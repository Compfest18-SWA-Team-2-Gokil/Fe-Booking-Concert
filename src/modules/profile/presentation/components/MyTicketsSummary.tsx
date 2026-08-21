import { Link } from 'react-router-dom';
import { Ticket, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../../../orders/infrastructure/ordersApi';
import type { Order } from '../../../orders/infrastructure/ordersApi';

const STATUS_LABEL: Record<string, { text: string; className: string }> = {
  PAID: { text: 'Berhasil', className: 'bg-emerald-100 text-emerald-700' },
  PAYMENT_PENDING: { text: 'Menunggu', className: 'bg-yellow-100 text-yellow-700' },
  PENDING: { text: 'Pending', className: 'bg-gray-100 text-gray-600' },
  CANCELLED: { text: 'Dibatalkan', className: 'bg-red-100 text-red-600' },
  REFUND_REQUESTED: { text: 'Refund Diminta', className: 'bg-orange-100 text-orange-700' },
  REFUNDED: { text: 'Dana Dikembalikan', className: 'bg-blue-100 text-blue-700' },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

export function MyTicketsSummary() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders-summary'],
    queryFn: () => getMyOrders(1, 5),
  });

  const orders: Order[] = data?.orders ?? [];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-[#0064D2]" />
          <h2 className="text-sm font-bold text-gray-800">Tiket Saya</h2>
        </div>
        <Link
          to="/my-tickets"
          className="flex items-center gap-1 text-[#0064D2] text-xs font-bold hover:underline"
        >
          Lihat Semua <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-[#0064D2]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-400">Belum ada tiket</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {orders.map((order) => {
            const status = STATUS_LABEL[order.status] ?? { text: order.status, className: 'bg-gray-100 text-gray-600' };
            return (
              <li
                key={order.id}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {order.event_name ?? 'Event'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-xs font-bold text-gray-700">{formatCurrency(order.total_amount)}</p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${status.className}`}>
                    {status.text}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
