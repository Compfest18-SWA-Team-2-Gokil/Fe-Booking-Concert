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
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="relative rounded-3xl overflow-hidden bg-black border border-gray-200 min-h-87.5 flex items-center justify-center mb-5">
        {/* HTML5 QR Code Mount Element (Always mounted for video attach) */}
        <div
          id={QR_READER_ELEMENT_ID}
          className="w-full max-w-105 mx-auto overflow-hidden rounded-2xl [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_video]:rounded-2xl"
        />

        {/* Viewfinder Target Overlays when scanning */}
        {isCameraActive && !isStartingCamera && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-[#0064D2]/40 rounded-2xl relative shadow-2xl">
              <div className="absolute -top-1 -left-1 w-7 h-7 border-t-4 border-l-4 border-[#0064D2] rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-7 h-7 border-t-4 border-r-4 border-[#0064D2] rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-7 h-7 border-b-4 border-l-4 border-[#0064D2] rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 border-b-4 border-r-4 border-[#0064D2] rounded-br-lg" />
              <div className="w-full h-0.5 bg-[#0064D2] shadow-md shadow-[#0064D2] animate-pulse absolute top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Inactive or Loading Overlay */}
        {(!isCameraActive || isStartingCamera) && !cameraError && (
          <div className="absolute inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-center z-10">
            {/* Faint viewfinder frame to hint "this is a camera" */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border border-white/6 rounded-2xl relative">
                <div className="absolute -top-1 -left-1 w-7 h-7 border-t-2 border-l-2 border-white/10 rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-7 h-7 border-t-2 border-r-2 border-white/10 rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-7 h-7 border-b-2 border-l-2 border-white/10 rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 border-b-2 border-r-2 border-white/10 rounded-br-lg" />
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              {isStartingCamera ? (
                <div className="w-12 h-12 border-3 border-white/20 border-t-white/60 rounded-full animate-spin mb-5" />
              ) : (
                <Camera className="w-10 h-10 text-white/20 mb-4" />
              )}
              <h3 className="font-bold text-sm text-white/50 mb-1 tracking-wide">
                {isStartingCamera ? 'Menghubungkan Kamera...' : 'Kamera Belum Aktif'}
              </h3>
              <p className="text-xs text-white/25 max-w-xs mb-5">
                {isStartingCamera
                  ? 'Meminta izin akses kamera...'
                  : 'Aktifkan kamera untuk mulai scan tiket.'}
              </p>
              {!isStartingCamera && (
                <button
                  onClick={onStartCamera}
                  className="bg-[#0064D2] hover:bg-[#0052B0] text-white font-bold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Nyalakan Kamera
                </button>
              )}
            </div>
          </div>
        )}

        {/* Camera Error Overlay */}
        {cameraError && (
          <div className="absolute inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-center z-10">
            <CameraOff className="w-10 h-10 text-red-400/60 mb-4" />
            <h3 className="font-bold text-sm text-red-400/80 mb-1">Akses Kamera Gagal</h3>
            <p className="text-xs text-white/25 max-w-xs mb-5">{cameraError}</p>
            <button
              onClick={onStartCamera}
              className="bg-white/10 hover:bg-white/15 text-white/70 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
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
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CameraOff className="w-4 h-4" />
            Matikan Kamera
          </button>

          {availableCameras.length > 1 && (
            <button
              onClick={onSwitchCamera}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              title="Ganti Kamera Depan/Belakang"
            >
              <SwitchCamera className="w-4 h-4" />
              <span>Ganti Kamera</span>
            </button>
          )}

          <button
            onClick={onStartCamera}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            title="Refresh Kamera"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
