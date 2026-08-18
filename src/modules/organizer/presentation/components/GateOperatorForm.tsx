import type { AssignedOperator } from '../../domain/types';
import { UserX, Loader2 } from 'lucide-react';

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

interface GateOperatorFormProps {
  usernameOperator: string;
  setUsernameOperator: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  assignedOperators: AssignedOperator[];
  isListLoading: boolean;
  isRevoking: boolean;
  onRevoke: (userId: string) => void;
}

export function GateOperatorForm({
  usernameOperator,
  setUsernameOperator,
  onSubmit,
  isSubmitting,
  assignedOperators,
  isListLoading,
  isRevoking,
  onRevoke,
}: GateOperatorFormProps) {
  return (
    <div className="space-y-8">
      {/* Assign Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Username Gate Operator
          </label>
          <input
            type="text"
            required
            value={usernameOperator}
            onChange={(e) =>
              setUsernameOperator(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
            }
            placeholder="cth. budi_sfo"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
            minLength={3}
            maxLength={30}
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Masukkan username akun Gate Operator yang ingin ditugaskan.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold py-3 rounded-xl transition-colors text-sm shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Menugaskan...' : 'Tugaskan Gate Operator'}
        </button>
      </form>

      {/* Assigned Operators List */}
      <div>
        <h2 className="text-sm font-bold text-gray-800 mb-3">Operator yang Ditugaskan</h2>

        {isListLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[#0064D2]" />
          </div>
        ) : assignedOperators.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-gray-400">Belum ada gate operator yang ditugaskan.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {assignedOperators.map((op) => (
              <li
                key={op.user_id}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {op.name}{' '}
                    <span className="font-mono font-normal text-gray-400 text-xs">@{op.username}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{op.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Ditugaskan: {formatDate(op.assigned_at)}
                  </p>

                </div>
                <button
                  type="button"
                  disabled={isRevoking}
                  onClick={() => onRevoke(op.user_id)}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  title="Cabut akses operator ini"
                >
                  <UserX className="w-3.5 h-3.5" />
                  Cabut
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
