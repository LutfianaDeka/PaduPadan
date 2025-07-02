import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { FaBolt, FaSyncAlt, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Camera() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // State untuk konfigurasi kamera
  const [facingMode, setFacingMode] = useState("environment");
  const [mediaTrack, setMediaTrack] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(5);
  const [zoomSupported, setZoomSupported] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false); // Untuk transisi kamera
  const [focusPoint, setFocusPoint] = useState(null);

  // Konfigurasi video
  const videoConstraints = {
    facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };

  // Transisi dan switch kamera
  const switchCamera = async () => {
    setIsSwitching(true); // Transisi keluar

    const stream = webcamRef.current?.stream;
    if (stream) stream.getTracks().forEach((track) => track.stop());

    await new Promise((res) => setTimeout(res, 500)); // Waktu transisi

    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setMediaTrack(null);

    setTimeout(() => setIsSwitching(false), 500); // Transisi masuk
  };

  // Ambil gambar secara manual dari elemen video
  const captureManual = useCallback(() => {
    const video = webcamRef.current?.video;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    navigate("/preview", { state: { capturedImg: imgData } });
  }, [navigate]);

  // Zoom handler
  const handleZoom = (e) => {
    const value = parseFloat(e.target.value);
    setZoom(value);
    mediaTrack?.applyConstraints?.({ advanced: [{ zoom: value }] });
  };

  // Flash (torch)
  const toggleFlash = () => {
    const track = webcamRef.current?.stream?.getVideoTracks?.()[0];
    const capabilities = track?.getCapabilities();

    if (!capabilities?.torch) {
      alert("Perangkat ini tidak mendukung flash.");
      return;
    }

    track
      .applyConstraints({ advanced: [{ torch: !flashOn }] })
      .then(() => setFlashOn((prev) => !prev));
  };

  // Fokus saat klik pada video
  const handleFocusClick = (e) => {
    const video = webcamRef.current?.video;
    const track = webcamRef.current?.stream?.getVideoTracks?.()[0];
    if (!video || !track) return;

    const rect = video.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Simpan posisi klik (untuk ikon fokus)
    setFocusPoint({ x: e.clientX, y: e.clientY });
    setTimeout(() => setFocusPoint(null), 1000); // hilangkan setelah 1 detik

    const capabilities = track.getCapabilities?.();
    if (capabilities?.pointsOfInterest) {
      track.applyConstraints({ advanced: [{ pointsOfInterest: [{ x, y }] }] });
      console.log("Fokus ke:", x.toFixed(2), y.toFixed(2));
    } else {
      console.warn("Klik fokus tidak didukung.");
    }
  };

  // Cek apakah zoom didukung, lalu ambil capabilities
  useEffect(() => {
    const interval = setInterval(() => {
      const track = webcamRef.current?.stream?.getVideoTracks?.()[0];
      if (!track?.getCapabilities) return;

      const cap = track.getCapabilities();
      if (cap.zoom) {
        setZoomSupported(true);
        setMediaTrack(track);
        setZoom(track.getSettings().zoom || cap.min || 1);
        setMinZoom(cap.min || 1);
        setMaxZoom(cap.max || 5);
        clearInterval(interval);
      } else {
        setZoomSupported(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [facingMode]);

  return (
    <div className="bg-black min-h-screen w-screen flex flex-col text-yellow-400">
      {/* Area Kamera */}
      <div className="relative flex items-center justify-center h-[70vh]">
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored={facingMode === "user"}
          screenshotFormat="image/jpeg"
          width={1920}
          height={1080}
          videoConstraints={videoConstraints}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isSwitching ? "opacity-0" : "opacity-100"
          }`}
          onClick={handleFocusClick}
        />
        {focusPoint && (
          <div
            className="absolute border-2 border-yellow-400 rounded-full w-16 h-16 animate-ping pointer-events-none"
            style={{
              top: focusPoint.y,
              left: focusPoint.x,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>

      {/* Kontrol */}
      <div className="flex items-center py-10">
        <div className="w-full px-9 py-4 space-y-4">
          {/* Zoom */}
          {zoomSupported ? (
            <div className="flex items-center text-sm space-x-2">
              <span>+</span>
              <input
                type="range"
                min={minZoom}
                max={maxZoom}
                step="0.1"
                value={zoom}
                onChange={handleZoom}
                className="w-full accent-yellow-400"
              />
              <span>-</span>
            </div>
          ) : (
            <p className="text-xs text-red-500 text-center">
              Zoom tidak didukung di perangkat ini.
            </p>
          )}

          {/* Tombol Kontrol */}
          <div className="flex items-center justify-between px-4">
            <button onClick={toggleFlash}>
              <FaBolt
                className={`text-2xl ${
                  flashOn ? "text-[#FFF313]" : "text-gray-500"
                }`}
              />
            </button>

            <button
              onClick={captureManual}
              className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center"
            >
              <FaCamera className="text-black text-xl" />
            </button>

            <button onClick={switchCamera}>
              <FaSyncAlt className="text-[#FFF313] text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
