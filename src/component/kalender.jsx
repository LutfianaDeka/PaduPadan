import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import BottomMenu from "./menu";
import Navbar from "../component/navbar";
import { supabase } from "../lib/supabase";

export default function Kalender() {
  const [value, setValue] = useState(new Date());
  const [styleEvents, setStyleEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateStyles, setSelectedDateStyles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

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
            className="absolute bottom-1 right-1 bg-green-600 text-white text-xs px-1 rounded cursor-pointer"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-4 shadow-xl relative">
            <h3 className="text-center font-semibold text-lg mb-3 text-green-700">
              Outfit{" "}
              {selectedDate &&
                new Date(selectedDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
            </h3>

            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
              {selectedDateStyles.map((e, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow border hover:shadow-md cursor-pointer transition"
                  onClick={() => {
                    navigate(`/detail_style/${e.style.id}`);
                    setModalOpen(false);
                  }}
                >
                  <img
                    src={e.style.gambar || "/placeholder.png"}
                    alt={e.style.nama_style || "Outfit"}
                    className="w-full h-32 object-cover rounded-t-xl"
                  />
                  <p className="text-sm text-center text-green-700 font-medium py-2 truncate">
                    {e.style.nama_style}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* HALAMAN */}
      <div className="min-h-screen bg-[#f9f9f9] pb-24">
        <Navbar />
        <div className="p-4">
          <h2 className="text-center text-2xl font-bold text-green-700 mb-6">
            Kalender Outfit
          </h2>

          <Calendar
            className="w-full max-w-3xl mx-auto rounded-xl bg-white p-4 shadow-lg"
            onChange={setValue}
            value={value}
            onClickDay={handleDayClick}
            tileContent={tileContent}
            prev2Label={null}
            next2Label={null}
          />
        </div>
      </div>
    </>
  );
}
