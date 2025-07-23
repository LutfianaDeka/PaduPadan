// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../component/navbar";
import BottomMenu from "./menu";
import userpic from "../assets/user.png";
import Fuse from "fuse.js"; // Tambahkan ini di atas

export default function HomePage() {
  const navigate = useNavigate();
  const [publicStyles, setPublicStyles] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Tambahan: state untuk pencarian
  const [filteredStyles, setFilteredStyles] = useState([]); // Hasil pencarian
  const [searchTrigger, setSearchTrigger] = useState(false); // Tambahan: trigger manual
  const [isLoading, setIsLoading] = useState(true);
  const [setUserProfile] = useState(null);
  
  // ambil foto user
  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("profile_picture")
          .eq("user_id", session.user.id)
          .single();

        if (!error && data) setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, []);

  const getProfilePic = (url) => (url && !url.endsWith("...") ? url : userpic);
  useEffect(() => {
    const fetchPublicStyles = async () => {
      setIsLoading(true); // mulai loading
      const { data, error } = await supabase
        .from("v_style_with_user")
        .select("*")
        .eq("status", "public")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal ambil style:", error.message);
      } else {
        setPublicStyles(data);
        setFilteredStyles(data);
      }

      setIsLoading(false); // selesai loading
    };

    fetchPublicStyles();
  }, []);

  useEffect(() => {
    if (!searchTrigger) return;

    if (searchTerm.trim() === "") {
      setFilteredStyles(publicStyles);
      setSearchTrigger(false);
      return;
    }

    const keywords = searchTerm.toLowerCase().split(" ").filter(Boolean);

    const fuse = new Fuse(publicStyles, {
      keys: ["style_name", "username"],
      threshold: 0.4,
    });

    const allResults = keywords
      .map((word) => fuse.search(word).map((res) => res.item))
      .flat();

    const uniqueResultsMap = new Map();
    allResults.forEach((item) => {
      uniqueResultsMap.set(item.style_id, item);
    });

    setFilteredStyles(Array.from(uniqueResultsMap.values()));
    setSearchTrigger(false);
  }, [searchTrigger, publicStyles, searchTerm]);

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchTrigger(true); // Trigger pencarian saat tekan Enter
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Grid Konten */}
        <div className="content flex-1 overflow-y-auto px-4 pb-20 pt-6 bg-[#f9f9f9]">
          {isLoading ? (
            <p className="text-center text-gray-500 text-sm mt-10">
              Memuat outfit...
            </p>
          ) : filteredStyles.length === 0 ? (
            <p className="text-center text-gray-500 text-sm mt-10">
              Tidak ada outfit yang cocok.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredStyles.map((style, index) => (
                <div
                  key={style.style_id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 cursor-pointer"
                  onClick={() =>
                    navigate(`/content?scrollTo=${index}`, {
                      state: { filtered: filteredStyles }, // ← kirim hasil pencarian
                    })
                  }
                >
                  <img
                    src={style.gambar}
                    alt={style.style_name}
                    className="w-full aspect-square object-contain rounded-t-xl"
                  />
                  <div className="p-3 border-t border-gray-100 flex gap-3 items-start">
                    <img
                      src={getProfilePic(style.profile_picture)}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
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
          )}
        </div>
      </div>
    </>
  );
}
