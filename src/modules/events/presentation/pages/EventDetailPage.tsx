import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Ticket, Music } from 'lucide-react';
import { useEvents } from '../../application/useEvents';
import { useTicketTypes } from '../../application/useTicketTypes';
import { formatDate } from '../../../../core/utils/formatDate';
import { formatCurrency } from '../../../../core/utils/formatCurrency';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: ticketTypes, isLoading: typesLoading } = useTicketTypes(id ?? '');

  const event = events?.find((e) => e.id === id);

  if (eventsLoading || typesLoading) {
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
          <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Event Tidak Ditemukan</h2>
          <p className="text-gray-500 text-sm mb-6">Events yang kamu cari tidak tersedia atau telah berakhir.</p>
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 text-sm font-semibold bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Semua Event</span>
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex-1">
              <span className="inline-block bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                Official Event
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
                {event.name}
              </h1>

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

      {/* Ticket Types Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Kategori Tiket Available</h2>
        <p className="text-gray-500 text-sm mb-8">Pilih jenis kategori tiket eventsyang ingin kamu beli</p>

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
