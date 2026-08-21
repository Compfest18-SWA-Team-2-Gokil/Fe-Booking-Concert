import { QrCode, Wifi, Camera, Keyboard } from 'lucide-react';

interface Props {
  userName?: string;
  mode: 'camera' | 'manual';
  onModeChange: (m: 'camera' | 'manual') => void;
}

export function GateScannerHeader({ userName, mode, onModeChange }: Props) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0064D2] flex items-center justify-center shadow-md shadow-blue-200">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">Gate Scanner</h1>
            <p className="text-xs text-gray-400">Gate Operator · {userName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
          <Wifi className="w-3.5 h-3.5" />
          Online
        </div>
      </div>

      <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 mb-5">
        <button
          onClick={() => onModeChange('camera')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            mode === 'camera' ? 'bg-[#0064D2] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Kamera Scanner</span>
        </button>
        <button
          onClick={() => onModeChange('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            mode === 'manual' ? 'bg-[#0064D2] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>Input / Barcode Manual</span>
        </button>
      </div>
    </>
  );
}
