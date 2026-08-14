import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../application/useLogin';
import { showToast, showAlert } from '../../../../shared/utils/alert';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      showAlert.warning('Data Belum Lengkap', 'Silakan masukkan email dan password kamu.');
      return;
    }

    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          showToast.success(`Selamat datang kembali, ${data.user.name}!`);
        },
        onError: () => {
          showAlert.error(
            'Gagal Masuk',
            'Email atau password yang kamu masukkan salah. Silakan periksa kembali dan coba lagi.'
          );
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border rounded-xl px-3.5 py-2.5 text-[#1A1A1A] text-sm transition-all focus:outline-none focus:ring-2 ${
            login.error
              ? 'border-red-400 bg-red-50/30 focus:ring-red-400'
              : 'border-[#E5E7EB] focus:ring-[#0064D2]'
          }`}
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full border rounded-xl px-3.5 py-2.5 text-[#1A1A1A] text-sm transition-all focus:outline-none focus:ring-2 ${
            login.error
              ? 'border-red-400 bg-red-50/30 focus:ring-red-400'
              : 'border-[#E5E7EB] focus:ring-[#0064D2]'
          }`}
          placeholder="••••••••"
        />
      </div>

      {login.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
          <span>⚠️ Email atau password salah. Silakan periksa kembali.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={login.isPending}
        className="w-full bg-[#0064D2] text-white py-3 rounded-xl font-bold hover:bg-[#0052B0] shadow-md shadow-blue-600/20 transition-all disabled:opacity-60 cursor-pointer"
      >
        {login.isPending ? 'Memproses Masuk...' : 'Masuk'}
      </button>

      <p className="text-center text-sm text-[#6B7280]">
        Belum punya akun?{' '}
        <Link to="/register" className="text-[#0064D2] font-bold hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}

