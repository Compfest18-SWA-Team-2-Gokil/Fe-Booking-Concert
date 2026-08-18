import { getApiErrorMessage } from '../../../shared/utils/apiError';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../../events/infrastructure/eventsApi';
import axiosInstance from '../../../core/api/axiosInstance';
import { showAlert } from '../../../shared/utils/alert';

export function useCreateEventForm() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'music' | 'olahraga' | 'seni' | 'workshop'>('music');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<{ id: string; name: string } | null>(null);

  const createEvent = useMutation({
    mutationFn: (payload: Parameters<typeof eventsApi.createEvent>[0]) =>
      eventsApi.createEvent(payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (err: unknown) => {
      showAlert.error('Gagal Membuat Event', getApiErrorMessage(err, 'Gagal membuat event. Silakan periksa kembali formulir.'));
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !date || !location) return;

    if (!imageFile) {
      showAlert.error('Poster Event Wajib', 'Silakan pilih foto poster event terlebih dahulu.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isoDateTime = new Date(`${date}T${time}:00`).toISOString();
      const res = await createEvent.mutateAsync({
        name,
        description: description || '',
        category,
        date: isoDateTime,
        location,
      });

      if (imageFile && res?.id) {
        const form = new FormData();
        form.append('image', imageFile);
        await axiosInstance.post(`/api/v1/events/${res.id}/image`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (res?.id) {
        setCreatedEvent({ id: res.id, name: res.name || name });
      }
    } catch {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  }

  const previewSrc = imageFile ? URL.createObjectURL(imageFile) : undefined;

  return {
    name,
    setName,
    description,
    setDescription,
    category,
    setCategory,
    date,
    setDate,
    time,
    setTime,
    location,
    setLocation,
    setImageFile,
    previewSrc,
    createdEvent,
    handleSubmit,
    isSubmitting,
  };
}
