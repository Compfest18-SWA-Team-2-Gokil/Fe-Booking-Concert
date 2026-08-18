import { AlignLeft, Tag, ShieldCheck, MapPin, ExternalLink, Info, CheckCircle2, AlertCircle, Ticket } from 'lucide-react';
import type { Event, TicketType } from '../../../domain/models/Event';
import { formatCurrency } from '../../../../../core/utils/formatCurrency';

export type EventTab = 'deskripsi' | 'tiket' | 'lokasi' | 'syarat';

interface EventDetailTabsProps {
  event: Event;
  ticketTypes?: TicketType[];
  categoryLabel: string;
  activeTab: EventTab;
  onTabChange: (tab: EventTab) => void;
  onSelectTicket: () => void;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
}

export function EventDetailTabs({
  event,
  ticketTypes,
  categoryLabel,
  activeTab,
  onTabChange,
  onSelectTicket,
  googleMapsUrl,
  googleMapsEmbedUrl,
}: EventDetailTabsProps) {
  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 flex items-center gap-1 overflow-x-auto">
        {(['deskripsi', 'tiket', 'lokasi', 'syarat'] as EventTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all text-center cursor-pointer capitalize ${
              activeTab === tab ? 'bg-[#0064D2] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab === 'syarat' ? 'Syarat & Ketentuan' : tab === 'lokasi' ? 'Lokasi & Peta' : tab === 'tiket' ? 'Pilihan Tiket' : 'Deskripsi'}
          </button>
        ))}
      </div>

      {/* Deskripsi */}
      {activeTab === 'deskripsi' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlignLeft className="w-5 h-5 text-[#0064D2]" />
              <h2 className="text-xl font-black text-gray-900">Tentang Event Ini</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {event.description || 'Tidak ada deskripsi tambahan untuk event ini.'}
            </p>
          </div>
          <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <Tag className="w-5 h-5 text-[#0064D2]" />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Kategori</p>
                <p className="text-sm font-black text-gray-900">{categoryLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Jaminan Tiket</p>
                <p className="text-sm font-black text-gray-900">100% E-Ticket Resmi & Terverifikasi</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tiket */}
      {activeTab === 'tiket' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-2">
            <h2 className="text-xl font-black text-gray-900 mb-1">Daftar Kategori Tiket</h2>
            <p className="text-gray-500 text-xs sm:text-sm">Pilih kategori tiket yang sesuai dengan preferensimu</p>
          </div>
          {ticketTypes && ticketTypes.length > 0 ? (
            ticketTypes.map((tt) => {
              const effectiveQuota = tt.available_quota !== undefined ? tt.available_quota : tt.total_quota;
              const isSoldOut = effectiveQuota <= 0;
              const isLimited = effectiveQuota > 0 && effectiveQuota <= 10;
              return (
                <div
                  key={tt.id}
                  className={`rounded-3xl p-6 transition-all border ${
                    isSoldOut ? 'bg-gray-50/80 border-gray-200/80 opacity-75' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className={`font-black text-lg ${isSoldOut ? 'text-gray-500' : 'text-gray-900'}`}>{tt.name}</h3>
                        <span className="text-xs bg-blue-50 text-[#0064D2] px-2.5 py-0.5 rounded-full font-bold">
                          {tt.kind === 'GA' ? 'General Admission' : 'Seated (Tempat Duduk)'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {isSoldOut ? (
                          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                            <AlertCircle className="w-3.5 h-3.5" /> Habis Terjual (Sold Out)
                          </span>
                        ) : isLimited ? (
                          <span className="inline-flex items-center gap-1 text-xs font-extrabold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full animate-pulse">
                            <Ticket className="w-3.5 h-3.5" /> Sisa {effectiveQuota} Tiket Lagi!
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Tersedia ({effectiveQuota} Kuota)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs text-gray-400 font-semibold uppercase">Harga Tiket</p>
                      <p className={`font-black text-2xl ${isSoldOut ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{formatCurrency(tt.price)}</p>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {isSoldOut ? 'Kuota untuk kategori ini telah habis' : 'Termasuk pajak & fee reservasi'}
                    </span>
                    <button
                      onClick={onSelectTicket}
                      disabled={isSoldOut}
                      className="bg-[#0064D2] hover:bg-[#0052B0] text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-40 cursor-pointer"
                    >
                      {isSoldOut ? 'Sold Out' : 'Beli Kategori Ini'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center text-gray-500 shadow-sm">Belum ada tiket yang tersedia untuk event ini.</div>
          )}
        </div>
      )}

      {/* Lokasi */}
      {activeTab === 'lokasi' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0064D2]" />
              <h2 className="text-xl font-black text-gray-900">Lokasi Acara</h2>
            </div>
            <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0064D2] hover:text-[#0052B0] bg-blue-50 px-3 py-1.5 rounded-xl">
              <span>Buka di Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <MapPin className="w-4 h-4 text-[#0064D2] shrink-0" />
            <span>{event.location}</span>
          </div>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-inner h-80 bg-gray-100">
            <iframe title="Peta Lokasi Event" src={googleMapsEmbedUrl} className="w-full h-full border-0" loading="lazy" allowFullScreen />
          </div>
        </div>
      )}

      {/* Syarat */}
      {activeTab === 'syarat' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-[#0064D2]" />
            <h2 className="text-xl font-black text-gray-900">Syarat & Ketentuan E-Ticket</h2>
          </div>
          <ul className="space-y-3.5 text-sm text-gray-600 leading-relaxed list-disc list-inside">
            <li>E-ticket resmi dengan kode QR unik akan langsung diterbitkan setelah pembayaran berhasil diverifikasi.</li>
            <li>Tunjukkan QR code e-ticket langsung dari menu <strong>Tiket Saya</strong> di aplikasi TiketinAja saat check-in di gate.</li>
            <li>Satu QR code tiket hanya berlaku untuk satu kali pemindaian masuk (1 orang pengunjung).</li>
            <li>Pengajuan refund dapat dilakukan oleh pembeli paling lambat <strong>H-1 sebelum tanggal event dimulai</strong> (hanya berlaku jika tiket belum pernah di-scan masuk di gate).</li>
            <li>Penyelenggara berhak menolak akses pengunjung yang tidak dapat menunjukkan QR code tiket yang valid atau tiket yang sudah berstatus <em>ADMITTED</em>.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
