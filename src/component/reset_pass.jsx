import { useState } from "react";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";

export default function ResetPass() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Email tidak boleh kosong!",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://m2outfit.vercel.app/update-pass",
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message,
        confirmButtonColor: "#16a34a",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Link reset password telah dikirim ke email kamu.",
        confirmButtonColor: "#16a34a",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white border border-green-600 rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-green-700 text-2xl font-bold mb-4">
          Reset Password
        </h2>
        <p className="text-gray-700 text-sm mb-6">
          Masukkan email yang kamu gunakan untuk mereset password.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 mb-4 rounded-lg bg-white border border-green-500 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={handleReset}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-full shadow-md transition duration-300"
        >
          Kirim Link Reset
        </button>
      </div>
    </div>
  );
}
