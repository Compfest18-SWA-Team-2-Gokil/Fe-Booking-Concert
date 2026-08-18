import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket } from 'lucide-react';
import { useEvent, useEvents } from '../../application/useEvents';
import { useTicketTypes } from '../../application/useTicketTypes';
import { CATEGORY_LABELS, type Event } from '../../domain/models/Event';
import { showToast } from '../../../../shared/utils/alert';
import { EventDetailHero } from '../components/detail/EventDetailHero';
import { EventDetailTabs, type EventTab } from '../components/detail/EventDetailTabs';
import { EventDetailSidebar } from '../components/detail/EventDetailSidebar';
import { EventDetailRecommendations } from '../components/detail/EventDetailRecommendations';

const GRADIENTS = [
  'from-violet-600 via-purple-600 to-indigo-700',
  'from-rose-500 via-pink-600 to-purple-600',
  'from-amber-500 via-orange-600 to-red-600',
  'from-emerald-500 via-[#0064D2] to-blue-700',
  'from-cyan-500 via-blue-600 to-[#0064D2]',
  'from-fuchsia-600 via-pink-500 to-rose-600',
];

function gradientFor(id: string): string {
  return GRADIENTS[id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENTS.length];
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<EventTab>('deskripsi');

  const { data: event, isLoading: eventLoading } = useEvent(id ?? '');
  const { data: ticketTypes, isLoading: typesLoading } = useTicketTypes(id ?? '');
  const { events: allEvents } = useEvents({ limit: 5 });

  const recommendedEvents = (allEvents ?? []).filter((e: Event) => e.id !== id).slice(0, 4);

  if (eventLoading || typesLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#0064D2] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-8 shadow-sm max-w-md w-full border border-gray-100">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Event Tidak Ditemukan</h2>
          <p className="text-gray-500 text-sm mb-6">Event yang kamu cari tidak tersedia atau telah berakhir.</p>
          <button
            onClick={() => navigate('/events')}
            className="bg-[#0064D2] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md cursor-pointer"
          >
            Lihat Event Lainnya
          </button>
        </div>
      </div>
    );
  }

  const categoryLabel = event.category ? CATEGORY_LABELS[event.category] ?? event.category : 'Event';
  const minPrice = ticketTypes && ticketTypes.length > 0 ? Math.min(...ticketTypes.map((t) => t.price)) : null;

  function handleShare(platform?: 'wa' | 'x' | 'fb') {
    const url = window.location.href;
    const text = `Beli tiket "${event?.name}" di TiketinAja sekarang!`;
    if (platform === 'wa') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'fb') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      showToast.success('Link event berhasil disalin ke clipboard!');
    }
  }

  const encodedMapLocation = encodeURIComponent(event.location || 'Jakarta, Indonesia');
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedMapLocation}`;
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodedMapLocation}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Semua Event</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <EventDetailHero
              name={event.name}
              categoryLabel={categoryLabel}
              imageUrl={event.image_url}
              gradientClass={gradientFor(event.id)}
            />
            <EventDetailTabs
              event={event}
              ticketTypes={ticketTypes}
              categoryLabel={categoryLabel}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onSelectTicket={() => navigate(`/checkout/${event.id}`)}
              googleMapsUrl={googleMapsUrl}
              googleMapsEmbedUrl={googleMapsEmbedUrl}
            />
          </div>

          <EventDetailSidebar
            event={event}
            categoryLabel={categoryLabel}
            minPrice={minPrice}
            onBuyTicket={() => navigate(`/checkout/${event.id}`)}
            onShare={handleShare}
          />
        </div>

        <EventDetailRecommendations events={recommendedEvents} />
      </div>
    </div>
  );
}
