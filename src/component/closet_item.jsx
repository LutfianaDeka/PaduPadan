import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Trash2 } from "lucide-react";

export default function ClosetItemPage() {
  const kategoriList = ["Atasan", "Bawahan", "Aksesoris"];

  const [selectedKategori, setSelectedKategori] = useState(() => {
    const saved = localStorage.getItem("selectedKategoriCloset");
    return kategoriList.includes(saved) ? saved : "Atasan";
  });
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    localStorage.setItem("selectedKategoriCloset", selectedKategori);
  }, [selectedKategori]);

  // Ambil user ID
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
      setUserId(session?.user?.id);
    };
    getUser();
  }, []);

  // Fetch data item
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

  useEffect(() => {
    fetchItems();
  }, [userId]);

  const toggleSelect = (id_item) => {
    setSelectedItems((prev) =>
      prev.includes(id_item)
        ? prev.filter((id) => id !== id_item)
        : [...prev, id_item]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) {
      alert("Pilih item yang ingin dihapus.");
      return;
    }
    const confirm = window.confirm("Yakin ingin menghapus item terpilih?");
    if (!confirm) return;

    const { error } = await supabase
      .from("item_wardrobe")
      .delete()
      .in("id_item", selectedItems);

    if (error) {
      console.error("Gagal hapus:", error.message);
      alert("Gagal hapus: " + error.message);
    } else {
      setSelectedItems([]);
      fetchItems();
    }
  };

  const filteredItems = items.filter(
    (item) => item.kategori.toLowerCase() === selectedKategori.toLowerCase()
  );

  return (
    <div className="Closet-item px-4 pt-6 bg-[#f7f9f8] text-gray-800 min-h-[calc(100vh-100px)]">
      <div className="flex flex-wrap justify-center items-center gap-4">
        {/* Filter Kategori */}
        <div className="flex flex-wrap gap-2">
          {kategoriList.map((kategori) => (
            <button
              key={kategori}
              onClick={() => {
                setSelectedKategori(kategori);
                setSelectedItems([]);
              }}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition-all duration-200 border ${
                selectedKategori === kategori
                  ? "bg-green-600 text-white border-green-600 shadow"
                  : "bg-white text-green-700 border-green-400 hover:bg-green-100"
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>

        {/* Tombol Hapus */}
        <div className="relative">
          <button
            onClick={handleDeleteSelected}
            className={`p-2 rounded-full transition ${
              selectedItems.length > 0
                ? "text-red-600 hover:text-red-700"
                : "text-gray-300 cursor-not-allowed"
            }`}
            disabled={selectedItems.length === 0}
            title="Hapus item terpilih"
          >
            <Trash2 size={20} />
          </button>
          {selectedItems.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              {selectedItems.length}
            </span>
          )}
        </div>
      </div>

      {/* Grid Item */}
      <div className="mt-6">
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-400">Belum ada item.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id_item}
                onClick={() => toggleSelect(item.id_item)}
                className={`aspect-[3/4] bg-white rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                  selectedItems.includes(item.id_item)
                    ? "border-yellow-400"
                    : "border-transparent hover:border-green-200"
                }`}
              >
                <img
                  src={item.gambar}
                  alt={item.nama_item}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
