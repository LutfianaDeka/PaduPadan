import { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import domtoimage from "dom-to-image-more";

export default function SwipeDrawerPage() {
  const [selectedItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [canvasItems, setCanvasItems] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const dragOffset = useRef({ x: 0, y: 0 });
  const initialSize = useRef({ width: 0, height: 0 });
  const startPos = useRef({ x: 0, y: 0 });
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
        scale: 1,
        id: `${droppedItem.id_item}-${Date.now()}`,
      },
    ]);
    setDrawerOpen(false);
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

  const handleWheel = (e, itemId) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    setCanvasItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              scale: Math.max(0.2, Math.min(3, (item.scale || 1) + delta)),
            }
          : item
      )
    );
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
      scale: 1,
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
      const dataUrl = await domtoimage.toPng(canvasElement);

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

  const handleResizeStart = (e, item) => {
    e.stopPropagation();
    setResizingId(item.id);
    startPos.current = { x: e.clientX, y: e.clientY };
    initialSize.current = { 
      width: 100 * (item.scale || 1), 
      height: 120 * (item.scale || 1) 
    };
  };

  const handleResizeMove = (e) => {
    if (!resizingId) return;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    // Calculate new dimensions maintaining aspect ratio
    const newWidth = initialSize.current.width + deltaX;
    const scale = Math.max(0.5, Math.min(3, newWidth / 100));
    
    setCanvasItems(prev =>
      prev.map(item =>
        item.id === resizingId 
          ? { ...item, scale: Math.max(0.5, Math.min(3, scale)) } 
          : item
      )
    );
  };

  const handleResizeEnd = () => {
    if (!resizingId) return;
    setResizingId(null);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizingId) {
        e.preventDefault();
        handleResizeMove(e);
      }
    };
    
    const handleMouseUp = () => handleResizeEnd();

    if (resizingId) {
      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingId]);

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
                className="item-container group"
                style={{
                  top: item.y,
                  left: item.x,
                  position: "absolute",
                  width: `${100 * (item.scale || 1)}px`,
                  height: `${120 * (item.scale || 1)}px`,
                  zIndex: draggingId === item.id ? 2 : 1,
                  transform: 'translate(-50%, -50%)',
                  cursor: draggingId === item.id ? 'grabbing' : 'move',
                }}
                onPointerDown={(e) => handlePointerDown(e, item)}
              >
                <div className="relative w-full h-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center z-10 hover:bg-red-600 transition-opacity opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                  <div 
                    className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-tl-md cursor-nwse-resize z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      handleResizeStart(e, item);
                    }}
                  />
                  <img
                    src={item.gambar}
                    alt={item.nama_item || "item"}
                    className="w-full h-full object-contain select-none"
                    style={{
                      transform: `scale(${item.scale || 1})`,
                      transformOrigin: 'center',
                      transition: draggingId === item.id || resizingId === item.id ? 'none' : 'all 0.15s ease',
                      touchAction: 'none',
                      pointerEvents: 'auto',
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
          drawerOpen ? "translate-y-0" : "translate-y-[75%]"
        }`}
        style={{ maxHeight: "70vh" }}
      >
        <div
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full py-4 cursor-pointer flex flex-col items-center"
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          <p className="text-xs text-[#2E8B57] mt-1">
            {drawerOpen ? "Klik untuk tutup" : "Klik untuk buka"}
          </p>
        </div>

        <div className="px-4 pb-10 overflow-y-auto max-h-[60vh]">
          <h2 className="text-[#2E8B57] text-sm font-semibold mb-2">
            Pilih Style-mu
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => (
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
                <img
                  src={item.gambar}
                  alt={item.nama_item}
                  className="gambar w-full h-[150px] object-cover"
                />
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
        canvas-area img {
  user-select: none;
  touch-action: none;
}

      `}</style>
    </div>
  );
}
