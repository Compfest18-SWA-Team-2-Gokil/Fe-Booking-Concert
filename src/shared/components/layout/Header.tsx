import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../../modules/auth/application/useAuth';
import { showAlert, showToast } from '../../utils/alert';
import logoSvg from '../../../assets/logo.svg';
import { getNavLinks, getDropdownItems, type NavLink } from './header/headerConfig';
import { HeaderUserDropdown } from './header/HeaderUserDropdown';
import { HeaderMobileDrawer } from './header/HeaderMobileDrawer';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    const isConfirmed = await showAlert.confirm({
      title: 'Keluar dari Akun?',
      text: 'Kamu harus masuk kembali untuk membeli atau melihat tiketmu.',
      confirmText: 'Ya, Keluar',
      cancelText: 'Batal',
      icon: 'warning',
      isDanger: true,
    });

    if (isConfirmed) {
      logout();
      showToast.info('Kamu telah keluar dari akun');
      navigate('/');
    }
  }

  const isActive = (link: NavLink) => {
    if (link.matchPrefix) return location.pathname.startsWith(link.matchPrefix);
    return location.pathname === link.to;
  };

  const navLinks = getNavLinks(user?.role);
  const dropdownItems = getDropdownItems(user?.role);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand + Nav */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoSvg}
              alt="Tiketin Aja Logo"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-[#0064D2] transition-colors">
              Tiketin<span className="text-[#0064D2]">Aja</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link)
                    ? 'bg-blue-50 text-[#0064D2]'
                    : 'text-gray-700 hover:text-[#0064D2] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Auth / User */}
        <div className="flex items-center gap-3">
          {user ? (
            <HeaderUserDropdown
              user={user}
              isOpen={dropdownOpen}
              dropdownItems={dropdownItems}
              onToggle={() => setDropdownOpen((p) => !p)}
              onClose={() => setDropdownOpen(false)}
              onLogout={handleLogout}
            />
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

          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <HeaderMobileDrawer
        isOpen={mobileMenuOpen}
        user={user}
        navLinks={navLinks}
        dropdownItems={dropdownItems}
        currentPath={location.pathname}
        onClose={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}
