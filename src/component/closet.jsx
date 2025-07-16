import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClosetItemPage from "./closet_item";
import StylePage from "./style";
import Navbar from "../component/navbar";
import { Camera, Image } from "lucide-react";

export default function ClosetPage() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "closet";
  });
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-gray-800 flex flex-col relative">
      <Navbar />

      {/* Tab Switch */}
      <div className="w-full flex justify-center mt-4 mb-2">
        <div className="inline-flex bg-white rounded-full shadow border border-green-300 overflow-hidden">
          <button
            onClick={() => setActiveTab("closet")}
            className={`px-6 py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === "closet"
                ? "bg-green-600 text-white"
                : "text-green-700 hover:bg-green-100"
            }`}
          >
            Closet
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`px-6 py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === "style"
                ? "bg-green-600 text-white"
                : "text-green-700 hover:bg-green-100"
            }`}
          >
            Style
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {activeTab === "closet" ? <ClosetItemPage /> : <StylePage />}
      </div>

      {/* Floating Action Buttons */}
{activeTab === "closet" && (
  <div className="fixed right-6 bottom-[100px] flex flex-col gap-4 z-50">
    {/* Kamera */}
    <button
      onClick={() => navigate("/kamera")}
      className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
      title="Ambil Gambar Kamera"
    >
      <Camera size={24} />
    </button>

    {/* Upload (Album) */}
    <button
      onClick={handleAlbumClick}
      className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
      title="Unggah dari Galeri"
    >
      <Image size={24} />
    </button>

    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
    />
  </div>
)}
    </div>
  );
}
