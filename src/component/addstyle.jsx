import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import html2canvas from "html2canvas";

export default function SwipeDrawerPage() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);

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

  const handleCapture = async () => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    // Sembunyikan border dan tombol X sebelum screenshot
    canvasElement.classList.add("capture-mode");

    const canvasImage = await html2canvas(canvasElement, {
      backgroundColor: null,
    });
    const dataUrl = canvasImage.toDataURL("image/png");

    // Kembalikan tampilan
    canvasElement.classList.remove("capture-mode");

    navigate("/preview_style", { state: { capturedImg: dataUrl } });
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      {/* Header */}
      <div className="bg-[#1a1a1a] flex justify-between items-center p-4">
        <button onClick={() => navigate("/closet")} className="text-[#FFF313]">
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={handleCapture}
          className="bg-[#FFF313] px-6 py-2 rounded-full text-black"
        >
          Lanjut
        </button>
      </div>

      {/* Canvas */}
      <div className="px-4 pt-16 pb-32 h-full flex flex-col justify-center">
        <div
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="bg-white rounded-xl flex-1 relative overflow-hidden flex items-center justify-center"
        >
          {selectedItems.length > 0 ? (
            <div
              className="grid gap-4 p-4"
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
          ) : (
            <p className="text-gray-400 text-sm text-center mt-10">
              Drag item ke area ini
            </p>
          )}
        </div>
      </div>

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-2xl z-50 transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-y-0" : "translate-y-[75%]"
        }`}
        style={{ maxHeight: "70vh" }}
      >
        <div
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full py-4 cursor-pointer flex flex-col items-center"
        >
          <div className="w-12 h-1.5 bg-white/40 rounded-full" />
          <p className="text-xs text-white/50 mt-1">
            {drawerOpen ? "Klik untuk tutup" : "Klik untuk buka"}
          </p>
        </div>

        <div className="px-4 pb-10 overflow-y-auto max-h-[60vh]">
          <h2 className="text-white text-sm font-semibold mb-2">
            Pilih Style-mu
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
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
                  className="w-full h-[150px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tambahkan style untuk mode capture */}
      <style>{`
        .capture-mode * {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
      `}</style>
    </div>
  );
}
