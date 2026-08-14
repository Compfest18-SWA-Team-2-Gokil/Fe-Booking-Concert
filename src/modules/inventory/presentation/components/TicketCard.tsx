import type { TicketType } from '../../domain/Ticket';
import { formatCurrency } from '../../../../core/utils/formatCurrency';

interface TicketCardProps {
  ticketType: TicketType;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export function TicketCard({ ticketType, quantity, onQuantityChange }: TicketCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-extrabold text-gray-900 text-lg">{ticketType.name}</h3>
          <span className="inline-block mt-1 text-xs bg-blue-50 text-[#0064D2] px-2.5 py-0.5 rounded-full font-bold">
            {ticketType.kind === 'GA' ? 'General Admission' : 'Seated Category'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 font-medium">Harga / Tiket</p>
          <p className="font-black text-gray-900 text-xl">{formatCurrency(ticketType.price)}</p>
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-500 mb-5">
        Sisa Kuota Available: <span className="text-gray-900 font-bold">{ticketType.total_quota} Tiket</span>
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pilih Jumlah Tiket</span>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-800 hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={quantity === 0}
            >
              −
            </button>
            <span className="w-8 text-center font-extrabold text-gray-900 text-sm">{quantity}</span>
            <button
              onClick={() => onQuantityChange(Math.min(ticketType.total_quota, quantity + 1))}
              className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-800 hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={quantity >= ticketType.total_quota}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {quantity > 0 && (
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex justify-between items-center text-sm">
          <span className="text-gray-500 font-medium">Subtotal Category</span>
          <span className="font-extrabold text-[#0064D2]">{formatCurrency(ticketType.price * quantity)}</span>
        </div>
      )}
    </div>
  );
}
