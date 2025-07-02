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

  // Ambil session user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
  }, []);

  // Ambil style dengan date_use untuk user ini
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
          style: { nama_style: s.style_name, gambar: s.gambar, id: s.style_id },
        }));
        setStyleEvents(events);
      });
  }, [userId]);

  const handleDayClick = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const found = styleEvents.filter((e) => e.tanggal === dateStr);
    if (found.length) {
      navigate(`/detailstyle/${found[0].style.id}`);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dstr = date.toISOString().split("T")[0];
    const matched = styleEvents.filter((e) => e.tanggal === dstr);
    if (!matched.length) return null;
    return (
      <div className="flex justify-center flex-wrap gap-[2px] mt-1">
        {matched.map((e, i) => (
          <img
            key={i}
            src={e.style.gambar}
            alt={e.style.nama_style}
            className="w-9 h-12 object-cover rounded-md shadow"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 bg-black">
      <h2 className="text-center text-xl text-[#FFF313] font-bold mb-4">
        Kalender Outfit
      </h2>
      <Calendar
        className="rounded"
        onChange={setValue}
        value={value}
        onClickDay={handleDayClick}
        tileContent={tileContent}
        prev2Label={null}
        next2Label={null}
      />

      <BottomMenu />
    </div>
  );
}
