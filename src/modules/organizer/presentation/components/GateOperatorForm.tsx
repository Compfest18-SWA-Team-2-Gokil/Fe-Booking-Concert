import { Check, Copy } from 'lucide-react';

interface GateOperatorFormProps {
  operatorId: string;
  setOperatorId: (v: string) => void;
  assigned: string | null;
  copied: boolean;
  onCopy: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function GateOperatorForm({
  operatorId,
  setOperatorId,
  assigned,
  copied,
  onCopy,
  onSubmit,
  isSubmitting,
}: GateOperatorFormProps) {
  return (
    <div className="space-y-6">
      {assigned && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-green-800">Operator Berhasil Di-assign!</p>
              <p className="text-xs text-green-600 font-mono mt-0.5">{assigned}</p>
            </div>
          </div>
          <button
            onClick={() => onCopy(assigned)}
            className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin' : 'Salin ID'}
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            User ID Gate Operator (UUID)
          </label>
          <input
            type="text"
            required
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
            placeholder="cth. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2]"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Pastikan user yang di-assign memiliki akun dengan role GATE_OPERATOR.
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
    </div>
  );
}
