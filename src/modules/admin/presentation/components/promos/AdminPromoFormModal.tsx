import { useState, useEffect } from 'react';
import { X, Flame, Ticket, Clock } from 'lucide-react';
import type { Promo, CreatePromoPayload, DiscountType, PromoType } from '../../../infrastructure/promosApi';
import { showAlert } from '../../../../../shared/utils/alert';

interface AdminPromoFormModalProps {
  isOpen: boolean;
  formType: PromoType;
  editingPromo: Promo | null;
  events: Array<{ id: string; name: string }>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreatePromoPayload) => Promise<void>;
}

export function AdminPromoFormModal({
  isOpen,
  formType,
  editingPromo,
  events,
  isSubmitting,
  onClose,
  onSubmit,
}: AdminPromoFormModalProps) {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventId, setEventId] = useState<string>('');
  const [discountType, setDiscountType] = useState<DiscountType>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(0);
  const [maxUsage, setMaxUsage] = useState<number>(100);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (editingPromo) {
      setCode(editingPromo.code);
      setTitle(editingPromo.title);
      setDescription(editingPromo.description || '');
      setEventId(editingPromo.event_id || (events[0]?.id ?? ''));
      setDiscountType(editingPromo.discount_type);
      setDiscountValue(editingPromo.discount_value);
      setMinOrderAmount(editingPromo.min_order_amount);
      setMaxDiscountAmount(editingPromo.max_discount_amount);
      setMaxUsage(editingPromo.max_usage);
      setStartDate(editingPromo.start_date ? editingPromo.start_date.substring(0, 16) : '');
      setEndDate(editingPromo.end_date ? editingPromo.end_date.substring(0, 16) : '');
      setIsActive(editingPromo.is_active);
    } else {
      setCode('');
      setTitle('');
      setDescription('');
      setEventId(events[0]?.id ?? '');
      setDiscountType('PERCENTAGE');
      setDiscountValue(10);
      setMinOrderAmount(0);
      setMaxDiscountAmount(0);
      setMaxUsage(100);
      setStartDate('');
      setEndDate('');
      setIsActive(true);
    }
  }, [editingPromo, events, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formType === 'PROMO' && !eventId) {
      showAlert.error('Pilih Event', 'Untuk membuat Promo dan Event, kamu wajib memilih konser yang berlaku.');
      return;
    }

    await onSubmit({
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      type: formType,
      event_id: formType === 'PROMO' ? eventId : null,
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_amount: isPromo ? 0 : (Number(minOrderAmount) || 0),
      max_discount_amount: Number(maxDiscountAmount) || 0,
      max_usage: Number(maxUsage) || 0,
      start_date: startDate ? new Date(startDate).toISOString() : null,
      end_date: endDate ? new Date(endDate).toISOString() : null,
      is_active: isActive,
    });
  }

  const isPromo = formType === 'PROMO';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8 overflow-hidden border border-gray-100 flex flex-col">
        {/* Header Modal */}
        <div className={`p-6 text-white flex items-center justify-between shrink-0 ${isPromo ? 'bg-gradient-to-r from-[#FF6100] to-orange-600' : 'bg-[#0064D2]'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              {isPromo ? <Flame className="w-5 h-5 text-white" /> : <Ticket className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="text-lg font-black">
                {editingPromo ? `Edit ${isPromo ? 'Promo Event' : 'Voucher Global'}` : isPromo ? 'Buat Promo Khusus Konser' : 'Buat Voucher Global'}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                {isPromo ? 'Berlaku hanya untuk konser yang dipilih' : 'Berlaku untuk semua konser'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {isPromo && (
            <div className="bg-orange-50/80 border border-orange-200 p-4 rounded-2xl space-y-1.5">
              <label className="block text-xs font-black text-orange-900 uppercase">Pilih Konser yang Berlaku *</label>
              <select
                required
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full border border-orange-300 rounded-xl px-3.5 py-2.5 text-sm bg-white font-bold text-gray-900 focus:ring-2 focus:ring-orange-500"
              >
                {events?.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kode {isPromo ? 'Promo' : 'Voucher'} *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder={isPromo ? 'cth. PROMOSEAN20' : 'cth. COMPFEST50K'}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-gray-900 focus:ring-2 focus:ring-[#0064D2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Judul *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="cth. Diskon Spesial Konser"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#0064D2]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Deskripsi</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Syarat & ketentuan..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#0064D2] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tipe Diskon</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white font-medium text-gray-900 focus:ring-2 focus:ring-[#0064D2]"
              >
                <option value="PERCENTAGE">Persentase (%)</option>
                <option value="FIXED_AMOUNT">Nominal Tetap (Rp)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nilai Diskon *</label>
              <input
                type="number"
                required
                min={1}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#0064D2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Min. Belanja (Rp) {isPromo && <span className="text-[10px] font-normal text-gray-400 lowercase">(khusus voucher)</span>}
              </label>
              <input
                type="number"
                min={0}
                value={isPromo ? 0 : minOrderAmount}
                disabled={isPromo}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm ${
                  isPromo
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-white text-gray-900 border-gray-200 focus:ring-2 focus:ring-[#0064D2]'
                }`}
              />
              {isPromo && (
                <p className="mt-1 text-[11px] text-gray-400 leading-tight">
                  Promo event berlaku langsung per tiket (tanpa syarat min. belanja).
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Maks. Kuota</label>
              <input
                type="number"
                min={0}
                value={maxUsage}
                onChange={(e) => setMaxUsage(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#0064D2]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> Waktu Mulai
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-[#0064D2]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> Waktu Berakhir
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-[#0064D2]"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm cursor-pointer">
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 text-white font-bold py-2.5 rounded-xl text-sm shadow-md cursor-pointer disabled:opacity-50 ${isPromo ? 'bg-orange-600 hover:bg-orange-700' : 'bg-[#0064D2] hover:bg-[#0052B0]'}`}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
