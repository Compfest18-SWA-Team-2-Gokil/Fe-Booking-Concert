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
              aria-label="Salin Link"
              className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/80 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onShare('wa')}
              title="Bagikan ke WhatsApp"
              aria-label="Bagikan ke WhatsApp"
              className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.586 1.761.88 2.79.88 3.182 0 5.768-2.587 5.768-5.766.001-3.187-2.575-5.766-5.767-5.766zm9.969 5.766c0 5.405-4.394 9.799-9.799 9.799-1.745 0-3.376-.46-4.797-1.258l-5.403 1.414 1.442-5.271c-.917-1.488-1.442-3.238-1.442-5.11 0-5.405 4.394-9.799 9.799-9.799 5.405 0 9.799 4.394 9.799 9.799z" />
              </svg>
            </button>
            <button
              onClick={() => onShare('x')}
              title="Bagikan ke Twitter / X"
              aria-label="Bagikan ke Twitter / X"
              className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              onClick={() => onShare('fb')}
              title="Bagikan ke Facebook"
              aria-label="Bagikan ke Facebook"
              className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1877F2] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
