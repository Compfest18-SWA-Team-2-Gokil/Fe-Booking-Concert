import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Calendar, MapPin, CheckCircle2, Upload, Image, AlignLeft, Tag } from 'lucide-react';
import { eventsApi } from '../../../events/infrastructure/eventsApi';
import type { Event, EventCategory } from '../../../events/domain/models/Event';
import { CATEGORY_LABELS } from '../../../events/domain/models/Event';
import axiosInstance from '../../../../core/api/axiosInstance';
import { showAlert, showToast } from '../../../../shared/utils/alert';

const CATEGORIES: EventCategory[] = ['music', 'olahraga', 'seni', 'workshop'];

function CreateEventPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('music');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [location, setLocation] = useState('');
  const [done, setDone] = useState<Event | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploaded, setImageUploaded] = useState(false);

  const createEvent = useMutation({
    mutationFn: (payload: { name: string; description: string; category: EventCategory; date: string; location: string }) =>
      eventsApi.createEvent(payload).then((r) => r.data),
    onSuccess: (event) => {
      qc.invalidateQueries({ queryKey: ['events'] });
      showToast.success('Event berhasil dibuat!');
      setDone(event);
    },
    onError: () => {
      showAlert.error(
        'Gagal Membuat Event',
        'Pastikan tanggal diset di masa depan dan seluruh informasi terisi dengan benar.'
      );
    },
  });

  const uploadImage = useMutation({
    mutationFn: ({ eventId, file }: { eventId: string; file: File }) => {
      const form = new FormData();
      form.append('image', file);
      return axiosInstance
        .post<{ image_url: string }>(`/api/v1/events/${eventId}/image`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      setImageUploaded(true);
      showToast.success('Poster/foto event berhasil diupload!');
    },
    onError: () => {
      showAlert.error('Gagal Upload Foto', 'Pastikan ukuran file di bawah 5MB dan berformat JPG/PNG/WebP.');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isoDate = `${date}T${time}:00+07:00`;
    createEvent.mutate({ name, description, category, date: isoDate, location });
  }

  function handleImageUpload() {
    if (!done || !imageFile) return;
    uploadImage.mutate({ eventId: done.id, file: imageFile });
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Event Berhasil Dibuat!</h2>
          <p className="text-gray-500 text-sm mb-6">
            <strong className="text-gray-900">{done.name}</strong> sudah tersimpan.
          </p>

          {!imageUploaded ? (
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left">
              <div className="flex items-center gap-2 mb-3">
                <Image className="w-4 h-4 text-[#0064D2]" />
                <p className="text-sm font-bold text-gray-900">Upload Foto Event (Opsional)</p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-600 mb-3 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-[#0064D2] hover:file:bg-blue-100"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleImageUpload}
                  disabled={!imageFile || uploadImage.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#0064D2] text-white font-bold py-2 rounded-xl hover:bg-[#0052B0] disabled:opacity-50 transition-colors text-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {uploadImage.isPending ? 'Mengupload...' : 'Upload Foto'}
                </button>
                <button
                  onClick={() => navigate(`/organizer/events/${done.id}/ticket-types`)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 rounded-xl hover:bg-gray-200 transition-colors text-sm"
                >
                  Lewati
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-3 mb-6 flex items-center gap-2 text-sm text-green-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Foto event berhasil diupload!
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate(`/organizer/events/${done.id}/ticket-types`)}
              className="w-full bg-[#0064D2] text-white font-bold py-3 rounded-xl hover:bg-[#0052B0] transition-colors"
            >
              Buat Ticket Types
            </button>
            <button
              onClick={() => navigate('/organizer/dashboard')}
              className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/organizer/dashboard')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-bold text-gray-900">Buat Event Baru</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-[#0064D2]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Buat Event</h1>
              <p className="text-sm text-gray-500">Isi detail event yang akan kamu selenggarakan</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Nama Event</label>
              <input
                type="text" required value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth. Konser Dewa 19 Reunion Tour 2026"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:border-transparent text-sm"
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:border-transparent text-sm resize-none"
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
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-colors ${
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Jam Mulai (WIB)</label>
                <input
                  type="time" required value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:border-transparent text-sm"
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:border-transparent text-sm"
              />
            </div>

            <button
              type="submit" disabled={createEvent.isPending}
              className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white py-3.5 rounded-xl font-extrabold shadow-md transition-colors disabled:opacity-60 cursor-pointer"
            >
              {createEvent.isPending ? 'Membuat Event...' : 'Buat Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export { CreateEventPage };
