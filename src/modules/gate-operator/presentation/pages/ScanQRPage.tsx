import { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black">Gate Scanner Kamera</h1>
              <p className="text-xs text-gray-400">Gate Operator · {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-950 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-800">
            <Wifi className="w-3.5 h-3.5" />
            Online
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800 mb-6">
          <button
            onClick={() => {
              setMode('camera');
              if (!isCameraActive) startCamera();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              mode === 'camera'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Kamera Scanner</span>
          </button>
          <button
            onClick={() => {
              setMode('manual');
              stopCamera();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              mode === 'manual'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
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
