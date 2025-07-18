// src/components/menu.jsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  House,
  Shirt,
  Calendar,
} from "lucide-react";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* 🌐 DESKTOP MENU */}
      <div className="hidden md:flex justify-center gap-10 py-2 bg-white border-b border-gray-200 text-green-700">
        <button
          onClick={() => navigate("/home")}
          className={`text-sm font-semibold transition hover:text-green-800 ${
            isActive("/home") ? "text-green-900 underline" : ""
          }`}
        >
          Beranda
        </button>
        <button
          onClick={() => navigate("/closet")}
          className={`text-sm font-semibold transition hover:text-green-800 ${
            isActive("/closet") ? "text-green-900 underline" : ""
          }`}
        >
          Closet
        </button>
        <button
          onClick={() => navigate("/kalender")}
          className={`text-sm font-semibold transition hover:text-green-800 ${
            isActive("/kalender") ? "text-green-900 underline" : ""
          }`}
        >
          Kalender
        </button>
      </div>

      {/* 📱 MOBILE BOTTOM MENU */}
      <menu
        className="fixed bottom-0 left-0 right-0 h-14 bg-green-700 z-50 flex items-center justify-around text-white md:hidden border-t border-green-800"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <House
          onClick={() => navigate("/home")}
          className={`cursor-pointer ${
            isActive("/home") ? "text-white" : "text-green-200"
          }`}
        />
        <Shirt
          onClick={() => navigate("/closet")}
          className={`cursor-pointer ${
            isActive("/closet") ? "text-white" : "text-green-200"
          }`}
        />
        <Calendar
          onClick={() => navigate("/kalender")}
          className={`cursor-pointer ${
            isActive("/kalender") ? "text-white" : "text-green-200"
          }`}
        />
      </menu>
    </>
  );
}
