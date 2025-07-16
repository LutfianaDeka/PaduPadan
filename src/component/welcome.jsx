import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  { url: "/slide-1.jpg" },
  { url: "/slide-2.jpg" },
  { url: "/slide-3.jpg" },
];

export default function WelcomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen font-sans text-gray-900 md:flex">
      {/* Gambar Latar Belakang (Full untuk mobile) */}
      <div className="fixed inset-0 md:relative md:w-1/2 h-screen z-0">
        <img
          src={slides[currentSlide].url}
          alt={`Slide ${currentSlide + 1}`}
          className="w-full h-full object-cover transition-opacity duration-1000"
        />
        {/* Indicator */}
        <div className="absolute top-4 left-6 flex gap-2 z-10">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`h-1 transition-all duration-300 rounded-sm ${
                currentSlide === index ? "w-6 bg-white" : "w-3 bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile View: Kotak transparan di atas background */}
    <div className="relative z-10 md:hidden min-h-screen flex items-center justify-center">
      {/* Background Image - full height */}
      <img
        src={slides[currentSlide].url}
        alt={`Slide ${currentSlide + 1}`}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay Content Box */}
      <div className="relative z-10 bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-xl w-[90%] max-w-sm text-center">
        <img src="/logo.png" alt="PaduPadan Logo" className="w-16 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-3">Selamat Datang</h2>
        <p className="text-gray-700 text-sm mb-6">
          Padupadankan pakaianmu dan ekspresikan gaya personalmu!
        </p>
        <div className="space-y-3">
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


      {/* Desktop View */}
      <div className="hidden md:flex w-1/2 bg-white flex-col justify-center items-center px-12 text-center">
        <img src="/logo.png" alt="PaduPadan Logo" className="w-20 mb-6" />
        <h2 className="text-3xl font-semibold mb-4">Selamat Datang di PaduPadan</h2>
        <p className="text-gray-600 mb-8 max-w-sm text-center text-lg">
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
