import { useParams, useNavigate } from 'react-router-dom';
import { Ticket, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useEvents } from '../../../events/application/useEvents';
import { useTicketTypes } from '../../../events/application/useTicketTypes';
import { useQueue } from '../../application/useQueue';
import { useAuth } from '../../../auth/application/useAuth';
import { useActivePromos } from '../../../admin/application/useAdminPromos';
import { useCheckoutLogic } from '../../application/useCheckoutLogic';
import { QueueWaitingRoom } from '../components/QueueWaitingRoom';
import { TicketCard } from '../components/TicketCard';
import { HoldModal } from '../components/HoldModal';
import { CheckoutPromoBanner } from '../components/checkout/CheckoutPromoBanner';
import { CheckoutVoucherSection } from '../components/checkout/CheckoutVoucherSection';
import { CheckoutOrderSummary } from '../components/checkout/CheckoutOrderSummary';
import { AvailableVouchersModal } from '../components/checkout/AvailableVouchersModal';

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: events } = useEvents();
  const { data: ticketTypes, isLoading, isError: isTicketTypesError } = useTicketTypes(id ?? '');
  const { data: activePromos = [] } = useActivePromos();
  const event = events?.find((e) => e.id === id);

  const { step, position, joinQueue, isJoining, queueToken } = useQueue(id ?? '', user?.id ?? '');

  const {
    quantities,
    setQuantities,
    holdData,
    setHoldData,
    eventPromo,
    voucherCodeInput,
    setVoucherCodeInput,
    appliedVoucher,
    setAppliedVoucher,
    isValidatingVoucher,
    voucherModalOpen,
    setVoucherModalOpen,
    rawSubtotal,
    promoDiscountAmount,
    hasSelection,
    availableVouchers,
    voucherDiscountAmount,
    finalPayAmount,
    applyVoucherCode,
    handleRemoveVoucher,
    handleHold,
    isHolding,
  } = useCheckoutLogic({ eventId: id ?? '', ticketTypes, activePromos });

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
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-lg w-full text-center">
          <h2 className="text-xl font-black text-gray-900 mb-2">Gagal Memuat Tiket</h2>
          <p className="text-gray-500 text-sm mb-6">Terjadi kendala saat mengambil data tiket. Silakan coba muat ulang.</p>
          <button
            onClick={() => navigate('/events')}
            className="w-full bg-[#0064D2] text-white py-3 rounded-xl font-bold cursor-pointer"
          >
            Kembali ke Semua Events
          </button>
        </div>
      </div>
    );
  }

  if (step === 'idle') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-blue-50 text-[#0064D2] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-10 h-10 text-[#0064D2]" />
          </div>
          <span className="inline-block bg-blue-50 text-[#0064D2] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">
            Antrian Pembelian Tiket
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">{event?.name ?? 'Event Konser'}</h2>
          <p className="text-gray-500 text-sm mb-8">Klik tombol di bawah untuk mengamankan antrian virtualmu.</p>
          <button
            onClick={() => joinQueue()}
            disabled={isJoining}
            className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-4 rounded-2xl font-extrabold text-base shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-60"
          >
            {isJoining ? 'Menghubungkan ke Antrian...' : 'Bergabung ke Antrian Virtual'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'waiting') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <QueueWaitingRoom position={position} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-semibold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Event</span>
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Giliranmu Tiba! Waktu Hold: 5 Menit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Checkout & Hold Tiket</h1>
          <p className="text-gray-500 text-sm">{event?.name}</p>
          {eventPromo && <CheckoutPromoBanner promo={eventPromo} />}
        </div>

        {ticketTypes && ticketTypes.length > 0 ? (
          <div className="space-y-4 mb-8">
            {ticketTypes.map((tt) => (
              <TicketCard
                key={tt.id}
                ticketType={tt}
                quantity={quantities[tt.id] ?? 0}
                eventPromo={eventPromo}
                onQuantityChange={(qty) => {
                  setQuantities((prev) => ({ ...prev, [tt.id]: qty }));
                  if (appliedVoucher) setAppliedVoucher(null);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center text-gray-500 mb-8 shadow-sm">
            Tidak ada tiket tersedia untuk checkout.
          </div>
        )}

        <CheckoutVoucherSection
          hasSelection={hasSelection}
          availableVouchers={availableVouchers}
          appliedVoucher={appliedVoucher}
          voucherCodeInput={voucherCodeInput}
          isValidating={isValidatingVoucher}
          onCodeInputChange={setVoucherCodeInput}
          onApplyVoucher={(e) => {
            e.preventDefault();
            if (voucherCodeInput.trim()) applyVoucherCode(voucherCodeInput);
          }}
          onRemoveVoucher={handleRemoveVoucher}
          onOpenVoucherModal={() => setVoucherModalOpen(true)}
        />

        <CheckoutOrderSummary
          rawSubtotal={rawSubtotal}
          promoDiscountAmount={promoDiscountAmount}
          voucherDiscountAmount={voucherDiscountAmount}
          finalPayAmount={finalPayAmount}
          eventPromo={eventPromo}
          appliedVoucher={appliedVoucher}
          hasSelection={hasSelection}
          isHolding={isHolding}
          onHold={handleHold}
        />
      </div>

      <AvailableVouchersModal
        isOpen={voucherModalOpen}
        vouchers={availableVouchers}
        isValidating={isValidatingVoucher}
        onClose={() => setVoucherModalOpen(false)}
        onSelectVoucher={applyVoucherCode}
      />

      {holdData && (
        <HoldModal
          holdData={holdData}
          totalAmount={rawSubtotal}
          eventId={id ?? ''}
          eventName={event?.name ?? ''}
          onClose={() => setHoldData(null)}
          queueToken={queueToken}
          promoCode={appliedVoucher?.code}
          discountAmount={promoDiscountAmount + voucherDiscountAmount}
        />
      )}
    </div>
  );
}
