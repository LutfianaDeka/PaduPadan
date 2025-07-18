import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabase.jsx";
import { ArrowLeft } from "lucide-react";

export default function FormStyle() {
  const location = useLocation();
  const navigate = useNavigate();
  const capturedImg = location.state?.capturedImg;

  const [isExiting, setIsExiting] = useState(false);
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
        confirmButtonColor: "#22C55E", // hijau
      });
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    const { data, error } = await supabase.from("style_wardrobe").insert([
      {
        user_id: userId,
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
      title: "Yeay!",
      text: "Style Berhasil Ditambahkan!",
      confirmButtonText: "OK",
      confirmButtonColor: "#22C55E",
    }).then(() => {
      navigate("/closet");
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Full-width Header */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <div className="relative h-16 flex items-center">
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => navigate(-1), 300);
            }}
            className="absolute left-4 text-green-600 hover:text-green-800"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 flex flex-col items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}>
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            {capturedImg ? (
              <img
                src={capturedImg}
                alt="Style Preview"
                className="w-full h-auto max-h-[500px] object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-400">
                Tidak ada gambar
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-5">
            <input
              type="text"
              placeholder="Nama Style"
              value={styleName}
              onChange={(e) => setStyleName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-green-50 text-gray-800 placeholder-gray-500 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 font-medium"
            />

            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={addToCalendar}
                onChange={(e) => setAddToCalendar(e.target.checked)}
                className="accent-green-500"
              />
              <span>Tambahkan ke kalender</span>
            </label>

            {addToCalendar && (
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-green-50 text-gray-800 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 font-medium"
              />
            )}

            <div className="text-sm text-gray-700">
              <p className="mb-2 font-semibold">Status</p>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="private"
                    checked={status === "private"}
                    onChange={() => setStatus("private")}
                    className="accent-green-500"
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
                    className="accent-green-500"
                  />
                  <span>Publik</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-bold transition duration-300 shadow-md mt-6"
            >
              Simpan Style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
