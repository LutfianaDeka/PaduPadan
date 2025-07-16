// src/component/navbar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  BellRing,
  CircleUserRound,
  House,
  Shirt,
  Calendar,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Navbar Atas (Desktop & Mobile) */}
      <header className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-between items-center h-20 px-6">
          {/* Logo + Teks */}
<div
  className="flex items-center gap-2 cursor-pointer"
  onClick={() => navigate("/home")}
>
  <img
    src="/logo.png" // Ganti dengan path logo kamu
    alt="Logo"
    className="w-8 h-8 md:w-10 md:h-10 object-contain"
  />
  <span
    className="text-green-700 text-xl md:text-2xl font-bold tracking-wide"
    style={{ fontFamily: "Redressed" }}
  >
    PaduPadan
  </span>
</div>


          {/* Menu Tengah (Hanya Desktop/Tablet) */}
          <div className="hidden md:flex gap-6 text-green-700 font-medium text-sm">
            <button
              onClick={() => navigate("/home")}
              className={`pb-1 ${
                isActive("/home")
                  ? "text-green-700 font-semibold border-b-2 border-green-700"
                  : "hover:text-black"
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => navigate("/closet")}
              className={`pb-1 ${
                isActive("/closet")
                  ? "text-green-700 font-semibold border-b-2 border-green-700"
                  : "hover:text-black"
              }`}
            >
              Closet
            </button>
            <button
              onClick={() => navigate("/kalender")}
              className={`pb-1 ${
                isActive("/kalender")
                  ? "text-green-700 font-semibold border-b-2 border-green-700"
                  : "hover:text-black"
              }`}
            >
              Kalender
            </button>
          </div>

          {/* Ikon Kanan: Notifikasi (Selalu Tampil) & Profil (Hanya Desktop) */}
          <div className="flex gap-4 text-green-700 items-center">
            <BellRing
              size={22}
              className="cursor-pointer"
              onClick={() => navigate("/notifikasi")}
            />
            <CircleUserRound
              size={22}
              className="cursor-pointer hidden md:block"
              onClick={() => navigate("/profile")}
            />
          </div>
        </div>
      </header>

      {/* Spacer untuk mendorong konten turun dari bawah navbar */}
      <div className="h-20" />

      {/* Bottom Menu (Hanya Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-green-100 flex justify-around items-center text-green-700 md:hidden z-50">
        <House
          onClick={() => navigate("/home")}
          className={`cursor-pointer ${
            isActive("/home") ? "text-black" : ""
          }`}
        />
        <Shirt
          onClick={() => navigate("/closet")}
          className={`cursor-pointer ${
            isActive("/closet") ? "text-black" : ""
          }`}
        />
        <Calendar
          onClick={() => navigate("/kalender")}
          className={`cursor-pointer ${
            isActive("/kalender") ? "text-black" : ""
          }`}
        />
        <CircleUserRound
          onClick={() => navigate("/profile")}
          className={`cursor-pointer ${
            isActive("/profile") ? "text-black" : ""
          }`}
        />
      </div>
    </>
  );
}
