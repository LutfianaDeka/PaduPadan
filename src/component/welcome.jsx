// src/pages/WelcomePage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  
  { url: "/slide-1.jpg"},
  { url: "/slide-2.jpg"},
  { url: "/slide-3.jpg"}
  
];


export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // slide ganti setiap 5 detik
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen font-sans text-gray-900">
      {/* Kiri - Slideshow */}
      <div className="w-1/2 relative ">
        <img
          src={slides[currentSlide].url}
          alt={`Slide ${currentSlide + 1}`}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8 text-center">
          {/* <p className="text-lg max-w-md">{slides[currentSlide].caption}</p> */}
          <div className="absolute top-4 left-6 flex gap-2 z-10">
  {slides.map((_, index) => (
    <span
      key={index}
      className={`h-1 transition-all duration-300 ${
        currentSlide === index ? "w-6 bg-white" : "w-3 bg-gray-400"
      }`}
    />
  ))}
</div>

        </div>
      </div>

      {/* Kanan - Tombol Navigasi */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-12">
              <img src="/logo.png" alt="PaduPadan Logo" className="w-24 mb-6" />
        <h2 className="text-3xl font-semibold mb-6">Selamat Datang di PaduPadan</h2>
        <p className="text-gray-600 mb-8 max-w-sm text-center">
          Padupadankan pakaianmu dan ekspresikan gaya personalmu!
        </p>
        <div className="space-y-4 w-full max-w-xs">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
          >
            Masuk
          </button>
          <button
            onClick={() => navigate("/sign-up")}
            className="w-full border border-green-600 text-green-600 hover:bg-green-50 py-2 rounded-lg transition"
          >
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}
