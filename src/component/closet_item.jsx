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

  // Handler untuk memilih/deselect item
  const toggleSelect = (id_item) => {
    setSelectedItems((prev) =>
      prev.includes(id_item)
        ? prev.filter((id) => id !== id_item)
        : [...prev, id_item]
    );
  };

  // Hapus item yang dipilih
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

  // Filter item berdasarkan kategori
  const filteredItems = items.filter(
    (item) => item.kategori.toLowerCase() === selectedKategori.toLowerCase()
  );

  return (
    <div className="Closet-item px-4 pt-6">
      <div className="flex items-center justify-center gap-4">
        {/* Filter Kategori */}
        <div className="flex space-x-2">
          {kategoriList.map((kategori) => (
            <button
              key={kategori}
              onClick={() => {
                setSelectedKategori(kategori);
                setSelectedItems([]); // Reset saat ganti kategori
              }}
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

        {/* Trash Icon dengan Badge */}
        <div className="relative">
          <button
            onClick={handleDeleteSelected}
            className="text-red-500 hover:text-red-600"
            disabled={selectedItems.length === 0}
            title="Hapus item terpilih"
          >
            <Trash2 />
          </button>
          {selectedItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
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
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id_item}
                onClick={() => toggleSelect(item.id_item)}
                className={`aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                  selectedItems.includes(item.id_item)
                    ? "border-yellow-400"
                    : "border-transparent"
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
