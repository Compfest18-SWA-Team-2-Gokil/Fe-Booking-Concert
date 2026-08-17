import { useState, useEffect, Suspense } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  X, LogOut, Ticket, Plus, QrCode,
  Shield, Music, Calendar, PanelLeftClose, PanelLeft,
} from 'lucide-react';
import { useAuth } from '../../../modules/auth/application/useAuth';
import { Footer } from './Footer';
import { showAlert, showToast } from '../../utils/alert';
import logoSvg from '../../../assets/logo.svg';

const ROLE_BADGE: Record<string, string> = {
  BUYER: 'bg-blue-100 text-[#0064D2]',
  ORGANIZER: 'bg-purple-100 text-purple-700',
  GATE_OPERATOR: 'bg-emerald-100 text-emerald-700',
  ADMIN: 'bg-red-100 text-red-700',
};
const ROLE_LABEL: Record<string, string> = {
  BUYER: 'Pembeli',
  ORGANIZER: 'Organizer',
  GATE_OPERATOR: 'Gate Operator',
  ADMIN: 'Platform Admin',
};

function NavItem({ to, icon: Icon, label, matchPrefix, onClick }: {
  to: string; icon: React.ElementType; label: string; matchPrefix?: string; onClick?: () => void;
}) {
  const location = useLocation();
  const active = matchPrefix ? location.pathname.startsWith(matchPrefix) : location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
        active
          ? 'bg-[#0064D2] text-white shadow-md shadow-blue-600/20'
          : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    const isConfirmed = await showAlert.confirm({
      title: 'Keluar dari Akun?',
      text: 'Kamu harus masuk kembali untuk membeli atau melihat tiketmu.',
      confirmText: 'Ya, Keluar',
      cancelText: 'Tetap di Sini',
      icon: 'warning',
      isDanger: true,
    });

    if (isConfirmed) {
      logout();
      showToast.info('Kamu telah keluar dari akun');
      navigate('/');
      onClose?.();
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo Header */}
      <div className="px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
          <img src={logoSvg} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-lg text-gray-900">
            Tiketin<span className="text-[#0064D2]">Aja</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
        {/* Global Events Link for all roles */}
        <NavItem to="/events" icon={Music} label="Semua Events" onClick={onClose} />

        {user?.role === 'BUYER' && (
          <NavItem to="/my-tickets" icon={Ticket} label="Tiket Saya" matchPrefix="/my-tickets" onClick={onClose} />
        )}

        {user?.role === 'ORGANIZER' && (
          <>
            <NavItem to="/organizer/my-events" icon={Calendar} label="Event Saya" matchPrefix="/organizer/my-events" onClick={onClose} />
            <NavItem to="/organizer/events/create" icon={Plus} label="Buat Event Baru" matchPrefix="/organizer/events/create" onClick={onClose} />
          </>
        )}

        {user?.role === 'GATE_OPERATOR' && (
          <NavItem to="/gate/scan" icon={QrCode} label="Scan QR Tiket" matchPrefix="/gate" onClick={onClose} />
        )}

        {user?.role === 'ADMIN' && (
          <NavItem to="/admin/dashboard" icon={Shield} label="Admin Panel" matchPrefix="/admin" onClick={onClose} />
        )}
      </nav>

      {/* User info + logout */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-gray-50/90 mb-2">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#0064D2] to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_BADGE[user?.role ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
              {ROLE_LABEL[user?.role ?? ''] ?? user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}

export function SidebarLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing drawer state with route changes
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-sm flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        }`}
      >
        {/* Top Navigation Bar with Toggle Button */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md shadow-xs h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Desktop Toggle Button */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="hidden lg:flex p-2 rounded-xl text-gray-700 hover:text-[#0064D2] hover:bg-blue-50 transition-all cursor-pointer items-center justify-center"
              title={sidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
              aria-label={sidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-6 h-6" />
              ) : (
                <PanelLeft className="w-6 h-6" />
              )}
            </button>

            {/* Mobile Menu Button with same PanelLeft icon */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-[#0064D2] hover:bg-blue-50 transition-all cursor-pointer items-center justify-center"
              aria-label="Buka Menu Sidebar"
              title="Buka Menu"
            >
              <PanelLeft className="w-6 h-6" />
            </button>

            {/* Brand Logo only when desktop sidebar is collapsed or on mobile */}
            <Link
              to="/"
              className={`flex items-center gap-2 ${sidebarOpen ? 'lg:hidden' : 'flex'}`}
            >
              <img src={logoSvg} alt="Logo" className="w-7 h-7 object-contain" />
              <span className="font-extrabold text-base text-gray-900">
                Tiketin<span className="text-[#0064D2]">Aja</span>
              </span>
            </Link>
          </div>

          {/* User Quick Info in Top Bar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-gray-900">{user?.name}</span>
              <span className="text-[10px] text-gray-500 font-medium">
                {ROLE_LABEL[user?.role ?? ''] ?? user?.role}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#0064D2] to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full border-4 border-[#0064D2] border-t-transparent w-10 h-10" />
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </div>
  );
}

