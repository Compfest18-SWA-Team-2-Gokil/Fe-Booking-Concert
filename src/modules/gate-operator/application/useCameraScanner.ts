import { useState, useRef, useCallback, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats, type CameraDevice } from 'html5-qrcode';

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
  const onScanSuccessRef = useRef(onScanSuccess);

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  const lastScanRef = useRef<{ text: string; ts: number }>({ text: '', ts: 0 });

  const stopCamera = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch {
        // Abaikan error stop
      }
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
    setIsStartingCamera(false);
  }, []);

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

        // Berikan waktu DOM mounting
        await new Promise((resolve) => setTimeout(resolve, 150));

        // Inisialisasi scanner dengan format fokus QR_CODE dan akselerasi BarcodeDetector API browser
        const html5QrCode = new Html5Qrcode(QR_READER_ELEMENT_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
        });
        html5QrCodeRef.current = html5QrCode;

        lastScanRef.current = { text: '', ts: 0 };

        // Konfigurasi scan area responsif & framerate tinggi
        await html5QrCode.start(
          selectedDevice.id,
          {
            fps: 20, // 20 FPS untuk respons cepat
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              // Area scan mencakup 85% area kamera agar user tidak harus mengepaskan di kotak sempit
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdge * 0.85);
              return {
                width: Math.max(qrboxSize, 220),
                height: Math.max(qrboxSize, 220),
              };
            },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            const now = Date.now();
            const last = lastScanRef.current;

            // Cegah duplicate scan string yang sama dalam 2.5 detik
            if (decodedText === last.text && now - last.ts < 2500) {
              return;
            }

            lastScanRef.current = { text: decodedText, ts: now };
            onScanSuccessRef.current(decodedText);
          },
          () => {
            // Abaikan frame decode miss
          }
        );

        setIsCameraActive(true);
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
    [selectedCameraIndex, stopCamera]
  );

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
