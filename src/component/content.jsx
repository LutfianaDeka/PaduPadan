import { ArrowLeft, MessageSquare } from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import LihatCommentPage from "./lihat_comment";
import userpic from "../assets/user.png";

export default function ContentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scrollToIndex = parseInt(searchParams.get("scrollTo"), 10);
  const postRefs = useRef([]);
  const scrollContainerRef = useRef(null);
  const location = useLocation();
  const filteredFromState = location.state?.filtered || null;

  const [publicStyles, setPublicStyles] = useState([]);
  const [liked, setLiked] = useState([]);
  const [userId, setUserId] = useState(null);
  const [likeCounts, setLikeCounts] = useState([]);
  const [commentCounts, setCommentCounts] = useState([]);
  const [isAnimating, setIsAnimating] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentIndex, setCommentIndex] = useState(null);

  const [setUserProfile] = useState(null);

  // ambil foto user
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

  const getProfilePic = (url) => (url && !url.endsWith("...") ? url : userpic);

  // Scroll otomatis ke index post tertentu (dari halaman sebelumnya)
  useEffect(() => {
    if (!isNaN(scrollToIndex) && postRefs.current[scrollToIndex]) {
      const offset = postRefs.current[scrollToIndex].offsetTop;
      scrollContainerRef.current.scrollTop = offset;
    }
  }, [scrollToIndex, publicStyles]);

  // Reset tampilan komentar saat berpindah route
  useEffect(() => {
    setShowComments(false);
  }, [location]);

  // Ambil user aktif
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUserId(session?.user?.id);
    };
    getUser();
  }, []);

  // Ambil data style dari state atau database
  useEffect(() => {
    if (filteredFromState) {
      setPublicStyles(filteredFromState);
      fetchCounts(filteredFromState);
      checkLiked(filteredFromState, userId);
    } else {
      fetchStyles();
    }
  }, [filteredFromState, userId]);

  const fetchStyles = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;
    setUserId(currentUserId);

    const { data, error } = await supabase
      .from("v_style_with_user")
      .select("*")
      .eq("status", "public")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error ambil style:", error.message);
      return;
    }

    setPublicStyles(data);
    fetchCounts(data);
    checkLiked(data, currentUserId);
  };

  const fetchCounts = async (styles) => {
    const likeResults = await Promise.all(
      styles.map(async (style) => {
        const { count } = await supabase
          .from("style_like")
          .select("*", { count: "exact", head: true })
          .eq("style_id", style.style_id);
        return count || 0;
      })
    );
    setLikeCounts(likeResults);

    const commentResults = await Promise.all(
      styles.map(async (style) => {
        const { count } = await supabase
          .from("style_comment")
          .select("*", { count: "exact", head: true })
          .eq("style_id", style.style_id);
        return count || 0;
      })
    );
    setCommentCounts(commentResults);
  };

  const checkLiked = async (styles, userId) => {
    if (!userId) return setLiked(styles.map(() => false));

    const likedStatus = await Promise.all(
      styles.map(async (style) => {
        const { data } = await supabase
          .from("style_like")
          .select("like_id")
          .eq("style_id", style.style_id)
          .eq("user_id", userId)
          .maybeSingle();
        return !!data;
      })
    );
    setLiked(likedStatus);
  };

  const toggleLike = async (index) => {
    if (!userId) return;
    const styleId = publicStyles[index].style_id;

    if (liked[index]) {
      await supabase
        .from("style_like")
        .delete()
        .eq("style_id", styleId)
        .eq("user_id", userId);
    } else {
      await supabase.from("style_like").insert({
        style_id: styleId,
        user_id: userId,
      });
    }

    // Refresh like & status
    const updatedStyles = [...publicStyles];
    fetchCounts(updatedStyles);
    checkLiked(updatedStyles, userId);
  };

  const handleDoubleClick = (index) => {
    if (!liked[index]) toggleLike(index);

    const updated = [...isAnimating];
    updated[index] = true;
    setIsAnimating(updated);

    setTimeout(() => {
      updated[index] = false;
      setIsAnimating([...updated]);
    }, 800);
  };

  // Inisialisasi animasi love saat data dimuat
  useEffect(() => {
    setIsAnimating(Array(publicStyles.length).fill(false));
  }, [publicStyles]);

  return (
    <div className="konten bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="nav h-14 flex px-4 items-center justify-center">
        <div
          className="ikon absolute left-4 text-gray-800 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft />
        </div>
        <h1
          className="text-green-700 text-xl md:text-2xl font-bold tracking-wide"
          style={{ fontFamily: "Redressed" }}
        >
          PaduPadan
        </h1>
      </div>
      <hr className="border-t border-gray-600/80 mx-4" />

      {/* Kontainer konten scroll */}
      <div
        ref={scrollContainerRef}
        className="post-container flex flex-col gap-4 overflow-y-scroll h-[calc(100vh-56px-1px)] snap-y snap-mandatory"
      >
        {publicStyles.map((style, index) => (
          <div
            key={style.style_id}
            ref={(el) => (postRefs.current[index] = el)}
            className="post snap-start h-screen w-full flex flex-col justify-start md:w-130 md:mx-auto"
          >
            {/* Info Pengguna */}
            <div className="user flex gap-4 items-center py-3 px-3">
              <img
                src={getProfilePic(style.profile_picture)}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-xs text-black font-bold">
                {style.username || "Anonim"}
              </p>
            </div>

            {/* Gambar & Interaksi */}
            <div
              className="img-post relative"
              onDoubleClick={() => handleDoubleClick(index)}
            >
              <img
                src={style.gambar}
                alt={style.style_name}
                className="w-full aspect-square bg-white object-contain border border-gray-200"
              />

              {/* Animasi love */}
              {isAnimating[index] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-white animate-pop"
                    viewBox="0 0 24 24"
                    fill="red"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              )}

              {/* Reaksi Like & Komentar */}
              <div className="react flex gap-4 py-4 text-black px-3">
                <div className="like flex items-center gap-1">
                  <button onClick={() => toggleLike(index)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={liked[index] ? "red" : "none"}
                      stroke={liked[index] ? "red" : "black"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  <p className="text-xs">{likeCounts[index] || 0}</p>
                </div>

                <div className="comment flex items-center gap-1">
                  <button
                    onClick={() => {
                      setCommentIndex(index);
                      setShowComments(true);
                    }}
                  >
                    <MessageSquare />
                  </button>
                  <p className="text-xs">{commentCounts[index] || 0}</p>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="desc px-3">
                <h5 className="text-xs font-bold text-black">
                  {style.style_name}
                </h5>
                <p className="text-black text-xs">
                  {`"${style.style_name}" oleh ${style.username || "user"}`}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Komentar Modal */}
        {showComments && commentIndex !== null && (
          <LihatCommentPage
            open={showComments}
            onClose={() => {
              setShowComments(false);
              setCommentIndex(null);
              if (!filteredFromState) fetchStyles();
            }}
            styleId={publicStyles[commentIndex]?.style_id}
          />
        )}
      </div>
    </div>
  );
}
