import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { CATEGORY_LABELS } from '../../../events/domain/models/Event';

interface EditEventFormProps {
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  category: 'music' | 'olahraga' | 'seni' | 'workshop';
  setCategory: (v: any) => void;
  date: string;
  setDate: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  setImageFile: (f: File | null) => void;
  previewSrc?: string;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
}

export function EditEventForm({
  name,
  setName,
  description,
  setDescription,
  category,
  setCategory,
  date,
  setDate,
  time,
  setTime,
  location,
  setLocation,
  setImageFile,
  previewSrc,
  onSubmit,
  isSaving,
}: EditEventFormProps) {
  const navigate = useNavigate();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1.5">Nama Event</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="cth. Konser Dewa 19 Reunion Tour 2026"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1.5">Deskripsi</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan detail event..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1.5">Kategori</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm bg-white"
        >
          {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">Tanggal</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-1.5">Waktu Mulai</label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm bg-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1.5">Lokasi / Venue</label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="cth. Gelora Bung Karno, Jakarta"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0064D2] text-sm"
        />
      </div>

      {/* Poster Image Upload */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-1.5">Poster Event</label>
        {previewSrc ? (
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 mb-3 group">
            <img src={previewSrc} alt="Preview" loading="lazy" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={() => setImageFile(null)}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-gray-200 hover:border-[#0064D2] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#0064D2] mb-2" />
            <span className="text-sm font-semibold text-gray-600 group-hover:text-[#0064D2]">
              Pilih foto poster (PNG, JPG, max 5MB)
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => navigate('/organizer/my-events')}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl text-sm transition-colors cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold py-3.5 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
}
