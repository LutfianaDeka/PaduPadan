import { useState, useEffect } from "react";
import BottomMenu from "./menu";
import ClosetItemPage from "./closet_item";
import StylePage from "./style"; // pastikan ini komponen Style

export default function ClosetPage() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "closet";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);
  return (
    <div className="closet min-h-screen bg-black text-white flex flex-col">
      {/* Top Tabs */}
      <div className="menu-closet bg-[#051A1E] border-t border-gray-800 text-sm text-center flex">
        <button
          onClick={() => setActiveTab("closet")}
          className={`flex-1 py-3 font-medium ${
            activeTab === "closet"
              ? "text-[#FFF313] border-b-2 border-[#FFF313]"
              : "text-gray-400"
          }`}
        >
          Closet
        </button>
        <button
          onClick={() => setActiveTab("style")}
          className={`flex-1 py-3 font-medium ${
            activeTab === "style"
              ? "text-[#FFF313] border-b-2 border-[#FFF313]"
              : "text-gray-400"
          }`}
        >
          Style
        </button>
      </div>

      {/* Content yang berubah tergantung tab */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "closet" ? <ClosetItemPage /> : <StylePage />}
      </div>

      {/* Bottom Menu */}
      <BottomMenu />
    </div>
  );
}
