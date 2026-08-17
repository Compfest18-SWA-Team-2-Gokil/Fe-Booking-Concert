import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  X, LogOut, Ticket, Plus, QrCode,
  Shield, Music, Calendar, RotateCcw,
} from 'lucide-react';
import { useAuth } from '../../../modules/auth/application/useAuth';
import { showAlert, showToast } from '../../utils/alert';
import { usePrefetch } from '../../hooks/usePrefetch';
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

function NavItem({
  to,
  icon: Icon,
  label,
  matchPrefix,
  onClick,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  matchPrefix?: string;
  onClick?: () => void;
}) {
  const location = useLocation();
  const { prefetchRoute } = usePrefetch();
  const active = matchPrefix ? location.pathname.startsWith(matchPrefix) : location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={() => prefetchRoute(to)}
      onTouchStart={() => prefetchRoute(to)}
      onFocus={() => prefetchRoute(to)}
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

export function SidebarContent({ onClose }: { onClose?: () => void }) {
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

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
        <NavItem to="/events" icon={Music} label="Semua Events" onClick={onClose} />

        {user?.role === 'BUYER' && (
          <NavItem to="/my-tickets" icon={Ticket} label="Tiket Saya" matchPrefix="/my-tickets" onClick={onClose} />
        )}

        {user?.role === 'ORGANIZER' && (
          <>
            <NavItem to="/organizer/my-events" icon={Calendar} label="Event Saya" matchPrefix="/organizer/my-events" onClick={onClose} />
            <NavItem to="/organizer/refunds" icon={RotateCcw} label="Persetujuan Refund" matchPrefix="/organizer/refunds" onClick={onClose} />
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

      {/* User Info & Logout */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-gray-50/90 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0064D2] to-blue-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs text-gray-900 truncate">{user?.name}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                ROLE_BADGE[user?.role ?? ''] ?? 'bg-gray-100 text-gray-600'
              }`}
            >
              {ROLE_LABEL[user?.role ?? ''] ?? user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun</span>
        </button>
      </div>
    </div>
  );
}
