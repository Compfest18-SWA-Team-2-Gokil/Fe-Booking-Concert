import { Plus } from 'lucide-react';

interface CreateTicketTypeFormProps {
  name: string;
  setName: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  kind: 'GA' | 'SEATED';
  setKind: (v: 'GA' | 'SEATED') => void;
  quota: string;
  setQuota: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function CreateTicketTypeForm({
  name,
  setName,
  price,
  setPrice,
  kind,
  setKind,
  quota,
  setQuota,
  onSubmit,
  isSubmitting,
}: CreateTicketTypeFormProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <h2 className="text-base font-bold text-gray-900 mb-5">Tambah Ticket Type Baru</h2>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Tiket</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="cth. Early Bird, Presale 1, VIP"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Kategori / Tier</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setKind('GA')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  kind === 'GA'
                    ? 'bg-[#0064D2] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                GA (General)
              </button>
              <button
                type="button"
                onClick={() => setKind('SEATED')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  kind === 'SEATED'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                SEATED (Numbered)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Harga (Rp)</label>
            <input
              type="number"
              required
              min={0}
              step={1000}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0 (gratis) atau 150000"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Total Kuota Tiket</label>
          <input
            type="number"
            required
            min={1}
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            placeholder="cth. 100"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {isSubmitting ? 'Menyimpan...' : 'Tambah Ticket Type'}
        </button>
      </form>
    </div>
  );
}
