import { useState } from "react";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

export default function UpdatePass() {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Kosong",
        text: "Silakan masukkan password baru",
        confirmButtonColor: "#16A34A", // Tailwind's green-600
      });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message,
        confirmButtonColor: "#16A34A",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Password berhasil diperbarui. Silakan login ulang.",
        confirmButtonColor: "#16A34A",
      }).then(() => {
        window.location.href = "/login";
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center border border-green-200">
        <img src="/logo.png" alt="PaduPadan Logo" className="w-16 mx-auto mb-4" />
        <h2 className="text-green-700 text-2xl font-bold mb-1">Perbarui Password</h2>
        <p className="text-gray-500 text-sm mb-6">
          Silakan buat password baru untuk melindungi akunmu.
        </p>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password baru"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleUpdatePassword}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition shadow-sm"
        >
          Konfirmasi
        </button>
      </div>
    </div>
  );
}
