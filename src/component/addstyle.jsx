import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import domtoimage from "dom-to-image-more"; // ✅ Ganti html2canvas
import { useSwipeable } from "react-swipeable";

export default function SwipeDrawerPage() {
  const [selectedItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [canvasItems, setCanvasItems] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [selectedCategory, setSelectedCategory] = useState("atasan");

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

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", JSON.stringify(item));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedItem = JSON.parse(e.dataTransfer.getData("item"));
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCanvasItems((prev) => [
      ...prev,
      {
        ...droppedItem,
        x,
        y,
        id: `${droppedItem.id_item}-${Date.now()}`,
      },
    ]);
    // setDrawerOpen(false);
  };

  const handlePointerDown = (e, item) => {
    setDraggingId(item.id);
    const rect = e.target.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerMove = (e) => {
    if (draggingId) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.current.x;
      const y = e.clientY - rect.top - dragOffset.current.y;

      setCanvasItems((prev) =>
        prev.map((ci) => (ci.id === draggingId ? { ...ci, x, y } : ci))
      );
    }
  };

  const handlePointerUp = () => {
    setDraggingId(null);
  };

  const handleDrawerItemClick = (item) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const centerX = canvasRect.width / 2 - 50;
    const centerY = canvasRect.height / 2 - 60;

    const newItem = {
      ...item,
      x: centerX,
      y: centerY,
      id: `${item.id_item}-${Date.now()}`,
    };

    setCanvasItems((prev) => [...prev, newItem]);
    setDrawerOpen(false);
  };

  const handleDeleteItem = (id) => {
    setCanvasItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLanjut = async () => {
    if (loading) return;
    setLoading(true);

    const canvasElement = canvasRef.current;

    if (!canvasElement) {
      alert("Canvas belum tersedia.");
      setLoading(false);
      return;
    }

    if (canvasItems.length === 0) {
      alert("Tambahkan item ke canvas terlebih dahulu!");
      setLoading(false);
      return;
    }

    try {
      canvasElement.classList.add("capture-mode");

      const scale = 2;
      const style = {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${canvasElement.offsetWidth}px`,
        height: `${canvasElement.offsetHeight}px`,
      };

      const dataUrl = await domtoimage.toPng(canvasElement, {
        width: canvasElement.offsetWidth * scale,
        height: canvasElement.offsetHeight * scale,
        style,
      });

      if (!dataUrl) throw new Error("Gagal mengambil gambar canvas.");

      navigate("/preview_style", {
        state: { capturedImg: dataUrl },
      });
    } catch (error) {
      console.error("Gagal mengambil screenshot:", error);
      alert("Gagal mengambil gambar. Silakan coba lagi.");
    } finally {
      canvasElement.classList.remove("capture-mode");
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <div className="bg-white flex justify-between items-center p-4 shadow-md">
        <button onClick={() => navigate("/closet")} className="text-[#2E8B57]">
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={handleLanjut}
          className="bg-[#2E8B57] px-6 py-2 rounded-full text-white hover:bg-[#276b48] transition-all"
        >
          {loading ? "Memproses..." : "Lanjut"}
        </button>
      </div>
      <div className="px-4 pt-16 pb-32 flex flex-col items-center justify-center h-full w-full">
        <div
          ref={canvasRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="canvas-area capture bg-white border-2 border-[#2E8B57] shadow-lg rounded-xl mx-auto w-[90%] max-w-[500px] h-[500px] relative overflow-hidden"
        >
          {canvasItems.length > 0 ? (
            canvasItems.map((item) => (
              <div
                key={item.id}
                className="item-container"
                style={{
                  top: item.y,
                  left: item.x,
                  position: "absolute",
                  width: "100px",
                  height: "120px",
                  zIndex: draggingId === item.id ? 2 : 1,
                }}
              >
                <div className="relative w-full h-full item">
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="delete-button absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center z-10"
                  >
                    ×
                  </button>
                  <img
                    src={item.gambar}
                    alt={item.nama_item || "item"}
                    onPointerDown={(e) => handlePointerDown(e, item)}
                    crossOrigin="anonymous"
                    className="gambar w-full h-full object-contain cursor-grab border-0"
                    style={{
                      transition:
                        draggingId === item.id
                          ? "none"
                          : "all 0.2s ease-in-out",
                      touchAction: "none",
                    }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm text-center mt-10">
              Drag atau klik item untuk menambah ke canvas
            </p>
          )}
        </div>
      </div>
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#2E8B57] rounded-t-2xl z-50 transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-y-0" : "translate-y-[30%]"
        }`}
        style={{
          maxHeight: "50vh",
          height: drawerOpen ? "50vh" : "25vh",
        }}
      >
        <div
          {...swipeHandlers}
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full py-4 flex flex-col items-center cursor-pointer"
        >
          <div className="w-full py-1 cursor-pointer flex flex-col items-center">
            <div
              className={`w-12 h-1.5 rounded-full transition-colors duration-300 ${
                drawerOpen ? "bg-[#2E8B57]" : "bg-gray-400"
              }`}
            />

            <div className="mt-2 text-xs text-[#2E8B57]">
              {drawerOpen
                ? "Geser ke bawah / klik untuk tutup"
                : "Geser ke atas / klik untuk buka"}
            </div>
          </div>
        </div>

        <div className="flex justify-center py-1 gap-2 mb- items-center">
          {categories.map((kategori) => (
            <button
              key={kategori}
              onClick={() => setSelectedCategory(kategori)}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedCategory === kategori
                  ? "bg-[#2E8B57] text-white"
                  : "text-[#2E8B57] text-xs font-light border border-[#2E8B57]"
              }`}
            >
              {kategori}
            </button>
          ))}
        </div>

        <div className="px-4 pb-60 overflow-y-auto max-h-[calc(100vh-200px)]">
          <h2 className="text-[#2E8B57] text-sm font-semibold mb-2">
            Pilih Style-mu
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items
              .filter((item) => item.kategori === selectedCategory)
              .map((item) => (
                <div
                  key={item.id_item}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={() => handleDrawerItemClick(item)}
                  className={`gambar rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedItems.includes(item.id_item)
                      ? "border-[#2E8B57] shadow-md"
                      : "border-gray-200"
                  }`}
                >
                  <div className="w-full h-[150px] flex items-center justify-center bg-white">
                    <img
                      src={item.gambar}
                      alt={item.nama_item}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <style>{`
      .capture-mode * {
  outline: none !important;
  box-shadow: none !important;
}

.capture.canvas-area {
  border: none !important;
  background-color: white !important;
  border-radius: 0 !important;
}

.capture-mode .delete-button {
  display: none !important;
}

.capture-mode .gambar,
.capture-mode .item-container,
.capture-mode .item-container .item {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
`}</style>
      ;
    </div>
  );
}
