// src/components/BottomMenu.jsx
import { createPortal } from "react-dom";
import { useNavigate, useLocation  } from "react-router-dom";
import { House, Shirt, Upload, Calendar } from "lucide-react";

export default function BottomMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return createPortal(
    <menu
      className="fixed bottom-0 left-0 right-0 h-14 bg-[#051A1E] z-50 flex items-center justify-around text-[#FFF313] border-t border-[#FFF313]/20"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }} // untuk iPhone notch
    >
      <House
        onClick={() => navigate(`/home`)}
        className={`cursor-pointer ${
          isActive("/home") ? "text-white" : "text-[#FFF313]"
        }`}
      />
      <Upload
        onClick={() => navigate(`/upload`)}
        className={`cursor-pointer ${
          isActive("/upload") ? "text-white" : "text-[#FFF313]"
        }`}
      />
      <Shirt
        onClick={() => navigate(`/closet`)}
        className={`cursor-pointer ${
          isActive("/closet") ? "text-white" : "text-[#FFF313]"
        }`}
      />
      <Calendar
        onClick={() => navigate(`/kalender`)}
        className={`cursor-pointer ${
          isActive("/kalender") ? "text-white" : "text-[#FFF313]"
        }`}
      />
    </menu>,
    document.getElementById("bottom-nav")
  );
}
