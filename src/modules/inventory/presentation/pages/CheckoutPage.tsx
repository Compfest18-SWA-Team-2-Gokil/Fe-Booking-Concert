import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Ticket, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../auth/application/useAuth';
import { useEvents } from '../../../events/application/useEvents';
import { useTicketTypes } from '../../../events/application/useTicketTypes';
import { useQueue } from '../../application/useQueue';
import { useHoldTicket } from '../../application/useHoldTicket';
import { TicketCard } from '../components/TicketCard';
import { HoldModal } from '../components/HoldModal';
import { QueueWaitingRoom } from '../components/QueueWaitingRoom';
import { formatCurrency } from '../../../../core/utils/formatCurrency';
import type { HoldResponse } from '../../domain/Ticket';
import { showAlert } from '../../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../../shared/utils/apiError';

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: events } = useEvents();
  const { data: ticketTypes, isLoading, isError: isTicketTypesError } = useTicketTypes(id ?? '');
  const event = events?.find((e) => e.id === id);

  const { step, position, joinQueue, isJoining, queueToken } = useQueue(
    id ?? '',
    user?.id ?? ''
  );
  const holdTicket = useHoldTicket();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [holdData, setHoldData] = useState<HoldResponse | null>(null);

  const totalAmount =
    ticketTypes?.reduce(
      (sum, tt) => sum + tt.price * (quantities[tt.id] ?? 0),
      0
    ) ?? 0;

  const hasSelection = Object.values(quantities).some((q) => q > 0);

  function handleHold() {
    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([ticket_type_id, quantity]) => ({ ticket_type_id, quantity }));

    holdTicket.mutate(items, {
      onSuccess: (data) => setHoldData(data),
      onError: (err: unknown) => {
        const isQuotaConflict = axios.isAxiosError(err) && err.response?.status === 409;
        if (isQuotaConflict) {
          showAlert.error('Kuota Habis', 'Maaf, kuota tiket untuk kategori yang kamu pilih sudah habis atau sedang dipesan orang lain.');
        } else {
          showAlert.error(
            'Gagal Mereservasi Tiket',
            getApiErrorMessage(err, 'Terjadi kesalahan saat memproses reservasi tiketmu. Silakan coba kembali.')
          );
        }
      },
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#0064D2] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isTicketTypesError) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 max-w-lg w-full text-center">
          <h2 className="text-xl font-black text-gray-900 mb-2">Gagal Memuat Tiket</h2>
          <p className="text-gray-500 text-sm mb-6">
            Terjadi kendala saat mengambil data tiket untuk event ini. Silakan coba muat ulang halaman.
          </p>
          <button
            onClick={() => navigate('/events')}
            className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3 rounded-xl font-bold transition-colors"
          >
            Kembali ke Semua Events
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Join queue
  if (step === 'idle') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-blue-50 text-[#0064D2] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Ticket className="w-10 h-10 text-[#0064D2]" />
          </div>
          <span className="inline-block bg-blue-50 text-[#0064D2] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Antrian Pembelian Tiket
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            {event?.name ?? 'Event Konser'}
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Klik tombol di bawah ini untuk mengamankan tempatmu di antrian virtual reservasi tiket.
          </p>

          <button
            onClick={() => {
              joinQueue();
            }}
            disabled={isJoining}
            className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-4 rounded-2xl font-extrabold text-base shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60 flex items-center justify-center cursor-pointer"
          >
            <span>{isJoining ? 'Menghubungkan ke Antrian...' : 'Bergabung ke Antrian Virtual'}</span>
          </button>

          <button
            onClick={() => navigate('/events')}
            className="w-full mt-4 text-gray-500 hover:text-gray-900 font-semibold text-sm transition-colors cursor-pointer"
          >
            Kembali ke Semua Events
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Waiting in queue room
  if (step === 'waiting') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <QueueWaitingRoom position={position} />
        </div>
      </div>
    );
  }

  // Step 3: Ready — select tickets and hold
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-semibold transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Event</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Giliranmu Tiba! Waktu Hold: 5 Menit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
            Checkout & Hold Tiket
          </h1>
          <p className="text-gray-500 text-sm">{event?.name}</p>
        </div>

        {ticketTypes && ticketTypes.length > 0 ? (
          <div className="space-y-4 mb-8">
            {ticketTypes.map((tt) => (
              <TicketCard
                key={tt.id}
                ticketType={tt}
                quantity={quantities[tt.id] ?? 0}
                onQuantityChange={(qty) =>
                  setQuantities((prev) => ({ ...prev, [tt.id]: qty }))
                }
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center text-gray-500 mb-8 shadow-sm">
            Tidak ada tiket tersedia untuk checkout.
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Total Pembayaran</span>
              <p className="text-xs text-gray-500 mt-0.5">Sudah termasuk pajak & fee layanan</p>
            </div>
            <span className="font-black text-3xl text-gray-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        <button
          onClick={handleHold}
          disabled={!hasSelection || holdTicket.isPending}
          className="w-full bg-gradient-to-r from-[#FF6100] to-orange-600 hover:from-[#E55500] hover:to-orange-700 text-white py-4 rounded-2xl font-extrabold text-lg shadow-xl shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{holdTicket.isPending ? 'Mereservasi Tiket...' : 'Reservasi Tiket Sekarang'}</span>
          <Ticket className="w-5 h-5" />
        </button>
      </div>

      {holdData && (
        <HoldModal
          holdData={holdData}
          totalAmount={totalAmount}
          eventId={id ?? ''}
          eventName={event?.name ?? ''}
          onClose={() => setHoldData(null)}
          queueToken={queueToken}
        />
      )}
    </div>
  );
}
