import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";
import { supabase } from "../lib/supabase.jsx"; // connect ke supabase

export default function RegistrasiPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // State form
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandle = () => {
    navigate("/login");
    setTimeout(() => {
      const el = document.getElementById("login");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleRegister = async () => {
    // 1. Register ke Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Registrasi",
        text: error.message,
      });
      return;
    }
    const userId = data.user?.id;

    // 2. Simpan tambahan data user ke tabel `users` (opsional)
    if (userId) {
      await supabase.from("users").insert([
        {
          user_id: userId,
          username,
          email,
          profile_picture: "https://...", // bisa kosong dulu
        },
      ]);
    }

    Swal.fire({
      icon: "success",
      title: "Registrasi Berhasil!",
      text: "Silakan login ke akunmu sekarang.",
      //   text: "Silakan cek email kamu untuk verifikasi.",
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <>
      <div className="registrasi h-screen bg-black flex flex-col justify-between items-center text-center cursor-pointer">
        <h1
          className="text-[#FFF313] text-3xl mt-20"
          style={{ fontFamily: "Redressed" }}
        >
          M2Outfit
        </h1>
        <div className="login-user grid gap-4 text-left">
          <input
            type="text"
            placeholder="Nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="text-white bg-[#198499]/20 border-1 border-[#FFF313] rounded-[10px] pl-4 w-62 py-3"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-white bg-[#198499]/20 border-1 border-[#FFF313] rounded-[10px] pl-4 w-62 py-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-white bg-[#198499]/20 border-1 border-[#FFF313] rounded-[10px] pl-4 w-62 py-3"
          />
          <div className="relative w-62">
            {/* Input */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-white bg-[#198499]/20 border-1 border-[#FFF313] rounded-[10px] pl-4 pr-10 py-3"
            />

            {/* Eye Icon Inside Input */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-[#FFF313] focus:outline-none"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div className="btn mb-20">
          <button
            onClick={handleRegister}
            className="text-black w-62 font-bold  py-3 bg-[#FFF313] rounded-full shadow-lg transition duration-300 ease-in-out transfor hover:bg-[#E1AD01] cursor-pointer"
          >
            REGISTER
          </button>
          <p
            onClick={loginHandle}
            className="text-[#FFF313] text-sm pt-4  cursor-pointer"
          >
            Masuk ke akun saya
          </p>
        </div>
      </div>
    </>
  );
}
