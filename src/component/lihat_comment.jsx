import { useEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { supabase } from "../lib/supabase";
import userpic from "../assets/user.png";

export default function LihatCommentPage({ open, onClose, styleId }) {
  const startYRef = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("profile_picture")
          .eq("user_id", session.user.id)
          .single();

        if (!error && data) setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      if (!styleId) return;

      const { data, error } = await supabase
        .from("v_style_comment_with_user")
        .select("*")
        .eq("style_id", styleId)
        .order("created_at", { ascending: true });

      if (!error) setLocalComments(data);
      else console.error("Gagal ambil komentar:", error.message);
    };

    if (open && styleId) fetchComments();
  }, [styleId, open]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    const { error: insertError } = await supabase.from("style_comment").insert([
      {
        comment: newComment,
        user_id: session.user.id,
        style_id: styleId,
      },
    ]);

    if (insertError) {
      console.error("Gagal tambah komentar:", insertError.message);
      return;
    }

    setNewComment("");

    const { data: updated, error: fetchError } = await supabase
      .from("v_style_comment_with_user")
      .select("*")
      .eq("style_id", styleId)
      .order("created_at", { ascending: true });

    if (!fetchError) setLocalComments(updated);
    else console.error("Gagal refresh komentar:", fetchError.message);
  };

  const startDrag = (y) => {
    if (!isDesktop) {
      setIsDragging(true);
      startYRef.current = y;
    }
  };

  const updateDrag = (y) => {
    if (isDragging) {
      const deltaY = y - startYRef.current;
      if (deltaY > 0) setTranslateY(deltaY);
    }
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateY > window.innerHeight * 0.2) onClose();
    else setTranslateY(0);
  };

  // Drag on desktop
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

  // Drag on mobile
  useEffect(() => {
    const handleTouchMove = (e) => {
      if (isDragging) {
        updateDrag(e.touches[0].clientY);
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => document.removeEventListener("touchmove", handleTouchMove);
  }, [isDragging]);

  if (!open) return null;

  const getProfilePic = (url) => (url && !url.endsWith("...") ? url : userpic);

  return (
    <div className="fixed inset-0 z-50 text-black">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <div
        className={`absolute bg-gray-100 shadow-lg shadow-black/20 flex flex-col ${
          isDesktop
            ? "top-0 right-0 w-[400px] h-full rounded-none"
            : "bottom-0 w-full rounded-t-3xl"
        }`}
        style={{
          height: isDesktop ? "100%" : "80%",
          transform: isDesktop ? "none" : `translateY(${translateY}px)`,
          transition: isDragging && !isDesktop ? "none" : "transform 0.3s ease",
          touchAction: isDesktop ? "auto" : "none",
        }}
        onMouseDown={(e) => startDrag(e.clientY)}
        onTouchStart={(e) => startDrag(e.touches[0].clientY)}
        onTouchEnd={endDrag}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center pt-4 pb-4 border-b border-gray-300">
          {!isDesktop && (
            <div className="w-12 h-1 bg-black/30 rounded-full mb-2" />
          )}
          <h2 className="text-sm font-medium">Komentar</h2>
        </div>

        {/* Komentar */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="space-y-3 pt-2 pb-4">
            {localComments.length === 0 ? (
              <p className="text-gray-500 mt-4 text-xs">Belum ada komentar.</p>
            ) : (
              localComments.map((comment, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <img
                    src={getProfilePic(comment.profile_picture)}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-semibold">{comment.username}</p>
                    <p className="text-xs text-gray-700">{comment.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input komentar */}
        <div className="p-4 border-t border-gray-300">
          <div className="flex items-center gap-2">
            <img
              src={getProfilePic(userProfile?.profile_picture)}
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="relative flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm outline-none"
                placeholder="Tulis komentar..."
              />
              <button
                onClick={handleAddComment}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
