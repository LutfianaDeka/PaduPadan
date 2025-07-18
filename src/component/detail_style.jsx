import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowLeft } from "lucide-react";

export default function DetailStylePage() {
  const { style_id } = useParams();
  const navigate = useNavigate();
  const [style, setStyle] = useState(null);

  useEffect(() => {
    const fetchStyle = async () => {
      const { data, error } = await supabase
        .from("style_wardrobe")
        .select("*")
        .eq("style_id", style_id)
        .single();

      if (error) {
        console.error("Gagal mengambil detail style:", error.message);
      } else {
        setStyle(data);
      }
    };

    if (style_id) {
      fetchStyle();
    }
  }, [style_id]);

  if (!style) {
    return <p className="text-center text-white mt-10">Memuat style...</p>;
  }

  return (
    <div className="px-4 pt-6 pb-10 text-white bg-black">
      {/* Tombol kembali */}
      <button
        className="flex items-center mb-4 text-[#FFF313]"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2" size={20} />
      </button>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-sm aspect-[3/4] bg-white rounded-xl overflow-hidden shadow-lg">
          <img
            src={style.gambar}
            alt={style.style_name}
            className="w-full h-full object-contain"
          />
        </div>

        <h2 className="text-xl font-semibold mt-4">{style.style_name}</h2>
        {style.date_use && (
          <p className="text-sm text-gray-300 mt-1">
            Digunakan pada:{" "}
            {new Date(style.date_use).toLocaleDateString("id-ID")}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Dibuat: {new Date(style.created_at).toLocaleString("id-ID")}
        </p>
        <p className="text-xs text-gray-400 mt-1">Status: {style.status}</p>
      </div>
    </div>
  );
}
