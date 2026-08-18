import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Percent } from 'lucide-react';
import type { Event } from '../../domain/models/Event';
import { CATEGORY_LABELS } from '../../domain/models/Event';
import type { TicketType } from '../../../inventory/domain/Ticket';
import { formatDate } from '../../../../core/utils/formatDate';
import { formatCurrency } from '../../../../core/utils/formatCurrency';
import { useActivePromos } from '../../../admin/application/useAdminPromos';

const GRADIENTS = [
  'from-violet-600 via-purple-600 to-indigo-700',
  'from-rose-500 via-pink-600 to-purple-600',
  'from-amber-500 via-orange-600 to-red-600',
  'from-emerald-500 via-[#0064D2] to-blue-700',
  'from-cyan-500 via-blue-600 to-[#0064D2]',
  'from-fuchsia-600 via-pink-500 to-rose-600',
];

function gradientFor(id: string): string {
  const idx =
    id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % GRADIENTS.length;
  return GRADIENTS[idx];
}

interface EventCardProps {
  event: Event;
  ticketTypes?: TicketType[];
}

export function EventCard({ event, ticketTypes }: EventCardProps) {
  const navigate = useNavigate();
  const { data: activePromos = [] } = useActivePromos();

  const minPrice = ticketTypes?.length
    ? Math.min(...ticketTypes.map((t) => t.price))
    : null;

  // Hanya diskon & coret harga jika ada PROMO EVENT khusus untuk konser ini (Voucher tidak mencoret harga di awal)
  const eventPromo = activePromos.find(
    (p) => p.type === 'PROMO' && p.event_id === event.id
  );

  let discountedPrice: number | null = null;
  if (minPrice != null && eventPromo) {
    let discount = 0;
    if (eventPromo.discount_type === 'PERCENTAGE') {
      discount = (minPrice * eventPromo.discount_value) / 100;
      if (eventPromo.max_discount_amount > 0 && discount > eventPromo.max_discount_amount) {
        discount = eventPromo.max_discount_amount;
      }
    } else {
      discount = eventPromo.discount_value;
    }
    discountedPrice = Math.max(0, minPrice - discount);
  }

  const categoryLabel = event.category
    ? CATEGORY_LABELS[event.category] ?? event.category
    : 'Event';

  return (
    <div
      onClick={() => navigate(`/checkout/${event.id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col h-full border border-gray-100/60 relative"
    >
      {/* Cover Image / Gradient */}
      <div
        className={`relative h-48 flex items-center justify-center overflow-hidden shrink-0 ${
          event.image_url ? '' : `bg-gradient-to-br ${gradientFor(event.id)}`
        }`}
      >
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-black/10 blur-xl pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Calendar className="w-8 h-8" />
            </div>
          </>
        )}

        {/* Promo Event Discount Badge - HANYA MUNCUL JIKA ADA PROMO EVENT */}
        {eventPromo && (
          <div className="absolute top-3 left-3 bg-[#FF385C] text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-lg flex items-center gap-1 z-10 animate-pulse">
            <Percent className="w-3.5 h-3.5" />
            <span>
              {eventPromo.discount_type === 'PERCENTAGE'
                ? `Diskon ${eventPromo.discount_value}%`
                : `Hemat ${formatCurrency(eventPromo.discount_value)}`}
            </span>
          </div>
        )}

        {/* Top-Right Category Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="bg-black/50 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-[#0064D2] transition-colors line-clamp-2">
            {event.name}
          </h3>

          {event.description && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{event.description}</p>
          )}

          <div className="space-y-2 text-sm text-gray-500 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-50 text-[#0064D2] flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-gray-700">{formatDate(event.date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-orange-50 text-[#FF6100] flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="truncate text-gray-600 font-medium">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div>
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Mulai dari</p>
            {discountedPrice != null && minPrice != null ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-[#FF385C] text-lg">
                  {formatCurrency(discountedPrice)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(minPrice)}
                </span>
              </div>
            ) : (
              <p className="font-extrabold text-gray-900 text-lg">
                {minPrice != null ? formatCurrency(minPrice) : 'Lihat Tiket'}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/checkout/${event.id}`);
            }}
            className="bg-[#FF6100] hover:bg-[#E55500] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/20 group-hover:shadow-lg transition-all cursor-pointer"
          >
            Beli Tiket
          </button>
        </div>
      </div>
    </div>
  );
}
