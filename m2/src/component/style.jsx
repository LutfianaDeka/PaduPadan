import { useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function StylePage() {
  const navigate = useNavigate();
  const [styleList, setStyleList] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Ambil user ID dari session
    const getUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        console.error("Gagal ambil session:", error?.message);
        return;
      }

      setUserId(session.user.id);
    };

    getUser();
  }, []);

  useEffect(() => {
    const fetchStyles = async () => {
      const { data, error } = await supabase
        .from("style_wardrobe")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil data style:", error.message);
        return;
      }

      setStyleList(data);
    };

    if (userId) {
      fetchStyles();
    }
  }, [userId]);

  return (
    <div className="style-body pt-6">
      <div className="flex justify-end px-6">
        <button
          className="text-[#FFF313]"
          onClick={() => navigate("/addstyle")} // navigasi ke halaman tambah style
        >
          <CirclePlus size={28} />
        </button>
      </div>

      <div className="style-img grid grid-cols-2 gap-4 px-4 pt-6">
        {styleList.length === 0 ? (
          <p className="col-span-2 text-white text-center">Belum ada style</p>
        ) : (
          styleList.map((style) => (
            <div key={style.style_id} className="flex flex-col items-center">
              <div className="w-full aspect-[3/4] bg-gray-300 rounded-xl overflow-hidden">
                <img
                  src={style.gambar}
                  alt={style.style_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-center text-sm text-white">
                {style.style_name}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
