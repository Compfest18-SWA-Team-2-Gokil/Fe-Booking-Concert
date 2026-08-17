import { useState, useRef } from 'react';
import { QrCode } from 'lucide-react';

interface ManualScanFormProps {
  isProcessing: boolean;
  onSubmit: (qrContent: string) => void;
}

export function ManualScanForm({ isProcessing, onSubmit }: ManualScanFormProps) {
  const [qrInput, setQrInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!qrInput.trim()) return;
    onSubmit(qrInput.trim());
    setQrInput('');
    inputRef.current?.focus();
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
      <p className="text-sm font-bold text-gray-900 mb-1">
        Input String QR / Barcode Scanner Gun
      </p>
      <p className="text-xs text-gray-500 mb-4">
        Arahkan scanner eksternal atau tempel string QR tiket di bawah lalu tekan Enter.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={qrInput}
          onChange={(e) => setQrInput(e.target.value)}
          placeholder="Tempel string QR tiket di sini..."
          autoFocus
          className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0064D2] font-mono"
        />

        <button
          type="submit"
          disabled={isProcessing || !qrInput.trim()}
          className="w-full bg-[#0064D2] hover:bg-[#0052B0] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-blue-200 flex items-center gap-2 justify-center text-sm cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          {isProcessing ? 'Memverifikasi...' : 'Verifikasi Tiket'}
        </button>
      </form>
    </div>
  );
}
