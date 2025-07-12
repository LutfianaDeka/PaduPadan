import { useEffect, useRef, useState } from "react";

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
    if (translateY > window.innerHeight * 0.2) {
      onClose();
    } else {
      setTranslateY(0);
    }
  };

  // mouse listener
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => startDrag(e.clientY);
  const handleMouseMove = (e) => updateDrag(e.clientY);
  const handleMouseUp = () => endDrag();

  // touch listener
  const handleTouchStart = (e) => startDrag(e.touches[0].clientY);
  //   cegah reload halaman
  const handleTouchMove = (e) => {
    updateDrag(e.touches[0].clientY);
    if (isDragging) {
      e.preventDefault(); // ⚠️ Cegah browser reload
    }
  };
  const handleTouchEnd = () => endDrag();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 text-black">
      <div className="absolute inset-0 bg-black/20" onClick={onClose}></div>

      <div
        className="absolute bottom-0 w-full bg-gray-100 rounded-t-3xl p-4 overflow-y-auto shadow-xs shadow-black/20"
        style={{
          height: "80%",
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-1 bg-black/30 rounded-full" />
          <h2 className="text-sm">Komentar</h2>
        </div>
        <div className="comment p-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">Belum ada komentar.</p>
          ) : (
            comments.map((comment, idx) => (
              <div key={idx} className="mb-3">
                <p className="text-sm font-semibold">{comment.username}</p>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
