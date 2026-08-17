import { useState, useEffect } from 'react';
import { QrCode, Wifi, Camera, Keyboard } from 'lucide-react';
import { useAuth } from '../../../auth/application/useAuth';
import { useGateScan } from '../../application/useGateScan';
import { useCameraScanner } from '../../application/useCameraScanner';
import { CameraViewfinder } from '../components/CameraViewfinder';
import { ManualScanForm } from '../components/ManualScanForm';
import { GateStatsCards } from '../components/GateStatsCards';
import { ScanHistoryList } from '../components/ScanHistoryList';

export function ScanQRPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');

  const {
    isProcessing,
    scanResults,
    sessionDisplay,
    admittedCount,
    rejectedCount,
    processQR,
    clearHistory,
  } = useGateScan();

  const {
    isCameraActive,
    isStartingCamera,
    cameraError,
    availableCameras,
    startCamera,
    stopCamera,
    switchCamera,
  } = useCameraScanner({
    onScanSuccess: processQR,
  });

  // Auto-start kamera saat mount atau saat switch kembali ke mode camera
  // Pakai useEffect supaya DOM sudah render dulu sebelum html5-qrcode attach
  useEffect(() => {
    if (mode === 'camera') {
      // Delay 100ms untuk pastikan DOM sudah flush
      const timer = setTimeout(() => {
        startCamera();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      stopCamera();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Cleanup kamera saat komponen di-unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0064D2] flex items-center justify-center shadow-md shadow-blue-200">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black">Gate Scanner</h1>
              <p className="text-xs text-gray-400">Gate Operator · {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
            <Wifi className="w-3.5 h-3.5" />
            Online
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 mb-6">
          <button
            onClick={() => setMode('camera')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              mode === 'camera'
                ? 'bg-[#0064D2] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Kamera Scanner</span>
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              mode === 'manual'
                ? 'bg-[#0064D2] text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Input / Barcode Gun Manual</span>
          </button>
        </div>

        {/* Camera Viewport or Manual Form */}
        {mode === 'camera' ? (
          <CameraViewfinder
            isCameraActive={isCameraActive}
            isStartingCamera={isStartingCamera}
            cameraError={cameraError}
            availableCameras={availableCameras}
            onStartCamera={() => startCamera()}
            onStopCamera={stopCamera}
            onSwitchCamera={switchCamera}
          />
        ) : (
          <ManualScanForm isProcessing={isProcessing} onSubmit={processQR} />
        )}

        {/* Real-time Session Stats */}
        <GateStatsCards
          admittedCount={admittedCount}
          rejectedCount={rejectedCount}
          sessionDisplay={sessionDisplay}
        />

        {/* Scan History */}
        <ScanHistoryList scanResults={scanResults} onClear={clearHistory} />
      </div>
    </div>
  );
}
