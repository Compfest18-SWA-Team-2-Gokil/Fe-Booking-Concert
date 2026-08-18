import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

interface CreateEventSuccessCardProps {
  createdEvent: { id: string; name: string };
}

export function CreateEventSuccessCard({ createdEvent }: CreateEventSuccessCardProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-1">Event Berhasil Dibuat!</h2>
        <p className="text-sm text-gray-500 mb-6">
          Event <span className="font-bold text-gray-900">"{createdEvent.name}"</span> siap
          dikonfigurasi tiketnya.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/organizer/events/${createdEvent.id}/ticket-types`)}
            className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-md cursor-pointer"
          >
            Buat Ticket Types
          </button>
          <button
            onClick={() => navigate('/organizer/my-events')}
            className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer text-sm"
          >
            Kembali ke Event Saya
          </button>
        </div>
      </div>
    </div>
  );
}
