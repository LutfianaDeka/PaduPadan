import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function LihatCommentPage({ open, onClose, comments }) {
  const startYRef = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = (y) => {
    setIsDragging(true);
    startYRef.current = y;
  };

  const updateDrag = (y) => {
    if (!isDragging) return;
    const deltaY = y - startYRef.current;
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = window.innerHeight * 0.2;
    if (translateY > threshold) {
      onClose();
    } else {
      setTranslateY(0);
    }
  };

  // Mouse drag
  useEffect(() => {
    const handleMouseMove = (e) => updateDrag(e.clientY);
    const handleMouseUp = () => endDrag();
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Touch drag
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      startDrag(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startYRef.current;
    if (deltaY > 0) {
      setTranslateY(deltaY);
      e.preventDefault(); // cegah reload
    }
  };

  const handleTouchEnd = () => {
    endDrag();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 text-black">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose}></div>

      {/* Drawer */}
      <div
        className="absolute bottom-0 w-full bg-gray-100  rounded-t-3xl shadow-xs shadow-black/20 flex flex-col"
        style={{
          height: "80%",
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
          touchAction: "none", // penting agar gestur tidak bentrok
        }}
        onMouseDown={(e) => startDrag(e.clientY)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center pt-4 pb-4">
          <div className="w-12 h-1 bg-black/30 rounded-full mb-2" />
          <h2 className="text-sm">Komentar</h2>
        </div>

        {/* Komentar list */}
        <div
          className="flex-1 overflow-y-auto px-4"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE
          }}
        >
          {/* Hide scrollbar untuk Chrome/Safari */}
          <style>{`
    div::-webkit-scrollbar {
      display: none;
    }
  `}</style>

          <div className="space-y-3 pt-2 pb-4">
            {comments.length === 0 ? (
              <p className="text-gray-500 mt-4">Belum ada komentar.</p>
            ) : (
              comments.map((comment, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <img
                    src={`https://i.pravatar.cc/40?img=${(idx % 70) + 1}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold">{comment.username}</p>
                    <p className="text-xs text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input komentar */}
        <div className="p-4 border-t border-gray-300">
          <div className="flex items-center gap-2">
            {/* Avatar user */}
            <img
              src="https://i.pravatar.cc/32?img=12" // ganti dengan avatar user yang login
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />

            {/* Input + Send button */}
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm outline-none"
                placeholder="Tulis komentar..."
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black">
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
