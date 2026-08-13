import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../application/useLogin';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:border-transparent"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      {login.error && (
        <p className="text-red-600 text-sm">
          Email atau password salah. Silakan coba lagi.
        </p>
      )}

      <button
        type="submit"
        disabled={login.isPending}
        className="w-full bg-[#0064D2] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0052B0] transition-colors disabled:opacity-60"
      >
        {login.isPending ? 'Memproses...' : 'Masuk'}
      </button>

      <p className="text-center text-sm text-[#6B7280]">
        Belum punya akun?{' '}
        <Link to="/register" className="text-[#0064D2] font-medium hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
