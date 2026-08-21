import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../infrastructure/profileApi';
import { useAuth } from '../../auth/application/useAuth';
import { showAlert, showToast } from '../../../shared/utils/alert';
import { getApiErrorMessage } from '../../../shared/utils/apiError';

export function useEditUsername(currentUsername: string) {
  const [username, setUsername] = useState(currentUsername);
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { user, login } = useAuth();
  const token = localStorage.getItem('tiketin_token');

  useEffect(() => {
    if (!isEditing) return;
    setUsername(currentUsername);
  }, [currentUsername, isEditing]);

  useEffect(() => {
    if (!isEditing) return;

    const sanitized = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (sanitized !== username) {
      setUsername(sanitized);
      return;
    }

    if (sanitized.length < 3) {
      setAvailability('idle');
      return;
    }

    if (sanitized === currentUsername) {
      setAvailability('idle');
      return;
    }

    setAvailability('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await profileApi.checkUsername(sanitized);
        setAvailability(res.data.available ? 'available' : 'taken');
      } catch {
        setAvailability('idle');
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username, currentUsername, isEditing]);

  const mutation = useMutation({
    mutationFn: (newUsername: string) => profileApi.updateUsername(newUsername),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (user && token) {
        login(token, res.data);
      }
      setIsEditing(false);
      setAvailability('idle');
      showToast.success('Username berhasil diubah!');
    },
    onError: (err: unknown) => {
      showAlert.error('Gagal Mengubah Username', getApiErrorMessage(err, 'Gagal mengubah username.'));
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const sanitized = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
      if (sanitized.length < 3 || sanitized === currentUsername) return;
      if (availability !== 'available') return;
      mutation.mutate(sanitized);
    },
    [username, currentUsername, availability, mutation]
  );

  const startEditing = useCallback(() => {
    setIsEditing(true);
    setUsername(currentUsername);
    setAvailability('idle');
  }, [currentUsername]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setUsername(currentUsername);
    setAvailability('idle');
  }, [currentUsername]);

  return {
    username,
    setUsername,
    availability,
    isEditing,
    isSubmitting: mutation.isPending,
    canSubmit: availability === 'available' && username !== currentUsername && username.length >= 3,
    startEditing,
    cancelEditing,
    handleSubmit,
  };
}
