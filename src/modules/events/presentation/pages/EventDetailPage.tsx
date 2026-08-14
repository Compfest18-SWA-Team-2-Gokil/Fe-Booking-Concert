import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Ticket, AlignLeft, Tag } from 'lucide-react';
import { useEvent } from '../../application/useEvents';
import { useTicketTypes } from '../../application/useTicketTypes';
import { CATEGORY_LABELS } from '../../domain/models/Event';
import { formatDate } from '../../../../core/utils/formatDate';
import { formatCurrency } from '../../../../core/utils/formatCurrency';

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
  const { data: event, isLoading: eventLoading } = useEvent(id ?? '');
  const { data: ticketTypes, isLoading: typesLoading } = useTicketTypes(id ?? '');

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
            className="bg-[#0064D2] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md"
          >
            Lihat Event Lainnya
          </button>
        </div>
      </div>
    );
  }

  const categoryLabel = event.category ? CATEGORY_LABELS[event.category] ?? event.category : 'Event';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Hero Banner */}
      <div className={`relative text-white py-16 overflow-hidden ${
        event.image_url ? '' : `bg-gradient-to-r ${gradientFor(event.id)}`
      }`}>
        {event.image_url && (
          <>
            <img
              src={event.image_url}
              alt={event.name}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent" />
          </>
        )}
        {!event.image_url && (
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        )}

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 text-sm font-semibold bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Semua Event
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex-1">
              <span className="inline-block bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                {categoryLabel}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
                {event.name}
              </h1>

              {event.description && (
                <p className="text-gray-300 text-sm mb-4 max-w-xl leading-relaxed">
                  {event.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span className="font-semibold text-white">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-white">{event.location}</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-center md:text-right">
              <p className="text-xs text-gray-300 font-semibold uppercase tracking-wider">Mulai Dari</p>
              <p className="text-3xl font-black text-white my-1">
                {ticketTypes && ticketTypes.length > 0
                  ? formatCurrency(Math.min(...ticketTypes.map((t) => t.price)))
                  : '-'}
              </p>
              <button
                onClick={() => navigate(`/checkout/${event.id}`)}
                className="mt-3 w-full md:w-auto bg-[#FF6100] hover:bg-[#E55500] text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-orange-500/30 transition-all"
              >
                Pesan Tiket Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section (if has description) */}
      {event.description && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <AlignLeft className="w-5 h-5 text-[#0064D2]" />
              <h2 className="text-lg font-black text-gray-900">Tentang Event</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori:</span>
              <span className="text-xs font-bold text-[#0064D2] bg-blue-50 px-2.5 py-0.5 rounded-full">
                {categoryLabel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Types Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Kategori Tiket Available</h2>
        <p className="text-gray-500 text-sm mb-8">Pilih jenis tiket yang ingin kamu beli</p>

        {ticketTypes && ticketTypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ticketTypes.map((tt) => (
              <div
                key={tt.id}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-xl">{tt.name}</h3>
                      <span className="inline-block mt-1.5 text-xs bg-blue-50 text-[#0064D2] px-3 py-1 rounded-full font-bold">
                        {tt.kind === 'GA' ? 'General Admission (Berdiri)' : 'Seated (Tempat Duduk)'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-medium">Harga / Tiket</p>
                      <p className="font-extrabold text-gray-900 text-2xl">{formatCurrency(tt.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 p-3 rounded-xl mb-6">
                    <Ticket className="w-4 h-4 text-[#0064D2]" />
                    <span>Total Kuota Available:</span>
                    <span className="text-gray-900 font-bold">{tt.total_quota} Tiket</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/checkout/${event.id}`)}
                  className="w-full bg-[#FF6100] hover:bg-[#E55500] text-white font-bold py-3.5 rounded-xl shadow-md shadow-orange-500/20 transition-all text-sm"
                >
                  Pilih & Beli Tiket
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium">Tidak ada tipe tiket yang tersedia saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
