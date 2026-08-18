import { getApiErrorMessage } from '../../../../shared/utils/apiError';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useRegister } from '../../application/useRegister';
import { showAlert } from '../../../../shared/utils/alert';

const buyerImage = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786851472/buyer.webp';
const organizerImage = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786851473/organizer.webp';
const gateOperatorImage = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786851472/gate-operator.webp';

const ROLES = [
  { value: 'BUYER', label: 'Pembeli', image: buyerImage },
  { value: 'ORGANIZER', label: 'Organizer', image: organizerImage },
  { value: 'GATE_OPERATOR', label: 'Gate Operator', image: gateOperatorImage },
];

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('BUYER');
  const register = useRegister();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !username.trim() || password.length < 8) {
      showAlert.warning(
        'Format Belum Sesuai',
        'Pastikan nama, username, email terisi dan password minimal 8 karakter.'
      );
      return;
    }

    register.mutate(
      { name, email, username, password, role },
      {
        onSuccess: () => {
          showAlert.success(
            'Pendaftaran Berhasil!',
            'Akunmu telah berhasil dibuat. Silakan masuk untuk mulai bertransaksi.'
          ).then(() => {
            navigate('/login');
          });
        },
        onError: (err: unknown) => {
          showAlert.error(
            'Pendaftaran Gagal',
            getApiErrorMessage(err, 'Pendaftaran gagal. Pastikan data pendaftaranmu sudah benar dan coba lagi.')
          );
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Nama Lengkap</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
          placeholder="Nama kamu"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Username</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
          className="w-full border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
          placeholder="cth. budi_sfo"
          minLength={3}
          maxLength={30}
        />
        <p className="text-xs text-gray-400 mt-1">3-30 karakter, huruf kecil, angka, dan underscore</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1A1A1A] mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#E5E7EB] rounded-xl pl-3.5 pr-10 py-2.5 text-[#1A1A1A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
            placeholder="Minimal 8 karakter"
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

      <div>
        <p className="block text-sm font-bold text-[#1A1A1A] mb-2">Daftar sebagai</p>
        <div className="grid grid-cols-3 gap-3">
          {ROLES.map((option) => {
            const isSelected = role === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                aria-pressed={isSelected}
                className={`flex min-h-28 flex-col items-center justify-center rounded-2xl border-2 p-2 transition-all cursor-pointer focus:outline-none ${
                  isSelected
                    ? 'border-[#0064D2] bg-blue-50/80 text-[#0064D2] shadow-sm'
                    : 'border-[#E5E7EB] bg-white text-[#1A1A1A] hover:border-blue-200 hover:bg-blue-50/30'
                }`}
              >
                <img src={option.image} alt="" className="h-16 w-16 object-contain" />
                <span className="mt-1 text-xs font-bold">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={register.isPending}
        className="w-full bg-[#0064D2] text-white py-3 rounded-xl font-bold hover:bg-[#0052B0] shadow-md shadow-blue-600/20 transition-all disabled:opacity-60 cursor-pointer"
      >
        {register.isPending ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
      </button>

      <p className="text-center text-sm text-[#6B7280]">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-[#0064D2] font-bold hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
}
