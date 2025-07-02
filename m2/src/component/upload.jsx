// SelectSource.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import BottomMenu from "./menu";
import { Camera, Image } from "lucide-react";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleCameraClick = () => {
    navigate("/kamera");
  };

  const handleAlbumClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = reader.result;
        navigate("/preview", { state: { capturedImg: img } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-400 p-4 flex flex-col justify-between">
      <div className="pt-4 space-y-4">
        {/* Camera Button */}
        <button
          onClick={handleCameraClick}
          className="w-full h-24 bg-[#FFF313] text-black font-bold rounded-xl shadow-lg text-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <Camera />
          CAMERA
        </button>

        {/* Album Button */}
        <button
          onClick={handleAlbumClick}
          className="w-full h-24 bg-[#FFF313] text-black font-bold rounded-xl shadow-lg text-xl flex items-center justify-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <Image />
          ALBUM
        </button>

        {/* Hidden input for album file selection */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <BottomMenu />
    </div>
  );
}
