import { ArrowLeft, MessageSquare } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function ContentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const scrollToIndex = parseInt(searchParams.get("scrollTo"), 10);
  const postRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (
      !isNaN(scrollToIndex) &&
      postRefs.current[scrollToIndex] &&
      scrollContainerRef.current
    ) {
      const targetOffset = postRefs.current[scrollToIndex].offsetTop;
      scrollContainerRef.current.scrollTop = targetOffset;
    }
  }, [scrollToIndex]);

  const randomImages = Array.from(
    { length: 20 },
    (_, i) => `https://picsum.photos/seed/${i + 1}/300/300`
  );

  const [liked, setLiked] = useState(Array(randomImages.length).fill(false));

  const toggleLike = (index) => {
    const newLiked = [...liked];
    newLiked[index] = !newLiked[index];
    setLiked(newLiked);
  };

  return (
    <>
      <div className="konten bg-black min-h-screen flex flex-col">
        {/* Navbar */}
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

        {/* Scrollable Content Area */}
        <div
          ref={scrollContainerRef}
          className="post flex flex-col gap-4 overflow-y-auto h-[calc(100vh-56px-1px)] snap-y snap-mandatory"
        >
          {randomImages.map((src, index) => (
            <div
              key={index}
              className="post snap-start"
              ref={(el) => (postRefs.current[index] = el)}
            >
              {/* User Info */}
              <div className="user flex gap-4 items-center py-3 px-3">
                <img
                  src={`https://i.pravatar.cc/40?img=${index + 1}`}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-xs text-white font-bold">User {index + 1}</p>
              </div>

              {/* Image & Reactions */}
              <div className="img-post">
                <img
                  src={src}
                  alt={`outfit-${index}`}
                  className="w-full aspect-square object-cover"
                />
                <div className="react flex gap-6 py-4 text-white px-3">
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
                  <button>
                    <MessageSquare />
                  </button>
                </div>

                {/* Description */}
                <div className="desc px-3">
                  <h5 className="text-xs font-bold text-white">
                    Nama Postingan {index + 1}
                  </h5>
                  <p className="text-white text-xs">
                    deskripsi Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Nulla omnis debitis voluptatum reiciendis eaque! Harum
                    vel quas hic optio officia. {index + 1}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
