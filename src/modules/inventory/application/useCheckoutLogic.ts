import { useState } from 'react';
import axios from 'axios';
import type { TicketType, HoldResponse } from '../domain/Ticket';
import type { Promo, ValidatePromoResponse } from '../../admin/infrastructure/promosApi';
import { promosApi } from '../../admin/infrastructure/promosApi';
import { useHoldTicket } from './useHoldTicket';
import { showAlert, showToast } from '../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../shared/utils/apiError';

interface UseCheckoutLogicProps {
  eventId: string;
  ticketTypes?: TicketType[];
  activePromos: Promo[];
  queueToken?: string | null;
}

export function useCheckoutLogic({ eventId, ticketTypes, activePromos, queueToken }: UseCheckoutLogicProps) {
  const holdTicket = useHoldTicket();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [holdData, setHoldData] = useState<HoldResponse | null>(null);

  // Promo Event Otomatis
  const eventPromo = activePromos.find((p) => p.type === 'PROMO' && p.event_id === eventId);

  // Voucher Belanja
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<ValidatePromoResponse | null>(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);

  function getEffectivePrice(tt: TicketType): number {
    if (!eventPromo) return tt.price;
    let disc = 0;
    if (eventPromo.discount_type === 'PERCENTAGE') {
      disc = (tt.price * eventPromo.discount_value) / 100;
      if (eventPromo.max_discount_amount > 0 && disc > eventPromo.max_discount_amount) {
        disc = eventPromo.max_discount_amount;
      }
    } else {
      disc = eventPromo.discount_value;
    }
    return Math.max(0, tt.price - disc);
  }

  const rawSubtotal = ticketTypes?.reduce((sum, tt) => sum + tt.price * (quantities[tt.id] ?? 0), 0) ?? 0;
  const promoSubtotal = ticketTypes?.reduce((sum, tt) => sum + getEffectivePrice(tt) * (quantities[tt.id] ?? 0), 0) ?? 0;
  const promoDiscountAmount = rawSubtotal - promoSubtotal;
  const hasSelection = Object.values(quantities).some((q) => q > 0);
  const availableVouchers = activePromos.filter((p) => p.type === 'VOUCHER' || !p.event_id);
  const voucherDiscountAmount = appliedVoucher ? appliedVoucher.discount_amount : 0;
  const finalPayAmount = Math.max(0, promoSubtotal - voucherDiscountAmount);

  async function applyVoucherCode(codeToApply: string) {
    if (promoSubtotal <= 0) {
      showToast.error('Pilih jumlah tiket terlebih dahulu sebelum menerapkan voucher.');
      return;
    }
    setIsValidatingVoucher(true);
    try {
      const res = await promosApi.validatePromo({
        code: codeToApply.trim().toUpperCase(),
        total_amount: promoSubtotal,
        event_id: eventId,
      });
      setAppliedVoucher(res);
      setVoucherCodeInput(res.code);
      setVoucherModalOpen(false);
      showToast.success(`Voucher ${res.code} berhasil diterapkan!`);
    } catch (err: unknown) {
      showToast.error(getApiErrorMessage(err, 'Kode voucher tidak valid atau syarat belum terpenuhi.'));
      setAppliedVoucher(null);
    } finally {
      setIsValidatingVoucher(false);
    }
  }

  function handleRemoveVoucher() {
    setAppliedVoucher(null);
    setVoucherCodeInput('');
  }

  function handleHold() {
    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([ticket_type_id, quantity]) => ({ ticket_type_id, quantity }));

    holdTicket.mutate(
      { eventId, items, queueToken },
      {
        onSuccess: (data) => setHoldData(data),
        onError: (err: unknown) => {
          const isQuotaConflict = axios.isAxiosError(err) && err.response?.status === 409;
          if (isQuotaConflict) {
            showAlert.error('Kuota Habis', 'Maaf, kuota tiket untuk kategori yang kamu pilih sudah habis atau sedang dipesan orang lain.');
          } else {
            showAlert.error('Gagal Mereservasi Tiket', getApiErrorMessage(err, 'Terjadi kesalahan saat memproses reservasi tiketmu.'));
          }
        },
      },
    );
  }

  return {
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
    promoSubtotal,
    promoDiscountAmount,
    hasSelection,
    availableVouchers,
    voucherDiscountAmount,
    finalPayAmount,
    applyVoucherCode,
    handleRemoveVoucher,
    handleHold,
    isHolding: holdTicket.isPending,
  };
}
