import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { useGateOperatorAssignment } from '../../application/useGateOperatorAssignment';
import { GateOperatorForm } from '../components/GateOperatorForm';

export function GateOperatorPage() {
  const navigate = useNavigate();
  const {
    event,
    isLoading,
    isListLoading,
    usernameOperator,
    setUsernameOperator,
    assignedOperators,
    handleSubmit,
    handleRevoke,
    isSubmitting,
    isRevoking,
  } = useGateOperatorAssignment();

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
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/organizer/my-events')}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Event Saya
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-bold text-gray-900 truncate">
            {event?.name ?? 'Gate Operators'}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#0064D2]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Assign Gate Operator</h1>
              <p className="text-sm text-gray-500">{event?.name}</p>
            </div>
          </div>

          <GateOperatorForm
            usernameOperator={usernameOperator}
            setUsernameOperator={setUsernameOperator}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            assignedOperators={assignedOperators}
            isListLoading={isListLoading}
            isRevoking={isRevoking}
            onRevoke={handleRevoke}
          />
        </div>
      </div>
    </div>
  );
}
