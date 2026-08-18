import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import type { NavLink, DropdownItem } from './headerConfig';
import type { User } from '../../../../modules/auth/domain/User';

interface HeaderMobileDrawerProps {
  isOpen: boolean;
  user: User | null;
  navLinks: NavLink[];
  dropdownItems: DropdownItem[];
  currentPath: string;
  onClose: () => void;
  onLogout: () => void;
}

export function HeaderMobileDrawer({
  isOpen,
  user,
  navLinks,
  dropdownItems,
  currentPath,
  onClose,
  onLogout,
}: HeaderMobileDrawerProps) {
  if (!isOpen) return null;

  const isActive = (link: NavLink) => {
    if (link.matchPrefix) return currentPath.startsWith(link.matchPrefix);
    return currentPath === link.to;
  };

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
      <nav className="flex flex-col space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm ${
              isActive(link) ? 'bg-blue-50 text-[#0064D2]' : 'text-gray-700'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {user ? (
        <div className="pt-2 border-t border-gray-100 space-y-1">
          {dropdownItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 rounded-xl hover:bg-gray-50"
            >
              <item.icon className="w-4 h-4 text-[#0064D2]" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={onLogout}
            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            Keluar
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <Link
            to="/login"
            onClick={onClose}
            className="w-full text-center py-2.5 rounded-xl border border-[#0064D2] text-[#0064D2] font-semibold text-sm"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            onClick={onClose}
            className="w-full text-center py-2.5 rounded-full bg-[#0064D2] text-white font-semibold text-sm shadow-md"
          >
            Daftar
          </Link>
        </div>
      )}
    </div>
  );
}
