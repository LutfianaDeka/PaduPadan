import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabase.jsx"; // connect ke supabase

export default function FormStyle() {
  const location = useLocation();
  const navigate = useNavigate();
  const capturedImg = location.state?.capturedImg;

  const [styleName, setStyleName] = useState("");
  const [date, setDate] = useState("");
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [status, setStatus] = useState("private");

  const handleSave = async () => {
    if (!styleName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Style belum diberi nama!",
        text: "Silakan isi nama style sebelum menyimpan.",
        confirmButtonColor: "#FACC15",
      });
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;

    const { data, error } = await supabase.from("style_wardrobe").insert([
      {
        user_id: userId, // ← ini harus 'user_id'
        style_name: styleName,
        status: status,
        gambar: capturedImg,
        date_use: addToCalendar ? date : null,
      },
    ]);

    if (error) {
      console.error("Gagal menyimpan:", error.message);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan.", "error");
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Yeay",
      text: "Style Berhasil Ditambahkan!",
      confirmButtonText: "OK",
      confirmButtonColor: "#7C3AED",
    }).then(() => {
      navigate("/closet");
    });
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="w-full max-w-sm mx-auto mt-4 aspect-[3/4]">
        {capturedImg ? (
          <img
            src={capturedImg}
            alt="Preview"
            className="w-full h-full object-contain rounded-md shadow"
          />
        ) : (
          <p className="text-center text-gray-400">Tidak ada gambar</p>
        )}
      </div>

      {/* Form Input */}
      <div className="mt-6 max-w-sm mx-auto space-y-4">
        <input
          type="text"
          placeholder="Nama Style"
          value={styleName}
          onChange={(e) => setStyleName(e.target.value)}
          className="w-full px-4 py-2 rounded bg-yellow-100 text-black font-semibold"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={addToCalendar}
            onChange={(e) => setAddToCalendar(e.target.checked)}
          />
          <span className="text-sm">Tambahkan ke kalender</span>
        </label>

        {addToCalendar && (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 rounded bg-yellow-100 text-black font-semibold"
          />
        )}

        <div>
          <p className="mb-2">Status</p>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="status"
              value="private"
              checked={status === "private"}
              onChange={() => setStatus("private")}
            />
            <span>Privat</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="status"
              value="public"
              checked={status === "public"}
              onChange={() => setStatus("public")}
            />
            <span>Publik</span>
          </label>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-yellow-400 py-3 rounded-full text-black font-bold"
        >
          Simpan Style
        </button>
      </div>
    </div>
  );
}
