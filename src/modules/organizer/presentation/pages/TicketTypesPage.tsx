import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTicketTypesManagement } from '../../application/useTicketTypesManagement';
import { CreateTicketTypeForm } from '../components/CreateTicketTypeForm';
import { TicketTypesList } from '../components/TicketTypesList';

export function TicketTypesPage() {
  const navigate = useNavigate();
  const {
    event,
    ticketTypes,
    isLoading,
    name,
    setName,
    price,
    setPrice,
    kind,
    setKind,
    quota,
    setQuota,
    handleSubmit,
    isSubmitting,
  } = useTicketTypesManagement();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="animate-spin w-8 h-8 border-4 border-[#0064D2] border-t-transparent rounded-full mx-auto mb-3" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/organizer/my-events')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Event Saya
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-bold text-gray-900 truncate">{event?.name ?? 'Ticket Types'}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Kelola Ticket Types</h1>
          <p className="text-sm text-gray-500 mt-1">{event?.name}</p>
        </div>

        <CreateTicketTypeForm
          name={name}
          setName={setName}
          price={price}
          setPrice={setPrice}
          kind={kind}
          setKind={setKind}
          quota={quota}
          setQuota={setQuota}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <TicketTypesList ticketTypes={ticketTypes} />
      </div>
    </div>
  );
}
