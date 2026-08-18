import { Link } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import type { DropdownItem } from './headerConfig';
import { ROLE_LABEL, ROLE_BADGE, getAvatarBg } from './headerConfig';
import type { User } from '../../../../modules/auth/domain/User';

interface HeaderUserDropdownProps {
  user: User;
  isOpen: boolean;
  dropdownItems: DropdownItem[];
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
}

export function HeaderUserDropdown({
  user,
  isOpen,
  dropdownItems,
  onToggle,
  onClose,
  onLogout,
}: HeaderUserDropdownProps) {
  const avatarBg = getAvatarBg(user.role);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none cursor-pointer"
      >
        <div
          className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-sm ${avatarBg}`}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</span>
          <span className="text-[11px] text-gray-400 font-medium">
            {ROLE_LABEL[user.role] ?? user.role}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-medium">Masuk sebagai</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <span
              className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                ROLE_BADGE[user.role] ?? 'bg-gray-100 text-gray-600'
              }`}
            >
              {ROLE_LABEL[user.role] ?? user.role}
            </span>
          </div>

          {dropdownItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <item.icon className="w-4 h-4 text-[#0064D2]" />
              {item.label}
            </Link>
          ))}

          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={onLogout}
            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-600" />
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}
