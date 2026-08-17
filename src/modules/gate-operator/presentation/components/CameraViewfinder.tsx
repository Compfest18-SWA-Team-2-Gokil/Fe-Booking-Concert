import { Camera, CameraOff, RefreshCw, SwitchCamera } from 'lucide-react';
import type { CameraDevice } from 'html5-qrcode';
import { QR_READER_ELEMENT_ID } from '../../application/useCameraScanner';

interface CameraViewfinderProps {
  isCameraActive: boolean;
  isStartingCamera: boolean;
  cameraError: string | null;
  availableCameras: CameraDevice[];
  onStartCamera: () => void;
  onStopCamera: () => void;
  onSwitchCamera: () => void;
}

export function CameraViewfinder({
  isCameraActive,
  isStartingCamera,
  cameraError,
  availableCameras,
  onStartCamera,
  onStopCamera,
  onSwitchCamera,
}: CameraViewfinderProps) {
  return (
    <div className="bg-gray-900 rounded-3xl border border-gray-800 p-5 mb-6 shadow-xl">
      <div className="relative rounded-2xl overflow-hidden bg-black border border-gray-800 min-h-[360px] flex items-center justify-center mb-4">
        {/* HTML5 QR Code Mount Element (Always mounted for video attach) */}
        <div
          id={QR_READER_ELEMENT_ID}
          className="w-full max-w-[460px] mx-auto overflow-hidden rounded-2xl [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_video]:rounded-2xl"
        />

        {/* Viewfinder Target Overlays when scanning */}
        {isCameraActive && !isStartingCamera && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-72 h-72 border-2 border-emerald-400/50 rounded-3xl relative shadow-[0_0_50px_rgba(16,185,129,0.15)]">
              {/* 4 Corner Markers */}
              <div className="absolute -top-1.5 -left-1.5 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
              <div className="absolute -top-1.5 -right-1.5 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
              <div className="absolute -bottom-1.5 -left-1.5 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
              <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
              
              {/* Laser Animation */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_10px_#34d399] animate-pulse absolute top-1/2 -translate-y-1/2" />
            </div>
            <div className="absolute bottom-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
              Arahkan QR Code ke dalam kotak
            </div>
          </div>
        )}

        {/* Inactive or Loading Overlay */}
        {(!isCameraActive || isStartingCamera) && !cameraError && (
          <div className="absolute inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-20 h-20 rounded-full bg-gray-800/80 text-emerald-400 flex items-center justify-center mb-4 shadow-lg border border-gray-700">
              {isStartingCamera ? (
                <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-10 h-10" />
              )}
            </div>
            <h3 className="font-black text-xl text-white mb-1.5 tracking-tight">
              {isStartingCamera ? 'Menghubungkan Kamera...' : 'Kamera Belum Aktif'}
            </h3>
            <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
              {isStartingCamera
                ? 'Sedang meminta izin akses dan memuat video feed kamera...'
                : 'Aktifkan kamera untuk memindai QR code tiket secara instan dari layar HP pengunjung.'}
            </p>
            {!isStartingCamera && (
              <button
                onClick={onStartCamera}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-black px-7 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 shadow-lg shadow-emerald-900/50 hover:scale-105 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Nyalakan Kamera
              </button>
            )}
          </div>
        )}

        {/* Camera Error Overlay */}
        {cameraError && (
          <div className="absolute inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-16 h-16 rounded-full bg-red-950/60 text-red-400 flex items-center justify-center mb-3 border border-red-800/50">
              <CameraOff className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-red-400 text-sm mb-1">Akses Kamera Terkendala</h3>
            <p className="text-xs text-gray-400 max-w-xs mb-4">{cameraError}</p>
            <button
              onClick={onStartCamera}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer border border-gray-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Coba Lagi
            </button>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      {isCameraActive && (
        <div className="flex gap-2">
          <button
            onClick={onStopCamera}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-gray-700"
          >
            <CameraOff className="w-4 h-4" />
            Matikan Kamera
          </button>

          {availableCameras.length > 1 && (
            <button
              onClick={onSwitchCamera}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-gray-700"
              title="Ganti Kamera Depan/Belakang"
            >
              <SwitchCamera className="w-4 h-4" />
              <span>Ganti Kamera</span>
            </button>
          )}

          <button
            onClick={onStartCamera}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-gray-700"
            title="Refresh Kamera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
