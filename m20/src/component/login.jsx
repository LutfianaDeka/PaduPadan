import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabase"; //ambil data supabase

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const registerHandle = () => {
    navigate("/registrasi");
    setTimeout(() => {
      const el = document.getElementById("registrasi");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleLogin = async () => {
    // 1. Cari email dari username
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("username", username)
      .single(); // ambil 1 data

    if (userError || !users) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Username tidak ditemukan",
      });
      return;
    }

    const email = users.email;

    // 2. Login dengan email yang ditemukan
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      let message = loginError.message;

      if (message.toLowerCase().includes("invalid login")) {
        message = "Password salah.";
      }

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: message,
      });
      return;
    } else {
      console.log("Login Berhasil! Selamat datang di M2Outfit.");
      document.body.classList.add("fade-out");

      setTimeout(() => {
        navigate("/home");
      }, 200);
    }
  };

  const handleResetPassword = () => {
    navigate("/reset");
    setTimeout(() => {
      const el = document.getElementById("reset");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <>
      <div className="login min-h-screen overflow-auto bg-black flex flex-col justify-between items-center text-center">
        <h1
          className="text-[#FFF313] text-3xl mt-20"
          style={{ fontFamily: "Redressed" }}
        >
          M2Outfit
        </h1>
        <div className="login-user grid gap-4 text-left">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <p
            onClick={handleResetPassword}
            className="text-white text-xs  cursor-pointer"
          >
            Forgot password?
          </p>
        </div>
        <div className="btn mb-50">
          <button
            onClick={handleLogin}
            className="text-black w-62 font-bold  py-3 bg-[#FFF313] rounded-full shadow-lg transition duration-300 ease-in-out transfor hover:bg-[#E1AD01] cursor-pointer"
          >
            LOGIN
          </button>
          <p
            onClick={registerHandle}
            className="text-[#FFF313] text-sm pt-4 cursor-pointer"
          >
            Create account
          </p>
        </div>
      </div>
    </>
  );
}
