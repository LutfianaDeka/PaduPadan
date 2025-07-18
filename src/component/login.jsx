import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../lib/supabase";

// ...import tetap sama

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("email")
      .eq("username", username)
      .single();

    if (userError || !users) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Username tidak ditemukan",
      });
      return;
    }

    const email = users.email;

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
    } else {
      document.body.classList.add("fade-out");
      setTimeout(() => {
        navigate("/home");
      }, 200);
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/home",
      },
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Gagal login dengan Google",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 to-white px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="PaduPadan Logo" className="w-20 mx-auto mb-2" />
          <h2 className="text-2xl font-semibold text-green-700">Masuk ke PaduPadan</h2>
          <p className="text-gray-500 text-sm">Padupadankan outfit favoritmu!</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          {/* Tautan Lupa Password */}
          <p
            onClick={() => navigate("/update-pass")}
            className="text-sm text-right text-green-600 hover:underline cursor-pointer -mt-2"
          >
            Lupa password?
          </p>

          <button
            onClick={handleLogin}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Masuk
          </button>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <span className="h-px w-12 bg-gray-300" />
            <span>atau</span>
            <span className="h-px w-12 bg-gray-300" />
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full border border-gray-300 py-3 rounded-lg flex justify-center items-center gap-2 hover:shadow-md transition"
          >
            <img src="/google.png" alt="Google" className="w-5 h-5" />
            <span className="text-sm text-gray-700">Lanjutkan dengan Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

