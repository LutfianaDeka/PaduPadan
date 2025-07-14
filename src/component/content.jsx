import { ArrowLeft, MessageSquare } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import LihatCommentPage from "./lihat_comment";
import { useLocation } from "react-router-dom";

export default function ContentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scrollToIndex = parseInt(searchParams.get("scrollTo"), 10);
  const postRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  const [publicStyles, setPublicStyles] = useState([]);
  const [liked, setLiked] = useState([]);
  const [userId, setUserId] = useState(null);
  const [likeCounts, setLikeCounts] = useState([]);
  const [isAnimating, setIsAnimating] = useState([]);

  const [showComments, setShowComments] = useState(false);
  const [commentIndex, setCommentIndex] = useState(null);
  const location = useLocation();
  const [commentCounts, setCommentCounts] = useState([]);

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
      console.error("Gagal ambil style:", error.message);
      return;
    }

    setPublicStyles(data);

    const likeResults = await Promise.all(
      data.map(async (style) => {
        const { count } = await supabase
          .from("style_like")
          .select("*", { count: "exact", head: true })
          .eq("style_id", style.style_id);
        return count || 0;
      })
    );
    setLikeCounts(likeResults);

    const commentResults = await Promise.all(
      data.map(async (style) => {
        const { count } = await supabase
          .from("style_comment")
          .select("*", { count: "exact", head: true })
          .eq("style_id", style.style_id);
        return count || 0;
      })
    );
    setCommentCounts(commentResults);

    if (currentUserId) {
      const likedStatus = await Promise.all(
        data.map(async (style) => {
          const { data: likeData } = await supabase
            .from("style_like")
            .select("like_id")
            .eq("style_id", style.style_id)
            .eq("user_id", currentUserId)
            .maybeSingle();
          return !!likeData;
        })
      );
      setLiked(likedStatus);
    } else {
      setLiked(data.map(() => false));
    }
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  // Realtime update for likes and comments
  useEffect(() => {
    const likeSub = supabase
      .channel("realtime-likes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "style_like" },
        () => fetchStyles()
      )
      .subscribe();

    const commentSub = supabase
      .channel("realtime-comments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "style_comment" },
        () => fetchStyles()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likeSub);
      supabase.removeChannel(commentSub);
    };
  }, []);

  useEffect(() => {
    if (
      !isNaN(scrollToIndex) &&
      postRefs.current[scrollToIndex] &&
      scrollContainerRef.current
    ) {
      const targetOffset = postRefs.current[scrollToIndex].offsetTop;
      scrollContainerRef.current.scrollTop = targetOffset;
    }
  }, [scrollToIndex, publicStyles]);

  const toggleLike = async (index) => {
    if (!userId) return;

    const style = publicStyles[index];
    const styleId = style.style_id;

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
  };

  useEffect(() => {
    setIsAnimating(Array(publicStyles.length).fill(false));
  }, [publicStyles]);

  const handleDoubleClick = (index) => {
    if (!liked[index]) {
      toggleLike(index);
    }

    const updatedAnim = [...isAnimating];
    updatedAnim[index] = true;
    setIsAnimating(updatedAnim);

    setTimeout(() => {
      updatedAnim[index] = false;
      setIsAnimating([...updatedAnim]);
    }, 800);
  };

  return (
    <div className="konten bg-black min-h-screen flex flex-col">
      <div className="nav h-14 flex px-4 items-center justify-center">
        <div
          className="ikon absolute left-4 text-[#FFF313]"
          onClick={() => navigate(`/home`)}
        >
          <ArrowLeft />
        </div>
        <h1
          className="text-[#FFF313] text-xl font-bold"
          style={{ fontFamily: "Redressed" }}
        >
          M2Outfit
        </h1>
      </div>
      <hr className="border-t border-[#FFF313] mx-4" />

      <div
        ref={scrollContainerRef}
        className="post flex flex-col gap-4 overflow-y-auto h-[calc(100vh-56px-1px)] snap-y snap-mandatory"
      >
        {publicStyles.map((style, index) => (
          <div
            key={style.style_id}
            className="post snap-start"
            ref={(el) => (postRefs.current[index] = el)}
          >
            <div className="user flex gap-4 items-center py-3 px-3">
              <img
                src={`https://i.pravatar.cc/40?img=${index + 1}`}
                alt="user"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-xs text-white font-bold">
                {style.username || "Anonim"}
              </p>
            </div>

            <div
              className="img-post"
              onDoubleClick={() => handleDoubleClick(index)}
            >
              <img
                src={style.gambar}
                alt={style.style_name}
                className="w-full aspect-square object-cover"
              />

              {isAnimating[index] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-white animate-pop"
                    viewBox="0 0 24 24"
                    fill="red"
                    stroke="none"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
              )}

              <div className="react flex gap-4 py-4 text-white px-3">
                <div className="like flex items-center gap-1">
                  <button onClick={() => toggleLike(index)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={liked[index] ? "red" : "none"}
                      stroke={liked[index] ? "red" : "white"}
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
              <div className="desc px-3">
                <h5 className="text-xs font-bold text-white">
                  {style.style_name}
                </h5>
                <p className="text-white text-xs">
                  {`"${style.style_name}" oleh ${style.username || "user"}`}
                </p>
              </div>
            </div>
          </div>
        ))}

        {showComments && commentIndex !== null && (
          <LihatCommentPage
            open={showComments}
            onClose={() => {
              setShowComments(false);
              setCommentIndex(null);
            }}
            styleId={publicStyles[commentIndex]?.style_id}
          />
        )}
      </div>
    </div>
  );
}
