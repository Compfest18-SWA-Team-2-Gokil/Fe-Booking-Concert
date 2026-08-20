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
  const [currentFacingMode, setCurrentFacingMode] = useState<'environment' | 'user'>('environment');

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
        // Abaikan error saat stop
      }
      html5QrCodeRef.current = null;
    }
    setIsCameraActive(false);
    setIsStartingCamera(false);
  }, []);

  const startCamera = useCallback(
    async (targetFacing: 'environment' | 'user' = 'environment', targetDeviceId?: string) => {
      setCameraError(null);
      setIsStartingCamera(true);

      try {
        await stopCamera();

        // Cari kamera yang tersedia
        let devices: CameraDevice[] = [];
        try {
          devices = await Html5Qrcode.getCameras();
          if (devices && devices.length > 0) {
            setAvailableCameras(devices);
          }
        } catch {
          // Abaikan jika browser membatasi getCameras sebelum izin
        }

        // Tentukan konfigurasi kamera:
        // Utamakan targetDeviceId jika diberikan, atau cari device id yang sesuai targetFacing,
        // atau gunakan constraint { facingMode: targetFacing } (standar kamera HP)
        let cameraConfig: string | { facingMode: string } = { facingMode: targetFacing };

        if (targetDeviceId) {
          cameraConfig = targetDeviceId;
        } else if (devices && devices.length > 0) {
          const isBack = targetFacing === 'environment';
          const matched = devices.find((d) => {
            const lbl = (d.label || '').toLowerCase();
            return isBack
              ? lbl.includes('back') || lbl.includes('rear') || lbl.includes('belakang') || lbl.includes('environment')
              : lbl.includes('front') || lbl.includes('user') || lbl.includes('depan') || lbl.includes('selfie');
          });
          if (matched) {
            cameraConfig = matched.id;
          }
        }

        // Berikan waktu render DOM
        await new Promise((resolve) => setTimeout(resolve, 150));

        const html5QrCode = new Html5Qrcode(QR_READER_ELEMENT_ID, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
        });
        html5QrCodeRef.current = html5QrCode;

        lastScanRef.current = { text: '', ts: 0 };

        await html5QrCode.start(
          cameraConfig,
          {
            fps: 20, // FPS responsif
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
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

            // Cegah scan ganda dalam 2.5 detik
            if (decodedText === last.text && now - last.ts < 2500) {
              return;
            }

            lastScanRef.current = { text: decodedText, ts: now };
            onScanSuccessRef.current(decodedText);
          },
          () => {
            // Frame miss
          }
        );

        setCurrentFacingMode(targetFacing);
        setIsCameraActive(true);
        setIsStartingCamera(false);
      } catch (err: unknown) {
        // Fallback jika deviceId spesifik gagal, coba fallback langsung ke facingMode
        try {
          if (html5QrCodeRef.current && !html5QrCodeRef.current.isScanning) {
            await html5QrCodeRef.current.start(
              { facingMode: targetFacing },
              { fps: 20 },
              (decodedText) => onScanSuccessRef.current(decodedText),
              () => {}
            );
            setCurrentFacingMode(targetFacing);
            setIsCameraActive(true);
            setIsStartingCamera(false);
            return;
          }
        } catch {
          // Fallback gagal
        }

        const errorMsg =
          err instanceof Error
            ? err.message
            : 'Gagal mengakses kamera. Pastikan izin kamera aktif di browser.';
        setCameraError(errorMsg);
        setIsCameraActive(false);
        setIsStartingCamera(false);
      }
    },
    [stopCamera]
  );

  const switchCamera = useCallback(async () => {
    const nextFacing = currentFacingMode === 'environment' ? 'user' : 'environment';
    setCurrentFacingMode(nextFacing);

    // Cari device id untuk facing mode berikutnya jika ada
    let targetDeviceId: string | undefined = undefined;
    if (availableCameras.length > 1) {
      const isBack = nextFacing === 'environment';
      const matched = availableCameras.find((d) => {
        const lbl = (d.label || '').toLowerCase();
        return isBack
          ? lbl.includes('back') || lbl.includes('rear') || lbl.includes('belakang')
          : lbl.includes('front') || lbl.includes('user') || lbl.includes('depan') || lbl.includes('selfie');
      });
      if (matched) {
        targetDeviceId = matched.id;
      }
    }

    await startCamera(nextFacing, targetDeviceId);
  }, [availableCameras, currentFacingMode, startCamera]);

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
    currentFacingMode,
    startCamera: () => startCamera('environment'),
    stopCamera,
    switchCamera,
  };
}
