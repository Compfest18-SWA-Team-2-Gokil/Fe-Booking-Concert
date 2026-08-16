import { useNavigate } from 'react-router-dom';
import { Tag, ArrowLeft } from 'lucide-react';
import { useCreateEventForm } from '../../application/useCreateEventForm';
import { CreateEventSuccessCard } from '../components/CreateEventSuccessCard';
import { CreateEventForm } from '../components/CreateEventForm';

export function CreateEventPage() {
  const navigate = useNavigate();
  const {
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
  } = useCreateEventForm();

  if (createdEvent) {
    return <CreateEventSuccessCard createdEvent={createdEvent} />;
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
          <span className="text-sm font-bold text-gray-900">Buat Event Baru</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-[#0064D2]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Buat Event Baru</h1>
              <p className="text-sm text-gray-500">
                Isi detail event di bawah untuk mulai mempublikasikan event-mu.
              </p>
            </div>
          </div>

          <CreateEventForm
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
            previewSrc={previewSrc}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
