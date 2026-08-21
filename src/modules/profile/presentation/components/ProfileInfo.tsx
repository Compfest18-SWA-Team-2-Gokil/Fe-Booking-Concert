import type { ProfileData } from '../../domain/types';

interface ProfileInfoProps {
  profile: ProfileData;
}

const ROLE_LABEL: Record<string, string> = {
  BUYER: 'Pembeli',
  ORGANIZER: 'Organizer',
  GATE_OPERATOR: 'Gate Operator',
  ADMIN: 'Platform Admin',
};

const ROLE_BADGE: Record<string, string> = {
  BUYER: 'bg-blue-100 text-[#0064D2]',
  ORGANIZER: 'bg-purple-100 text-purple-700',
  GATE_OPERATOR: 'bg-emerald-100 text-emerald-700',
  ADMIN: 'bg-red-100 text-red-700',
};

export function ProfileInfo({ profile }: ProfileInfoProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-sm font-bold text-gray-800 mb-4">Informasi Akun</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0064D2] to-blue-700 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-md">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-black text-gray-900">{profile.name}</p>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ROLE_BADGE[profile.role] ?? 'bg-gray-100 text-gray-600'
              }`}
            >
              {ROLE_LABEL[profile.role] ?? profile.role}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 w-20">Email</span>
            <span className="text-sm text-gray-900">{profile.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 w-20">Username</span>
            <span className="text-sm font-mono text-gray-900">@{profile.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
