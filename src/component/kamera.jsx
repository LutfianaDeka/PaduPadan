import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { FaBolt, FaSyncAlt, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Camera() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const [facingMode, setFacingMode] = useState("environment");
  const [mediaTrack, setMediaTrack] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(5);
  const [zoomSupported, setZoomSupported] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [focusPoint, setFocusPoint] = useState(null);

  const videoConstraints = {
    facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };

  const switchCamera = async () => {
    setIsSwitching(true);
    const stream = webcamRef.current?.stream;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    await new Promise((res) => setTimeout(res, 500));
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setMediaTrack(null);
    setTimeout(() => setIsSwitching(false), 500);
  };

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

  const handleZoom = (e) => {
    const value = parseFloat(e.target.value);
    setZoom(value);
    mediaTrack?.applyConstraints?.({ advanced: [{ zoom: value }] });
  };

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

  const handleFocusClick = (e) => {
    const video = webcamRef.current?.video;
    const track = webcamRef.current?.stream?.getVideoTracks?.[0];
    if (!video || !track) return;

    const rect = video.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setFocusPoint({ x: e.clientX, y: e.clientY });
    setTimeout(() => setFocusPoint(null), 1000);

    const capabilities = track.getCapabilities?.();
    if (capabilities?.pointsOfInterest) {
      track.applyConstraints({ advanced: [{ pointsOfInterest: [{ x, y }] }] });
    }
  };

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
    <div className="bg-white min-h-screen w-screen flex flex-col text-green-800">
      {/* Kamera Preview */}
      <div className="relative flex items-center justify-center h-[70vh] bg-gray-100">
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
            className="absolute border-2 border-green-400 rounded-full w-16 h-16 animate-ping pointer-events-none"
            style={{
              top: focusPoint.y,
              left: focusPoint.x,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>

      {/* Kontrol Kamera */}
      <div className="flex items-center justify-center pt-8 pb-10 px-8 flex-col gap-4">
        {/* Zoom Slider */}
        {zoomSupported && (
          <div className="flex items-center text-sm space-x-2 w-full">
            <span className="text-green-500 font-semibold">+</span>
            <input
              type="range"
              min={minZoom}
              max={maxZoom}
              step="0.1"
              value={zoom}
              onChange={handleZoom}
              className="w-full accent-green-600"
            />
            <span className="text-green-500 font-semibold">-</span>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex items-center justify-between w-full px-6">
          <button onClick={toggleFlash} title="Toggle Flash">
            <FaBolt
              className={`text-2xl transition ${
                flashOn ? "text-green-600" : "text-gray-400"
              }`}
            />
          </button>

          <button
            onClick={captureManual}
            className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition"
            title="Ambil Gambar"
          >
            <FaCamera className="text-xl" />
          </button>

          <button onClick={switchCamera} title="Ganti Kamera">
            <FaSyncAlt className="text-green-600 text-2xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
