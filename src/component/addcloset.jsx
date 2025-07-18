import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { supabase } from "../lib/supabase.jsx";
import Swal from "sweetalert2";

export default function AddCloset() {
  const location = useLocation();
  const navigate = useNavigate();
  const capturedImg = location.state?.capturedImg;

  const [kategori, setKategori] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Gagal ambil session:", error.message);
        return;
      }

      const id = session?.user?.id;
      setUserId(id);
    };
    getUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      alert("User belum login.");
      return;
    }
  
    const { data, error } = await supabase.from("item_wardrobe").insert([
      {
        user_id: userId,
        kategori,
        gambar: capturedImg,
      },
    ]);
  
    if (error) {
      console.error("Gagal menyimpan:", error.message);
    } else {
      // 👉 SweetAlert dengan redirect ke /closet setelah klik OK
      Swal.fire({
        title: "Berhasil!",
        text: `Item berhasil ditambahkan ke lemari ${kategori}`,
        icon: "success",
        confirmButtonColor: "#10b981",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/closet");
        }
      });
    }
  };
  
  

  if (!capturedImg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-6 text-gray-700">
        <p className="text-lg font-medium">Tidak ada gambar ditemukan.</p>
        <button
          onClick={() => navigate("/kamera")}
          className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition duration-300"
        >
          Kembali ke Kamera
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white shadow-md w-full max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/upload")}
          className="text-green-500 hover:text-green-600 text-xl"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 text-center flex-1">
          Tambah ke Lemari
        </h1>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Gambar Preview */}
      <div className="w-full max-w-md mx-auto mt-6 px-4">
        <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-md border border-gray-200">
          <img
            src={capturedImg}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto px-4 pt-6 pb-10 space-y-4"
      >
        <label className="block text-sm font-medium text-gray-700">
          Pilih Kategori
        </label>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        >
          <option value="">-- Pilih --</option>
          <option value="atasan">Atasan</option>
          <option value="bawahan">Bawahan</option>
          <option value="aksesoris">Aksesoris</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 py-3 text-white font-semibold rounded-full transition duration-300"
        >
          Simpan ke Lemari
        </button>
      </form>
    </div>
  );
}
