import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useEditEventForm } from '../../application/useEditEventForm';
import { EditEventForm } from '../components/EditEventForm';

export function EditEventPage() {
  const navigate = useNavigate();
  const {
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
    onRemoveImage,
    previewSrc,
    handleSubmit,
    isSaving,
  } = useEditEventForm();

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#0064D2] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Memuat data event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 text-center">
        <p className="text-gray-500 text-sm">Event tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/organizer/my-events')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Event Saya
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-bold text-gray-900 truncate">Edit Event</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <Save className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Edit Event</h1>
              <p className="text-sm text-gray-500 truncate">{event.name}</p>
            </div>
          </div>

          <EditEventForm
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            location={location}
            setLocation={setLocation}
            setImageFile={setImageFile}
            onRemoveImage={onRemoveImage}
            previewSrc={previewSrc}
            onSubmit={handleSubmit}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
