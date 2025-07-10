import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Preview() {
  const location = useLocation();
  const navigate = useNavigate();
  const capturedImg = location.state?.capturedImg;

  const [loading, setLoading] = useState(false);

  const [showImage, setShowImage] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowImage(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = async () => {
    if (!capturedImg) return;

    setIsExiting(true);
    setLoading(true); // mulai loading
    const startTime = Date.now();

    try {
      const blob = await (await fetch(capturedImg)).blob();
      const formData = new FormData();
      formData.append("image", blob, "image.png");

      const response = await axios.post(
        "http://localhost:5000/remove-bg",
        formData,
        {
          responseType: "blob",
        }
      );

      if (!response || !response.data) {
        throw new Error("Gagal menerima gambar tanpa background");
      }

      const resultBlob = response.data;

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;

        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 1000 - elapsed);

        setTimeout(() => {
          navigate("/addcloset", { state: { capturedImg: base64Image } });
          setLoading(false);
        }, delay);
      };

      reader.readAsDataURL(resultBlob);
    } catch (err) {
      console.error("Gagal hapus background:", err.message);
      alert("Background tidak bisa dihapus. Gambar tetap disimpan.");

      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 1000 - elapsed);

      setTimeout(() => {
        navigate("/addcloset", { state: { capturedImg } });
        setLoading(false);
      }, delay);
    }
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
            className="w-full h-full object-contain"
          />
        </div>

        <div className="w-full max-w-sm mt-6 pt-8 flex space-x-4">
          <button
            className="flex-1 bg-red-500 text-white font-medium py-2 rounded-full hover:bg-red-600 transition"
            onClick={() => navigate("/upload")}
          >
            Kembali
          </button>
          <button
            className="flex-1 bg-yellow-400 text-black font-medium py-2 rounded-full hover:bg-yellow-300 transition"
            onClick={handleNext}
          >
            Lanjut
          </button>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-60 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spinSlow"></div>
          <p className="mt-4 text-gray-700 font-medium">Memuat</p>
        </div>
      )}
    </div>
  );
}
