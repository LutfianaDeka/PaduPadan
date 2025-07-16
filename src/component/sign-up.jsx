import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";
import { supabase } from "../lib/supabase.jsx";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandle = () => navigate("/login");

  const handleRegister = async () => {
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

    if (userId) {
      await supabase.from("users").insert([
        {
          user_id: userId,
          username,
          email,
          full_name: nama,
          profile_picture: "",
        },
      ]);
    }

    Swal.fire({
      icon: "success",
      title: "Registrasi Berhasil!",
      text: "Silakan login ke akunmu sekarang.",
    }).then(() => {
      navigate("/login");
    });
  };

  const handleRegisterWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/home",
      },
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal daftar menggunakan Google",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 to-white px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="PaduPadan Logo" className="w-20 mx-auto mb-2" />
          <h2 className="text-2xl font-semibold text-green-700">Daftar ke PaduPadan</h2>
          <p className="text-gray-500 text-sm">Padupadankan outfit favoritmu!</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            onClick={handleRegister}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Daftar
          </button>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <span className="h-px w-12 bg-gray-300" />
            <span>atau</span>
            <span className="h-px w-12 bg-gray-300" />
          </div>

          <button
            onClick={handleRegisterWithGoogle}
            className="w-full border border-gray-300 py-3 rounded-lg flex justify-center items-center gap-2 hover:shadow-md transition"
          >
            <img src="google.png" alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-700">Daftar dengan Google</span>
          </button>

          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <span
              onClick={loginHandle}
              className="text-green-600 font-medium cursor-pointer hover:underline"
            >
              Masuk
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
