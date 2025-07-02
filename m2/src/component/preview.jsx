import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const capturedImg = location.state?.capturedImg;

  const [showImage, setShowImage] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowImage(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setIsExiting(true); // mulai animasi keluar
    setTimeout(() => {
      navigate("/addcloset", { state: { capturedImg } }); // navigasi setelah delay
    }, 300); // sesuaikan dengan durasi animasi
  };

  if (!capturedImg)
    return <p className="text-center text-gray-500 mt-10">Tidak ada gambar.</p>;

  return (
    <div
      className={`min-h-screen bg-gray-50 flex flex-col transition-opacity duration-300 ease-in-out ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow">
        <h1 className="text-xl font-semibold text-gray-800 text-center">
          Pratinjau Gambar
        </h1>
      </div>

      {/* Konten */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center px-4 pt-6 pb-10">
        <div
          className={`w-full max-w-sm aspect-[3/4] overflow-hidden rounded-xl shadow-md border transform transition-all duration-500 ease-out ${
            showImage ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <img
            src={capturedImg}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full max-w-sm mt-6 pt-8 flex space-x-4">
          <button
            className="flex-1 bg-red-500 text-white font-medium py-2 rounded-full hover:bg-red-600 transition"
            onClick={() => navigate("/kamera")}
          >
            Ambil Ulang
          </button>
          <button
            className="flex-1 bg-yellow-400 text-black font-medium py-2 rounded-full hover:bg-yellow-300 transition"
            onClick={handleNext}
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}
