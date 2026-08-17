import { LoginForm } from '../components/LoginForm';
import logoSvg from '../../../../assets/logo.svg';
const loginImage = 'https://res.cloudinary.com/vesdiabb/image/upload/v1786851272/Login.webp';

export function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-16">
        <div className="hidden md:flex items-center justify-center px-4">
          <img src={loginImage} alt="Ilustrasi masuk Tiketin Aja" className="w-full max-w-md object-contain" />
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src={logoSvg} alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-2xl font-bold text-[#0064D2]">Tiketin Aja</span>
            </div>
            <h1 className="text-xl font-semibold text-[#1A1A1A]">Selamat datang kembali</h1>
            <p className="text-[#6B7280] text-sm mt-1">Masuk untuk mulai beli tiket events</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
