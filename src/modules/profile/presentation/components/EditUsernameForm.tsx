import { Loader2, Check, X, Pencil } from 'lucide-react';

interface EditUsernameFormProps {
  currentUsername: string;
  username: string;
  setUsername: (v: string) => void;
  availability: 'idle' | 'checking' | 'available' | 'taken';
  isEditing: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  startEditing: () => void;
  cancelEditing: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EditUsernameForm({
  currentUsername,
  username,
  setUsername,
  availability,
  isEditing,
  isSubmitting,
  canSubmit,
  startEditing,
  cancelEditing,
  onSubmit,
}: EditUsernameFormProps) {
  if (!isEditing) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Username</h2>
            <p className="text-sm font-mono text-gray-600 mt-1">@{currentUsername}</p>
          </div>
          <button
            onClick={startEditing}
            className="flex items-center gap-1.5 text-[#0064D2] text-xs font-bold hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Ubah
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-sm font-bold text-gray-800 mb-3">Ubah Username</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            placeholder="Username baru"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2] pr-10"
            minLength={3}
            maxLength={30}
            autoFocus
          />
          {availability === 'checking' && (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          )}
          {availability === 'available' && (
            <Check className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
          )}
          {availability === 'taken' && (
            <X className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {availability === 'available' && username !== currentUsername && (
          <p className="text-xs text-emerald-600 font-semibold">Username tersedia!</p>
        )}
        {availability === 'taken' && (
          <p className="text-xs text-red-500 font-semibold">Username sudah digunakan</p>
        )}
        {username.length > 0 && username.length < 3 && (
          <p className="text-xs text-gray-400">Minimal 3 karakter</p>
        )}

        <p className="text-xs text-gray-400">
          Format: huruf kecil, angka, underscore (3-30 karakter)
        </p>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="flex-1 bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold py-2.5 rounded-xl transition-colors text-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            type="button"
            onClick={cancelEditing}
            disabled={isSubmitting}
            className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-colors text-sm cursor-pointer"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
