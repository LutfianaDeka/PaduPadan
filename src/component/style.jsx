import { useEffect, useState } from "react";
import { CirclePlus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function StylePage() {
  const navigate = useNavigate();
  const [styleList, setStyleList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const longPressTimeout = 200; // ms

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
  const toggleSelect = (id) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedStyles.length === 0) return;
    const confirm = window.confirm(`Hapus ${selectedStyles.length} style?`);
    if (!confirm) return;

    const { error } = await supabase
      .from("style_wardrobe")
      .delete()
      .in("style_id", selectedStyles);

    if (error) {
      console.error("Gagal menghapus style:", error.message);
    } else {
      setStyleList((prev) =>
        prev.filter((style) => !selectedStyles.includes(style.style_id))
      );
      setSelectedStyles([]);
    }
  };

  useEffect(() => {
    if (isSelecting && selectedStyles.length === 0) {
      setIsSelecting(false);
    }
  }, [selectedStyles]);

  const handlePress = (style_id) => {
    let timer = null; // <--- ini dipindahkan di awal fungsi, bukan di dalam handler

    if (isSelecting) {
      return {
        onClick: () => toggleSelect(style_id),
      };
    }

    return {
      onMouseDown: () => {
        timer = setTimeout(() => {
          setIsSelecting(true);
          toggleSelect(style_id);
        }, longPressTimeout);
      },
      onMouseUp: () => clearTimeout(timer),
      onTouchStart: () => {
        timer = setTimeout(() => {
          setIsSelecting(true);
          toggleSelect(style_id);
        }, longPressTimeout);
      },
      onTouchEnd: () => clearTimeout(timer),
      onClick: () => {
        if (!isSelecting) {
          navigate(`/detail_style/${style_id}`);
        }
      },
    };
  };

  return (
    <div className="style-body pt-6">
      <div className="flex justify-between px-6">
      <button
  onClick={() => navigate("/addstyle")}
  className="text-[#FFF313] text-white bg-green-700 hover:bg-green-800 rounded-full p-2 transition duration-200 shadow"
  title="Tambah Style"
>
  <CirclePlus size={24} />
</button>
        {/* Tombol hapus selalu tampil */}
        <div className="relative">
          <button
            className="p-2"
            onClick={handleBulkDelete}
            title="Hapus style terpilih"
            disabled={selectedStyles.length === 0}
          >
            <Trash2
              className={`transition ${
                selectedStyles.length === 0 ? "text-red-500" : "text-red-600"
              }`}
            />
          </button>

          {/* Badge jumlah hanya jika ada yang dipilih */}
          {selectedStyles.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {selectedStyles.length}
            </span>
          )}
        </div>

      </div>

      <div className="style-img grid grid-cols-2 gap-4 px-4 pt-6">
        {styleList.length === 0 ? (
          <p className="col-span-2 text-white text-center">Belum ada style</p>
        ) : (
          styleList.map((style) => (
            <div key={style.style_id} className="flex flex-col items-center">
              <div {...handlePress(style.style_id)} className="w-full">
                <div
                  className={`w-full aspect-[3/4] bg-white rounded-xl overflow-hidden border-2 transition ${
                    selectedStyles.includes(style.style_id)
                      ? "border-yellow-400"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={style.gambar}
                    alt={style.style_name}
                    className="w-full h-full object-contain"
                  />
                </div>
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
