import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, AlertTriangle } from 'lucide-react';
import { useProfile } from '../../application/useProfile';
import { useEditUsername } from '../../application/useEditUsername';
import { useChangePassword } from '../../application/useChangePassword';
import { ProfileInfo } from '../components/ProfileInfo';
import { EditUsernameForm } from '../components/EditUsernameForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { MyTicketsSummary } from '../components/MyTicketsSummary';
import { Skeleton } from '../../../../shared/components/ui/Skeleton';

export function ProfilePage() {
  const navigate = useNavigate();
  const { profile, isLoading, isError } = useProfile();
  const editUsername = useEditUsername(profile?.username ?? '');
  const changePassword = useChangePassword();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <Skeleton className="w-24 h-5 rounded" variant="shimmer" />
            <span className="text-gray-300">/</span>
            <Skeleton className="w-32 h-5 rounded" variant="shimmer" />
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
          <Skeleton className="w-full h-40 rounded-3xl" variant="shimmer" />
          <Skeleton className="w-full h-24 rounded-3xl" variant="shimmer" />
          <Skeleton className="w-full h-24 rounded-3xl" variant="shimmer" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20">
        <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <AlertTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-900 mb-2">Gagal Memuat Profil</h2>
            <p className="text-gray-500 text-sm">Terjadi kendala saat mengambil data profil. Silakan coba lagi.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-bold text-gray-900">Profil Saya</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#0064D2] flex items-center justify-center shadow-md shadow-blue-200">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profil Saya</h1>
            <p className="text-sm text-gray-500">Kelola informasi akun dan password</p>
          </div>
        </div>

        <div className="space-y-4">
          <ProfileInfo profile={profile} />
          <EditUsernameForm
            currentUsername={profile.username}
            username={editUsername.username}
            setUsername={editUsername.setUsername}
            availability={editUsername.availability}
            isEditing={editUsername.isEditing}
            isSubmitting={editUsername.isSubmitting}
            canSubmit={editUsername.canSubmit}
            startEditing={editUsername.startEditing}
            cancelEditing={editUsername.cancelEditing}
            onSubmit={editUsername.handleSubmit}
          />
          <ChangePasswordForm
            oldPassword={changePassword.oldPassword}
            setOldPassword={changePassword.setOldPassword}
            newPassword={changePassword.newPassword}
            setNewPassword={changePassword.setNewPassword}
            confirmPassword={changePassword.confirmPassword}
            setConfirmPassword={changePassword.setConfirmPassword}
            isOpen={changePassword.isOpen}
            toggleOpen={changePassword.toggleOpen}
            isSubmitting={changePassword.isSubmitting}
            canSubmit={changePassword.canSubmit}
            validationError={changePassword.validationError}
            onSubmit={changePassword.handleSubmit}
          />
          <MyTicketsSummary />
        </div>
      </div>
    </div>
  );
}
