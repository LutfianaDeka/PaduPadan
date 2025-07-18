// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../component/navbar"; 
import BottomMenu from "./menu";

export default function HomePage() {
  const navigate = useNavigate();
  const [publicStyles, setPublicStyles] = useState([]);

  useEffect(() => {
    const fetchPublicStyles = async () => {
      const { data, error } = await supabase
        .from("v_style_with_user")
        .select("*")
        .eq("status", "public")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal ambil style:", error.message);
      } else {
        setPublicStyles(data);
      }
    };

    fetchPublicStyles();
  }, []);

  return (
    <>
      <div className="home bg-[#f9f9f9] min-h-[100dvh]">
        <Navbar />

        {/* Search Bar */}
        <div className="flex justify-end px-4 pt-6">
          <div className="w-full sm:w-[300px]">
            <div className="flex items-center bg-white border border-green-600 rounded-full px-4 py-2 shadow-sm">
              <Search className="text-green-600 mr-2" size={18} />
              <input
                type="text"
                placeholder="Cari outfit..."
                className="bg-transparent text-gray-800 placeholder:text-gray-500 focus:outline-none w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* Grid Konten */}
        <div className="content flex-1 overflow-y-auto px-4 pb-20 pt-6 bg-[#f9f9f9]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {publicStyles.map((style, index) => (
              <div
                key={style.style_id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
                onClick={() => navigate(`/content?scrollTo=${index}`)}
              >
                <img
                  src={style.gambar}
                  alt={style.style_name}
                  className="w-full aspect-square object-cover rounded-t-xl"
                />
                <div className="p-3 border-t border-gray-100 flex gap-3 items-start">
                  <img
                    src={`https://i.pravatar.cc/40?u=${style.user_id}`}
                    alt="user"
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="text-sm font-semibold text-gray-800">
                      {style.style_name}
                    </h5>
                    <p className="text-xs text-gray-500">{style.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
