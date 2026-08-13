import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Ticket, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../modules/auth/application/useAuth';
import logoSvg from '../../assets/logo.svg';

const ROLE_LABEL: Record<string, string> = {
  BUYER: 'Pembeli',
  ORGANIZER: 'Organizer',
  GATE_OPERATOR: 'Gate Operator',
  ADMIN: 'Admin',
};

const ROLE_BADGE: Record<string, string> = {
  BUYER: 'bg-blue-100 text-[#0064D2]',
  ORGANIZER: 'bg-purple-100 text-purple-700',
  GATE_OPERATOR: 'bg-green-100 text-green-700',
  ADMIN: 'bg-red-100 text-red-700',
};

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo using logo.svg */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoSvg} alt="Tiketin Aja Logo" className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
            <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-[#0064D2] transition-colors">
              Tiketin<span className="text-[#0064D2]">Aja</span>
            </span>
          </Link>

          {/* Nav links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'bg-blue-50 text-[#0064D2]'
                  : 'text-gray-700 hover:text-[#0064D2] hover:bg-gray-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/events"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/events')
                  ? 'bg-blue-50 text-[#0064D2]'
                  : 'text-gray-700 hover:text-[#0064D2] hover:bg-gray-50'
              }`}
            >
              Semua Events
            </Link>
          </nav>
        </div>

        {/* Right: Auth / User Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0064D2] to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-sm font-semibold text-gray-800 leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {ROLE_LABEL[user.role] ?? user.role}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${ROLE_BADGE[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {ROLE_LABEL[user.role] ?? user.role}
                    </span>
                  </div>
                  <Link
                    to="/events"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-[#0064D2]" />
                    Tiket Saya / Events
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-[#0064D2] hover:text-[#0052B0] hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="bg-[#0064D2] hover:bg-[#0052B0] text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:scale-105"
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm ${
                isActive('/') ? 'bg-blue-50 text-[#0064D2]' : 'text-gray-700'
              }`}
            >
              Beranda
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm ${
                isActive('/events') ? 'bg-blue-50 text-[#0064D2]' : 'text-gray-700'
              }`}
            >
              Semua Events
            </Link>
          </nav>

          {!user && (
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-[#0064D2] text-[#0064D2] font-semibold text-sm"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-[#0064D2] text-white font-semibold text-sm shadow-md"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

