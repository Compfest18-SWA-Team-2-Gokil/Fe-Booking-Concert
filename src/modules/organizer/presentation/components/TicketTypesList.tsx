import { Tag, Ticket } from 'lucide-react';
import type { TicketType } from '../../../inventory/domain/Ticket';
import { formatCurrency } from '../../../../core/utils/formatCurrency';

interface TicketTypesListProps {
  ticketTypes: TicketType[];
}

export function TicketTypesList({ ticketTypes }: TicketTypesListProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <h2 className="text-base font-bold text-gray-900 mb-5">Daftar Ticket Types Terdaftar</h2>
      {ticketTypes.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-semibold">Belum ada ticket type.</p>
          <p className="text-xs text-gray-400 mt-1">Tambahkan tipe tiket melalui formulir di atas.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {ticketTypes.map((tt) => (
            <div key={tt.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{tt.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tt.kind === 'SEATED'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {tt.kind}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span>Harga: <strong className="text-gray-900">{formatCurrency(tt.price)}</strong></span>
                  <span>Kuota: <strong className="text-gray-900">{tt.total_quota}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <Tag className="w-3 h-3" /> Aktif
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
