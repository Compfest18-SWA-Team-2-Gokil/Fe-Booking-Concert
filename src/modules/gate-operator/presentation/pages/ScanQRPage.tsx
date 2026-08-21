import { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/application/useAuth';
import { useGateScan } from '../../application/useGateScan';
import { useCameraScanner } from '../../application/useCameraScanner';
import { CameraViewfinder } from '../components/CameraViewfinder';
import { ManualScanForm } from '../components/ManualScanForm';
import { GateStatsCards } from '../components/GateStatsCards';
import { ScanHistoryList } from '../components/ScanHistoryList';
import { GateScannerHeader } from '../components/GateScannerHeader';

export function ScanQRPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState<'camera' | 'manual'>('camera');

  const {
    isProcessing, scanResults, sessionDisplay,
    admittedCount, rejectedCount, processQR, clearHistory,
  } = useGateScan();

  const {
    isCameraActive, isStartingCamera, cameraError, availableCameras,
    startCamera, stopCamera, switchCamera,
  } = useCameraScanner({ onScanSuccess: processQR });

  useEffect(() => {
    if (mode === 'camera') {
      const timer = setTimeout(() => { void startCamera(); }, 100);
      return () => clearTimeout(timer);
    }
    void stopCamera();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    return () => {
      void stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <GateScannerHeader
          userName={user?.name}
          mode={mode}
          onModeChange={setMode}
        />

        {mode === 'camera' ? (
          <CameraViewfinder
            isCameraActive={isCameraActive}
            isStartingCamera={isStartingCamera}
            cameraError={cameraError}
            availableCameras={availableCameras}
            onStartCamera={() => void startCamera()}
            onStopCamera={stopCamera}
            onSwitchCamera={switchCamera}
          />
        ) : (
          <ManualScanForm isProcessing={isProcessing} onSubmit={processQR} />
        )}

        <GateStatsCards
          admittedCount={admittedCount}
          rejectedCount={rejectedCount}
          sessionDisplay={sessionDisplay}
        />

        <ScanHistoryList scanResults={scanResults} onClear={clearHistory} />
      </div>
    </div>
  );
}
