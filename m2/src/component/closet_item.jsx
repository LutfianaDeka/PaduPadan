import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const kategoriList = ["Atasan", "Bawahan", "Aksesoris"];

export default function ClosetItemPage() {
  const [selectedKategori, setSelectedKategori] = useState("Atasan");
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // Ambil user ID saat komponen dimuat
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Gagal ambil session:", error.message);
        return;
      }

      const id = session?.user?.id;
      setUserId(id);
    };

    getUser();
  }, []);

  // Fetch item dari Supabase
  useEffect(() => {
    const fetchItems = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("item_wardrobe")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Gagal ambil item:", error.message);
      } else {
        setItems(data);
      }
    };

    fetchItems();
  }, [userId]);

  // Filter berdasarkan kategori terpilih
  const filteredItems = items.filter(
    (item) => item.kategori.toLowerCase() === selectedKategori.toLowerCase()
  );

  return (
    <>
      <div className="Closet-item">
        {/* Filter Kategori */}
        <div className="flex justify-center space-x-3 px-4 pt-6">
          {kategoriList.map((kategori) => (
            <button
              key={kategori}
              onClick={() => setSelectedKategori(kategori)}
              className={`px-4 py-1 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedKategori === kategori
                  ? "bg-[#FFF313] text-black"
                  : "border-[#FFF313] text-white"
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>
        {/* Grid Item */}
        <div className="flex-1 px-4 pt-6">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-400">Belum ada item.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id_item}
                  className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden"
                >
                  <img
                    src={item.gambar}
                    alt={item.nama_item}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
