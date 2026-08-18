import { Edit3, Trash2, Globe, Calendar, Percent, DollarSign, Users } from 'lucide-react';
import type { Promo } from '../../../infrastructure/promosApi';
import { formatCurrency } from '../../../../../core/utils/formatCurrency';

interface AdminPromosTableProps {
  promos: Promo[];
  isLoading: boolean;
  filterType: 'ALL' | 'VOUCHER' | 'PROMO';
  onEdit: (promo: Promo) => void;
  onDelete: (promo: Promo) => void;
}

export function AdminPromosTable({
  promos,
  isLoading,
  filterType,
  onEdit,
  onDelete,
}: AdminPromosTableProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase text-[11px] border-b border-gray-100">
            <tr>
              <th className="py-4 px-6">Tipe & Kode</th>
              <th className="py-4 px-6">Judul & Keterangan</th>
              <th className="py-4 px-6">Berlaku Untuk</th>
              <th className="py-4 px-6">Potongan Diskon</th>
              <th className="py-4 px-6">Periode Waktu</th>
              <th className="py-4 px-6">Pemakaian</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">
                  <div className="animate-spin w-8 h-8 border-4 border-[#0064D2] border-t-transparent rounded-full mx-auto mb-2" />
                  Memuat data...
                </td>
              </tr>
            ) : promos.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">
                  Belum ada data {filterType === 'ALL' ? 'voucher atau promo' : filterType === 'VOUCHER' ? 'voucher global' : 'promo event'}.
                </td>
              </tr>
            ) : (
              promos.map((p) => {
                const isExhausted = p.max_usage > 0 && p.used_count >= p.max_usage;
                const isPromoEvent = p.type === 'PROMO' || Boolean(p.event_id);

                return (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Tipe & Kode Promo */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            isPromoEvent
                              ? 'bg-orange-100 text-orange-700 border border-orange-200'
                              : 'bg-blue-100 text-[#0064D2] border border-blue-200'
                          }`}
                        >
                          {isPromoEvent ? 'Promo Event' : 'Voucher Global'}
                        </span>
                        <span className="font-mono font-black text-xs text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                          {p.code}
                        </span>
                      </div>
                    </td>

                    {/* Judul & Deskripsi */}
                    <td className="py-4 px-6 max-w-[200px]">
                      <p className="font-bold text-gray-900">{p.title}</p>
                      {p.description && (
                        <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>
                      )}
                    </td>

                    {/* Cakupan Event */}
                    <td className="py-4 px-6">
                      {isPromoEvent && p.event_id ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                          <Calendar className="w-3 h-3 text-purple-600" />
                          <span className="max-w-[150px] truncate">{p.event_name || 'Event Khusus'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          <Globe className="w-3 h-3 text-blue-600" />
                          <span>Semua Konser (Global)</span>
                        </span>
                      )}
                    </td>

                    {/* Potongan Diskon */}
                    <td className="py-4 px-6 font-extrabold text-gray-900">
                      {p.discount_type === 'PERCENTAGE' ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Percent className="w-3.5 h-3.5" />
                          {p.discount_value}% Diskon
                          {p.max_discount_amount > 0 && (
                            <span className="text-xs text-gray-400 font-normal">
                              (Max {formatCurrency(p.max_discount_amount)})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-[#0064D2] flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          Potongan {formatCurrency(p.discount_value)}
                        </span>
                      )}
                    </td>

                    {/* Periode Waktu */}
                    <td className="py-4 px-6 text-xs text-gray-600">
                      {p.start_date || p.end_date ? (
                        <div className="space-y-0.5">
                          {p.start_date && (
                            <p className="text-[11px] text-gray-500">Mulai: {new Date(p.start_date).toLocaleDateString('id-ID')}</p>
                          )}
                          {p.end_date && (
                            <p className="text-[11px] text-red-600 font-semibold">Sampai: {new Date(p.end_date).toLocaleDateString('id-ID')}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Tanpa Batas Waktu</span>
                      )}
                    </td>

                    {/* Pemakaian */}
                    <td className="py-4 px-6 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-gray-700">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {p.used_count} / {p.max_usage > 0 ? p.max_usage : '∞'} dipakai
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {isExhausted ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                          Kuota Habis
                        </span>
                      ) : p.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                          Non-Aktif
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 text-gray-400 hover:text-[#0064D2] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Promo"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Promo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
