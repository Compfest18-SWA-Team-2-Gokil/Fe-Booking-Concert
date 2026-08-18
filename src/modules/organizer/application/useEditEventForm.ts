import { getApiErrorMessage } from '../../../shared/utils/apiError';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsApi } from '../../events/infrastructure/eventsApi';
import axiosInstance from '../../../core/api/axiosInstance';
import { showAlert, showToast } from '../../../shared/utils/alert';

export function useEditEventForm() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsApi.getEvent(eventId!).then((r) => r.data),
    enabled: !!eventId,
  });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'music' | 'olahraga' | 'seni' | 'workshop'>('music');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!event) return;
    setName(event.name);
    setDescription(event.description ?? '');
    setCategory(event.category ?? 'music');
    const d = new Date(event.date);
    setDate(d.toISOString().split('T')[0]);
    setTime(d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    setLocation(event.location);
    if (currentImageUrl === undefined) {
      setCurrentImageUrl(event.image_url ?? '');
    }
  }, [event]);

  const uploadImage = useMutation({
    mutationFn: ({ file }: { file: File }) => {
      const form = new FormData();
      form.append('image', file);
      return axiosInstance
        .post<{ image_url: string }>(`/api/v1/events/${eventId}/image`, form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r: any) => r.data);
    },
  });

  const updateEvent = useMutation({
    mutationFn: (payload: Parameters<typeof eventsApi.updateEvent>[1]) =>
      eventsApi.updateEvent(eventId!, payload).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['event', eventId] });
      showToast.success('Event berhasil diperbarui.');
      navigate('/organizer/my-events');
    },
    onError: (err: unknown) => {
      showAlert.error('Gagal Menyimpan Perubahan', getApiErrorMessage(err, 'Gagal memperbarui event.'));
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !date || !location) return;

    setIsSaving(true);
    try {
      if (imageFile) {
        await uploadImage.mutateAsync({ file: imageFile });
      }
      const isoDateTime = new Date(`${date}T${time}:00`).toISOString();
      await updateEvent.mutateAsync({
        name,
        description: description || '',
        category,
        date: isoDateTime,
        location,
      });
    } catch {
      // Error handled by mutations
    } finally {
      setIsSaving(false);
    }
  }

  const previewSrc = imageFile ? URL.createObjectURL(imageFile) : (currentImageUrl || undefined);

  return {
    eventId,
    event,
    isLoadingEvent,
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
    handleSubmit,
    isSaving,
  };
}
