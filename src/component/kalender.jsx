import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import BottomMenu from "./menu";
import { supabase } from "../lib/supabase";

export default function Kalender() {
  const [value, setValue] = useState(new Date());
  const [styleEvents, setStyleEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateStyles, setSelectedDateStyles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Ambil session user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

  // Ambil style yang punya date_use
  useEffect(() => {
    if (!userId) return;
    supabase
      .from("style_wardrobe")
      .select("style_id, style_name, gambar, date_use")
      .eq("user_id", userId)
      .not("date_use", "is", null)
      .then(({ data, error }) => {
        if (error) return console.error(error);
        const events = data.map((s) => ({
          tanggal: s.date_use,
          style: {
            nama_style: s.style_name,
            gambar: s.gambar,
            id: s.style_id,
          },
        }));
        setStyleEvents(events);
      });
  }, [userId]);

  const handleDayClick = (date) => {
    const dateStr = date.toLocaleDateString("sv-SE");
    const matched = styleEvents.filter((e) => e.tanggal === dateStr);
    if (matched.length === 1) {
      navigate(`/detail_style/${matched[0].style.id}`);
    } else if (matched.length > 1) {
      setSelectedDate(dateStr);
      setSelectedDateStyles(matched);
      setModalOpen(true);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const tanggal = date.toLocaleDateString("sv-SE");
    const matched = styleEvents.filter((e) => e.tanggal === tanggal);
    const maxPreview = 2;

    
    return (
      <div className="relative h-[50px] w-full flex flex-wrap gap-1 justify-center items-center p-1">
        {matched.slice(0, maxPreview).map((e, i) => (
          <img
            key={i}
            src={e.style.gambar}
            alt={e.style.nama_style}
            className="w-8 h-8 rounded object-cover shadow"
          />
        ))}
        {matched.length > maxPreview && (
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDateStyles(matched);
              setModalOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                setSelectedDateStyles(matched);
                setModalOpen(true);
              }
            }}
            className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded cursor-pointer"
          >
            +{matched.length - maxPreview}
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 shadow-xl relative">
            {/* TANGGAL */}
            <h3 className="text-center font-bold text-lg mb-2 text-black">
              Outfit{" "}
              {selectedDate &&
                new Date(selectedDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
            </h3>

            {/* OUTFIT LIST */}
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {selectedDateStyles.map((e, i) => (
                <div
                  key={i}
                  className="w-full aspect-square bg-white rounded shadow cursor-pointer hover:brightness-90 transition flex flex-col items-center justify-center"
                  onClick={() => {
                    navigate(`/detail_style/${e.style.id}`);
                    setModalOpen(false);
                  }}
                >
                  <img
                    src={e.style.gambar || "/placeholder.png"}
                    alt={e.style.nama_style || "Outfit"}
                    className="max-w-full max-h-[80%] object-contain p-2"
                  />
                  <p className="text-sm text-center text-black mt-1 truncate w-full px-1">
                    {e.style.nama_style}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen p-4 bg-black">
        <h2 className="text-center text-xl text-[#FFF313] font-bold mb-4">
          Kalender Outfit
        </h2>

        <Calendar
          className="w-full max-w-4xl mx-auto rounded bg-white p-2 shadow"
          onChange={setValue}
          value={value}
          onClickDay={handleDayClick}
          tileContent={tileContent}
          prev2Label={null}
          next2Label={null}
        />
        <BottomMenu />
      </div>
    </>
  );
}
