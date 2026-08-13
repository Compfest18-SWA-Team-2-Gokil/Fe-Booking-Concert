import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../../application/useRegister';
import buyerImage from '../../../../assets/roles/buyer.png';
import organizerImage from '../../../../assets/roles/organizer.png';
import gateOperatorImage from '../../../../assets/roles/gate-operator.png';
import adminImage from '../../../../assets/roles/admin.png';

const ROLES = [
  { value: 'BUYER', label: 'Pembeli', image: buyerImage },
  { value: 'ORGANIZER', label: 'Organizer', image: organizerImage },
  { value: 'GATE_OPERATOR', label: 'Gate Operator', image: gateOperatorImage },
  { value: 'ADMIN', label: 'Admin', image: adminImage },
];

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BUYER');
  const register = useRegister();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    register.mutate({ name, email, password, role });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Nama Lengkap</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:border-transparent"
          placeholder="Nama kamu"
        />
      </div>
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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:border-transparent"
          placeholder="Minimal 6 karakter"
        />
      </div>
      <div>
        <p className="block text-sm font-medium text-[#1A1A1A] mb-2">Daftar sebagai</p>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((option) => {
            const isSelected = role === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                aria-pressed={isSelected}
                className={`flex min-h-28 flex-col items-center justify-center rounded-xl border-2 p-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#0064D2] focus:ring-offset-2 ${
                  isSelected
                    ? 'border-[#0064D2] bg-blue-50 text-[#0064D2] shadow-sm'
                    : 'border-[#E5E7EB] bg-white text-[#1A1A1A] hover:border-blue-200 hover:bg-blue-50/50'
                }`}
              >
                <img src={option.image} alt="" className="h-16 w-16 object-contain" />
                <span className="mt-1 text-xs font-semibold">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {register.error && (
        <p className="text-red-600 text-sm">
          Pendaftaran gagal. Email mungkin sudah digunakan.
        </p>
      )}

      {register.isSuccess && (
        <p className="text-green-600 text-sm">
          Pendaftaran berhasil! Redirecting ke halaman login...
        </p>
      )}

      <button
        type="submit"
        disabled={register.isPending}
        className="w-full bg-[#0064D2] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0052B0] transition-colors disabled:opacity-60"
      >
        {register.isPending ? 'Mendaftarkan...' : 'Daftar Sekarang'}
      </button>

      <p className="text-center text-sm text-[#6B7280]">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-[#0064D2] font-medium hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}
