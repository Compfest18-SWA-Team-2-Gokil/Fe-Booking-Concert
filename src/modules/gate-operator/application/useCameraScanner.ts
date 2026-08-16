import { useState, useRef, useCallback, useEffect } from 'react';
import { Html5Qrcode, type CameraDevice } from 'html5-qrcode';

export const QR_READER_ELEMENT_ID = 'gate-qr-reader';

interface UseCameraScannerOptions {
  onScanSuccess: (decodedText: string) => void;
}

export function useCameraScanner({ onScanSuccess }: UseCameraScannerOptions) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Stop camera stream safely
  const stopCamera = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch {
        // Ignore stop error
      }
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
    setIsStartingCamera(false);
  }, []);

  // Start live camera
  const startCamera = useCallback(
    async (cameraIdx = selectedCameraIndex) => {
      setCameraError(null);
      setIsStartingCamera(true);

      try {
        await stopCamera();

        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) {
          setCameraError('Tidak ditemukan kamera pada perangkat ini.');
          setIsStartingCamera(false);
          return;
        }

        setAvailableCameras(devices);
        const validIdx = cameraIdx >= 0 && cameraIdx < devices.length ? cameraIdx : 0;
        setSelectedCameraIndex(validIdx);
        const selectedDevice = devices[validIdx];

        setIsCameraActive(true);

        // Allow DOM rendering time
        await new Promise((resolve) => setTimeout(resolve, 150));

        const html5QrCode = new Html5Qrcode(QR_READER_ELEMENT_ID);
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          selectedDevice.id,
          {
            fps: 15,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          () => {
            // Ignore frame decode errors
          }
        );

        setIsStartingCamera(false);
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : 'Gagal mengakses kamera. Pastikan izin kamera aktif di browser.';
        setCameraError(errorMsg);
        setIsCameraActive(false);
        setIsStartingCamera(false);
      }
    },
    [selectedCameraIndex, stopCamera, onScanSuccess]
  );

  // Switch camera device
  const switchCamera = useCallback(() => {
    if (availableCameras.length <= 1) return;
    const nextIdx = (selectedCameraIndex + 1) % availableCameras.length;
    setSelectedCameraIndex(nextIdx);
    startCamera(nextIdx);
  }, [availableCameras, selectedCameraIndex, startCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    isCameraActive,
    isStartingCamera,
    cameraError,
    availableCameras,
    startCamera,
    stopCamera,
    switchCamera,
  };
}
