import { Eye, EyeOff, Loader2, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ChangePasswordFormProps {
  oldPassword: string;
  setOldPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  validationError: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function ChangePasswordForm({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isOpen,
  toggleOpen,
  isSubmitting,
  canSubmit,
  validationError,
  onSubmit,
}: ChangePasswordFormProps) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-bold text-gray-800">Ganti Password</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div className="relative">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Password Lama</label>
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan password lama"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2] pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Password Baru</label>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2] pr-10"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2] pr-10"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {validationError && (
            <p className="text-xs text-red-500 font-semibold">{validationError}</p>
          )}

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold py-3 rounded-xl transition-colors text-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengubah Password...
              </span>
            ) : (
              'Simpan Password Baru'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
