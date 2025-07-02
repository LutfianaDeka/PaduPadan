import { useEffect, useState } from "react";
import BottomMenu from "./menu";
import { BellRing, CircleUserRound, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function HomePage() {
  const navigate = useNavigate();
  // Buat array dummy berisi 10 gambar random
  const [publicStyles, setPublicStyles] = useState([]);

  // const randomImages = Array.from(
  //   { length: 20 },
  //   (_, i) => `https://picsum.photos/seed/${i + 1}/300/300`
  // );

  useEffect(() => {
    const fetchPublicStyles = async () => {
      const { data, error } = await supabase
        .from("style_wardrobe")
        .select("*, user_id") // kamu bisa join ke auth.users jika perlu
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
      <div className="home bg-black min-h-[100dvh]">
        <div className="nav h-14 flex justify-between px-4 items-center">
          <h1
            className="text-[#FFF313] text-xl font-bold"
            style={{ fontFamily: "Redressed" }}
          >
            M2Outfit
          </h1>
          <div className="flex text-[#FFF313] gap-4">
            <BellRing />
            <CircleUserRound />
          </div>
          {/* Garis tepat di bawah navbar */}
        </div>
        <hr className="border-t border-[#FFF313] mx-4" />

        <div className="box-search flex items-center px-4 pt-8">
          <div className="flex items-center bg-[#198499]/20 border border-[#FFF313] rounded-[10px] px-4 w-full">
            <Search className="text-[#FFF313] mr-2" size={18} />
            <input
              type="text"
              placeholder="Cari outfit..."
              className="bg-transparent text-white focus:outline-none py-2 w-full"
            />
          </div>
        </div>
        <div className="content flex-1 overflow-y-auto px-4 pb-20 pt-6">
          {" "}
          <div className="grid grid-cols-2 gap-4">
            {publicStyles.map((style, index) => (
              <div
                key={style.style_id}
                className="flex flex-col items-start"
                onClick={() => navigate(`/content?scrollTo=${index}`)}
              >
                <img
                  src={style.gambar}
                  alt={style.style_name}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={`https://i.pravatar.cc/40?u=${style.user_id}`} // avatar dummy berdasarkan user
                    alt="user"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div className="text">
                    <h5 className="text-xs font-bold text-white">
                      {style.style_name}
                    </h5>
                    <p className="text-xs text-white">
                      User {style.user_id.slice(0, 6)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/*  */}
      </div>
      <BottomMenu />
    </>
  );
}
