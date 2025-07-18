import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import html2canvas from "html2canvas";
import { useSwipeable } from "react-swipeable";

export default function SwipeDrawerPage() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Atasan");

  const categories = ["atasan", "bawahan", "aksesoris"];

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => setDrawerOpen(true),
    onSwipedDown: () => setDrawerOpen(false),
    delta: 50,
  });
  const canvasRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("item_wardrobe")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching items:", error.message);
        return;
      }

      setItems(data);
    };

    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUserId(session.user.id);
      }
    };

    if (!userId) getUser();
    else fetchItems();
  }, [userId]);

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedItem = JSON.parse(e.dataTransfer.getData("item"));
    if (!selectedItems.includes(droppedItem.id_item)) {
      setSelectedItems((prev) => [...prev, droppedItem.id_item]);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <div className="bg-[#1a1a1a] flex justify-between items-center p-4">
        <button onClick={() => navigate("/closet")} className="text-[#FFF313]">
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={async () => {
            const canvasElement = canvasRef.current;
            if (!canvasElement) return;
            const canvasImage = await html2canvas(canvasRef.current, {
              scale: 2, // ini penting
              useCORS: true,
            });

            const dataUrl = canvasImage.toDataURL("image/png");
            navigate("/preview_style", { state: { capturedImg: dataUrl } });
          }}
          className="bg-[#FFF313] px-6 py-2 rounded-full text-black"
        >
          Lanjut
        </button>
      </div>

      <div className="px-4 pt-16 pb-32 h-full flex flex-col justify-center">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="bg-white rounded-xl flex-1 relative overflow-hidden flex items-center justify-center"
        >
          {selectedItems.length > 0 ? (
            <div
              ref={canvasRef} // ⬅️ Dipindah ke sini
              className="p-4 bg-white rounded-xl"
              style={{
                width: "fit-content",
                height: "fit-content",
                display: "inline-block",
              }}
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${Math.ceil(
                    Math.sqrt(selectedItems.length)
                  )}, 1fr)`,
                }}
              >
                {items
                  .filter((item) => selectedItems.includes(item.id_item))
                  .map((item) => (
                    <img
                      key={item.id_item}
                      src={item.gambar}
                      alt={item.nama_item || "item"}
                      className="w-[130px] h-[150px] object-contain"
                    />
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center mt-10">
              Drag item ke area ini
            </p>
          )}
        </div>
      </div>

      {/* DISINIIIIIIIIIIIIIIIIIIIIIIIIII */}
      {/* Drawer Wrapper */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-4xl transition-transform duration-300 ease-in-out bg-[#1a1a1a] ${
          drawerOpen ? "translate-y-0" : "translate-y-[65%]"
        }`}
        style={{
          maxHeight: "50vh",
          height: drawerOpen ? "50vh" : "25vh",
        }}
      >
        {/* Header Swipeable Area */}
        <div
          {...swipeHandlers}
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full py-4 flex flex-col items-center cursor-pointer"
        >
          <div className="w-full py-1 cursor-pointer flex flex-col items-center">
            <div
              className={`w-12 h-1.5 rounded-full transition-colors duration-300 ${
                drawerOpen ? "bg-[#FFF313]" : "bg-white/40"
              }`}
            />

            <div className="mt-2 text-xs text-white/50">
              {drawerOpen
                ? "Geser ke bawah / klik untuk tutup"
                : "Geser ke atas / klik untuk buka"}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-7 mb-4 items-center">
          {categories.map((kategori) => (
            <button
              key={kategori}
              onClick={() => setSelectedCategory(kategori)}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedCategory === kategori
                  ? "bg-[#FFF313] text-black"
                  : "bg-white/20 text-white"
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>

        <div className="px-4 pb-30 overflow-y-auto h-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {items
              .filter((item) => item.kategori === selectedCategory)
              .map((item) => (
                <div
                  key={item.id_item}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => toggleSelect(item.id_item)}
                  className={`rounded-xl overflow-hidden border-4 cursor-move ${
                    selectedItems.includes(item.id_item)
                      ? "border-yellow-400"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={item.gambar}
                    alt={item.nama_item}
                    className="w-full h-[150px] object-contain"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
