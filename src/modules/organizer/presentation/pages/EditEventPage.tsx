import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, MapPin, AlignLeft, Tag, Save, Image, Upload, CheckCircle2 } from 'lucide-react';
import { eventsApi } from '../../../events/infrastructure/eventsApi';
import type { EventCategory } from '../../../events/domain/models/Event';
import { CATEGORY_LABELS } from '../../../events/domain/models/Event';
import { useEvent } from '../../../events/application/useEvents';
import axiosInstance from '../../../../core/api/axiosInstance';
import { showAlert, showToast } from '../../../../shared/utils/alert';

const CATEGORIES: EventCategory[] = ['music', 'olahraga', 'seni', 'workshop'];

export function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: event, isLoading } = useEvent(eventId ?? '');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('music');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  // Simpan URL gambar terbaru setelah upload agar langsung tampil tanpa harus refetch
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);

  // Pre-fill form when event data loads
  useEffect(() => {
    if (!event) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pre-filling form from fetched data is a valid effect pattern
    setName(event.name);
    setDescription(event.description ?? '');
    setCategory(event.category ?? 'music');
    const d = new Date(event.date);
    setDate(d.toISOString().split('T')[0]);
    setTime(
      d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
    );
    setLocation(event.location);
    // Hanya set currentImageUrl saat data pertama kali load (bukan setelah upload)
    if (currentImageUrl === undefined) {
      setCurrentImageUrl(event.image_url ?? '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const [isSaving, setIsSaving] = useState(false);

  const uploadImage = useMutation({
    mutationFn: ({ file }: { file: File }) => {
      const form = new FormData();
      form.append('image', file);
      return axiosInstance
        .post<{ image_url: string }>(`/api/v1/events/${eventId}/image`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['event', eventId] });
      setCurrentImageUrl(data.image_url);
      setImageFile(null);
      setImageUploaded(true);
      showToast.success('Foto event berhasil diperbarui!');
    },
    onError: () => {
      showAlert.error('Gagal Upload Foto', 'Pastikan ukuran file di bawah 5MB dan berformat JPG/PNG/WebP.');
    },
  });

  function handleImageUpload() {
    if (!imageFile) return;
    uploadImage.mutate({ file: imageFile });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!eventId) return;

    setIsSaving(true);
    try {
      // 1. Jika ada foto baru yang dipilih tapi belum diupload, upload sekarang
      if (imageFile) {
        const form = new FormData();
        form.append('image', imageFile);
        await axiosInstance.post<{ image_url: string }>(`/api/v1/events/${eventId}/image`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // 2. Simpan detail event
      const isoDate = `${date}T${time}:00+07:00`;
      await eventsApi.updateEvent(eventId, { name, description, category, date: isoDate, location });

      // 3. Invalidate cache & redirect
      await qc.invalidateQueries({ queryKey: ['events'] });
      await qc.invalidateQueries({ queryKey: ['event', eventId] });
      showToast.success('Event dan foto berhasil diperbarui!');
      navigate('/organizer/my-events');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      const msg = axiosErr?.response?.data?.error ?? 'Pastikan semua informasi valid dan ukuran file di bawah 5MB.';
      showAlert.error('Gagal Menyimpan Perubahan', msg);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#0064D2] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 text-center">
        <p className="text-gray-500">Event tidak ditemukan.</p>
      </div>
    );
  }

  // Preview: file lokal yang baru dipilih → preview lokal. Else tampilkan URL terkini dari state.
  const previewSrc = imageFile ? URL.createObjectURL(imageFile) : (currentImageUrl || undefined);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/organizer/my-events')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Event Saya
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-bold text-gray-900 truncate">Edit Event</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Save className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Edit Event</h1>
              <p className="text-sm text-gray-500 truncate">{event.name}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Nama Event</label>
              <input
                type="text" required value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Konser Dewa 19 Reunion Tour 2026"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">
                <span className="flex items-center gap-1.5"><AlignLeft className="w-4 h-4 text-[#0064D2]" />Deskripsi Event</span>
              </label>
              <textarea
                rows={3} value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan detail acara, artis yang tampil, fasilitas, dll."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">
                <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-[#0064D2]" />Kategori Event</span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat} type="button" onClick={() => setCategory(cat)}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-colors cursor-pointer ${
                      category === cat
                        ? 'border-[#0064D2] bg-blue-50 text-[#0064D2]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#0064D2]" />Tanggal</span>
                </label>
                <input
                  type="date" required value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Jam Mulai (WIB)</label>
                <input
                  type="time" required value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#0064D2]" />Lokasi / Venue</span>
              </label>
              <input
                type="text" required value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="cth. Gelora Bung Karno, Jakarta"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm"
              />
            </div>

            {/* ─── Foto Event ─── */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                <span className="flex items-center gap-1.5"><Image className="w-4 h-4 text-[#0064D2]" />Foto Event</span>
              </label>

              {/* Preview gambar */}
              {previewSrc ? (
                <div className="relative mb-3">
                  <img
                    src={previewSrc}
                    alt="Preview foto event"
                    className="w-full h-52 object-cover rounded-xl border border-gray-200"
                  />
                  {imageUploaded && !imageFile && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Berhasil diupload
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center mb-3 text-gray-400 text-sm">
                  Belum ada foto event
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  setImageFile(e.target.files?.[0] ?? null);
                  setImageUploaded(false);
                }}
                className="w-full text-sm text-gray-600 mb-3 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-[#0064D2] hover:file:bg-blue-100 cursor-pointer"
              />

              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!imageFile || uploadImage.isPending || isSaving}
                className="w-full flex items-center justify-center gap-1.5 bg-[#0064D2] text-white font-bold py-3 rounded-xl hover:bg-[#0052B0] disabled:opacity-50 transition-colors text-sm cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {uploadImage.isPending ? 'Mengupload foto...' : imageFile ? 'Upload Foto Sekarang' : 'Pilih foto terlebih dahulu'}
              </button>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Maks. 5MB · JPG, PNG, WebP · Foto akan otomatis tersimpan saat menekan "Simpan Perubahan"
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit" disabled={isSaving}
                className="flex-1 bg-[#0064D2] hover:bg-[#0052B0] text-white py-3.5 rounded-xl font-extrabold shadow-md transition-colors disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan'}
              </button>
              <button
                type="button" onClick={() => navigate('/organizer/my-events')}
                className="px-6 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
