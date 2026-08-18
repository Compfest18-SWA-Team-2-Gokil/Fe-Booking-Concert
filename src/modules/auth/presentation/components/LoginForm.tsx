import { getApiErrorMessage } from '../../../../shared/utils/apiError';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../../application/useLogin';
import { showToast, showAlert } from '../../../../shared/utils/alert';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        onError: (err: unknown) => {
          showAlert.error(
            'Gagal Masuk',
            getApiErrorMessage(err, 'Email atau password yang kamu masukkan salah. Silakan periksa kembali dan coba lagi.')
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
          className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl pl-3.5 pr-10 py-2.5 text-[#1A1A1A] text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer p-1"
            title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
            aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

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
