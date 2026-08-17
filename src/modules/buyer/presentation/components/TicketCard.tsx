import { Ticket, Calendar, MapPin, QrCode, CreditCard, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import type { TicketItem } from '../../application/useMyTickets';
import type { StoredOrder } from '../../../orders/infrastructure/ordersApi';
import { formatCurrency } from '../../../../core/utils/formatCurrency';

const DEFAULT_STATUS_CONFIG = {
  label: 'Menunggu Bayar',
  style: 'bg-amber-50 text-amber-700 border border-amber-200',
  dot: 'bg-amber-500',
};

const STATUS_CONFIG: Record<string, { label: string; style: string; dot: string }> = {
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
    label: 'Tiket Aktif',
    style: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Kedaluwarsa (Batal)',
    style: 'bg-rose-50 text-rose-700 border border-rose-200',
    dot: 'bg-rose-500',
  },
  REFUND_REQUESTED: {
    label: 'Menunggu Persetujuan Organizer',
    style: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
  REFUND_ORGANIZER_APPROVED: {
    label: 'Disetujui Organizer (Proses Admin)',
    style: 'bg-blue-50 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
  },
  REFUNDED: {
    label: 'Telah Direfund (Selesai)',
    style: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  PAYMENT_DISCREPANCY: {
    label: 'Kendala Pembayaran',
    style: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
};

function getStatusConfig(status?: string) {
  if (!status) return DEFAULT_STATUS_CONFIG;
  return STATUS_CONFIG[status.toUpperCase()] || DEFAULT_STATUS_CONFIG;
}

interface TicketCardProps {
  ticket: TicketItem;
  isRefunded: boolean;
  isRefunding: boolean;
  isPaying: boolean;
  onViewQR: (order: StoredOrder) => void;
  onPay: (orderId: string) => void;
  onRefund: (orderId: string, eventName: string) => void;
}

export function TicketCard({
  ticket,
  isRefunded,
  isRefunding,
  isPaying,
  onViewQR,
  onPay,
  onRefund,
}: TicketCardProps) {
  const { stored, order, isLoading } = ticket;
  const status = order?.status ?? 'PENDING';
  const effectiveStatus = isRefunded ? 'REFUND_REQUESTED' : status;
  const effectiveSt = getStatusConfig(effectiveStatus);

  const isExpiredOrCancelled = status === 'CANCELLED';

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md ${
        isExpiredOrCancelled || status === 'REFUNDED' ? 'opacity-75 bg-gray-50/50' : ''
      }`}
    >
      <div className="p-5 sm:p-6">
        {isLoading ? (
          <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${effectiveSt.style}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${effectiveSt.dot}`} />
                  {effectiveSt.label}
                </span>
                <span className="text-[11px] text-gray-400 font-mono truncate max-w-[120px]">
                  {stored.orderId}
                </span>
              </div>
              <h2 className="font-black text-gray-900 text-lg leading-snug truncate mb-1">
                {stored.eventName}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5 shrink-0" />
                  {stored.unitIds.length > 0 ? `${stored.unitIds.length} tiket` : '1 pesanan'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  {new Date(stored.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1 font-semibold text-gray-700">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {formatCurrency(stored.totalAmount)}
                </span>
              </div>

              {isExpiredOrCancelled && (
                <p className="text-xs text-rose-500 font-medium mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Batas waktu pembayaran habis. Kursi/tiket telah dirilis kembali.
                </p>
              )}
            </div>

            <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 items-end">
              {status === 'PAID' && (
                <button
                  onClick={() => onViewQR(stored)}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#0064D2] hover:bg-[#0052B0] px-3.5 py-2 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Lihat E-Ticket (QR)</span>
                </button>
              )}

              {(status === 'PENDING' || status === 'PAYMENT_PENDING') && (
                <>
                  <button
                    onClick={() => onPay(stored.orderId)}
                    disabled={isPaying}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#FF6100] hover:bg-[#E55500] px-3.5 py-2 rounded-xl transition-all shadow-sm shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{isPaying ? 'Membuka...' : 'Bayar Sekarang'}</span>
                  </button>
                  <a
                    href="/my-tickets"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.reload();
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#0064D2] hover:underline"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Cek Status
                  </a>
                </>
              )}

              {status === 'PAID' && !isRefunded && (
                <button
                  onClick={() => onRefund(stored.orderId, stored.eventName)}
                  disabled={isRefunding}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isRefunding ? 'Memproses...' : 'Minta Refund'}
                </button>
              )}

              <a
                href="/events"
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
}
