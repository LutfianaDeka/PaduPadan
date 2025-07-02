import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { supabase } from "../lib/supabase.jsx"; // connect ke supabase

export default function AddCloset() {
  const location = useLocation();
  const navigate = useNavigate();
  const capturedImg = location.state?.capturedImg;

  // const [namaItem, setNamaItem] = useState("");
  const [kategori, setKategori] = useState("");
  const [userId, setUserId] = useState(null); // akan diisi dari session

  // Ambil user_id dari session saat komponen dimount
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

    // console.log("Insert result:", data);
    // console.log("Insert error:", error);

    if (error) {
      console.error("Gagal menyimpan:", error.message);
      // alert("Gagal menyimpan.");
    } else {
      console.log("Berhasil disimpan!", data);
      navigate("/closet", { state: { savedImg: capturedImg } });
    }
  };

  if (!capturedImg) {
    return (
      <div className="text-center p-6">
        <p>Tidak ada gambar ditemukan.</p>
        <button
          onClick={() => navigate("/kamera")}
          className="mt-4 px-4 py-2 bg-yellow-400 rounded-full"
        >
          Kembali ke Kamera
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between w-full max-w-sm mx-auto px-4 py-3">
        <button
          onClick={() => navigate("/kamera")}
          className="text-yellow-500 hover:text-yellow-600 text-xl"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 text-center flex-1">
          Tambah ke Lemari
        </h1>
        <div className="w-6" /> {/* Spacer untuk menjaga keseimbangan */}
      </div>

      {/* Preview Gambar */}
      <div className="w-full max-w-sm mx-auto mt-4 aspect-[3/4]">
        <img
          src={capturedImg}
          alt="Preview"
          className="w-full h-full object-cover rounded-md shadow"
        />
      </div>

      {/* Form Tambah */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto px-4 pt-6 pb-10 space-y-4"
      >
        {/* <input
          type="text"
          placeholder="Nama pakaian"
          value={namaItem}
          onChange={(e) => setNamaItem(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        /> */}
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          required
        >
          <option value="">Pilih kategori</option>
          <option value="atasan">Atasan</option>
          <option value="bawahan">Bawahan</option>
          <option value="aksesoris">Aksesoris</option>
        </select>
        <button
          type="submit"
          className="w-full bg-yellow-400 py-3 rounded-full text-black font-semibold hover:bg-yellow-500 transition"
        >
          Simpan ke Lemari
        </button>
      </form>
    </div>
  );
}
