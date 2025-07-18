import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PreviewStyle() {
  const location = useLocation();
  const navigate = useNavigate();
  const capturedImg = location.state?.capturedImg;

  const [showImage, setShowImage] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowImage(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (!capturedImg) return alert("Gagal mengambil gambar. Silakan ulangi.");

    setIsExiting(true);
    setTimeout(() => {
      navigate("/form_style", { state: { capturedImg } });
    }, 300);
  };

  if (!capturedImg) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-500">
        <p className="text-center">Gagal memuat gambar. Silakan kembali.</p>
        <button
          onClick={() => navigate("/addstyle")}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-green-50 flex flex-col transition-opacity duration-300 ease-in-out ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white px-4 py-4 shadow flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-green-600 hover:text-green-800"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-semibold text-green-800 text-center flex-1">
          Pratinjau Gaya
        </h1>
        <div className="w-6" /> {/* spacer */}
      </div>

      {/* Konten */}
      <div className="flex-1 bg-green-100 overflow-y-auto flex flex-col items-center px-4 pt-8 pb-10">
        <div className="w-full max-w-sm flex-1 flex flex-col items-center justify-center">
          <div
            className={`w-full max-w-md bg-white p-6 rounded-3xl shadow-xl transform transition-all duration-500 ease-out ${
              showImage ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative w-full aspect-[2/3] bg-gray-100 rounded-2xl overflow-hidden">
              <img
                src={capturedImg}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

        </div>
        <div className="w-full max-w-sm mt-8 flex space-x-4">
          <button
            className="flex-1 bg-white border border-red-400 text-red-500 font-medium py-2 rounded-full hover:bg-red-100 transition"
            onClick={() => navigate("/addstyle")}
          >
            Pilih Ulang
          </button>
          <button
            className="flex-1 bg-green-500 text-white font-semibold py-2 rounded-full hover:bg-green-600 transition"
            onClick={handleNext}
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}
