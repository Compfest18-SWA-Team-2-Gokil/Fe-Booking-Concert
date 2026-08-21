import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { profileApi } from '../infrastructure/profileApi';
import { showAlert, showToast } from '../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../shared/utils/apiError';

export function useChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const validationError = (() => {
    if (!oldPassword) return '';
    if (!newPassword) return '';
    if (newPassword.length < 8) return 'Password baru minimal 8 karakter';
    if (newPassword !== confirmPassword) return 'Konfirmasi password tidak cocok';
    return '';
  })();

  const canSubmit = oldPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

  const mutation = useMutation({
    mutationFn: () => profileApi.changePassword(oldPassword, newPassword),
    onSuccess: () => {
      showToast.success('Password berhasil diubah!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsOpen(false);
    },
    onError: (err: unknown) => {
      showAlert.error('Gagal Mengubah Password', getApiErrorMessage(err, 'Gagal mengubah password.'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    mutation.mutate();
  };

  const toggleOpen = () => {
    if (isOpen) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsOpen(!isOpen);
  };

  return {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isOpen,
    toggleOpen,
    isSubmitting: mutation.isPending,
    canSubmit,
    validationError,
    handleSubmit,
  };
}
