import { Calendar, MapPin, Ticket, Copy } from 'lucide-react';
import type { Event } from '../../../domain/models/Event';
import { formatDate } from '../../../../../core/utils/formatDate';
import { formatCurrency } from '../../../../../core/utils/formatCurrency';

interface EventDetailSidebarProps {
  event: Event;
  categoryLabel: string;
  minPrice: number | null;
  onBuyTicket: () => void;
  onShare: (platform?: 'wa' | 'x' | 'fb') => void;
}

export function EventDetailSidebar({
  event,
  categoryLabel,
  minPrice,
  onBuyTicket,
  onShare,
}: EventDetailSidebarProps) {
  return (
    <div className="lg:sticky lg:top-24 space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div>
          <span className="inline-block bg-blue-50 text-[#0064D2] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            {categoryLabel}
          </span>
          <h1 className="text-2xl font-black text-gray-900 leading-snug">{event.name}</h1>
        </div>

        <div className="space-y-3.5 pt-4 border-t border-gray-100 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Tanggal & Waktu</p>
              <p className="font-bold text-gray-800">{formatDate(event.date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#0064D2] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Tempat / Lokasi</p>
              <p className="font-bold text-gray-800">{event.location}</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Harga Mulai Dari</p>
          <p className="text-3xl font-black text-gray-900 mt-1">
            {minPrice !== null ? formatCurrency(minPrice) : 'Segera Hadir'}
          </p>
        </div>

        <button
          onClick={onBuyTicket}
          className="w-full bg-gradient-to-r from-[#FF6100] to-orange-600 hover:from-[#E55500] hover:to-orange-700 text-white py-4 rounded-2xl font-black text-base shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Beli Tiket Sekarang</span>
          <Ticket className="w-5 h-5" />
        </button>

        {/* Share Section */}
        <div className="pt-5 border-t border-gray-100 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Bagikan Event</p>
          <div className="flex items-center justify-center gap-2.5">
            <button
              onClick={() => onShare()}
              title="Salin Link"
              className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onShare('wa')}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-xs transition-colors cursor-pointer"
            >
              WhatsApp
            </button>
            <button
              onClick={() => onShare('x')}
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
            >
              Twitter / X
            </button>
            <button
              onClick={() => onShare('fb')}
              className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
