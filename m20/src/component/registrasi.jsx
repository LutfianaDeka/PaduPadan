import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
export default function RegistrasiPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const loginHandle = () => {
    navigate("/login");
    setTimeout(() => {
      const el = document.getElementById("login");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
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
            className="text-[#FFF313] bg-[#198499]/20 border-1 border-[#FFF313] rounded-[10px] pl-4 w-62 py-3"
          />
          <input
            type="text"
            placeholder="Username"
            className="text-[#FFF313] bg-[#198499]/20 border-1 border-[#FFF313] rounded-[10px] pl-4 w-62 py-3"
          />
          <input
            type="email"
            placeholder="Email"
            className="text-[#FFF313] bg-[#198499]/20 border-1 border-[#FFF313] rounded-[10px] pl-4 w-62 py-3"
          />
          <div className="relative w-62">
            {/* Input */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full text-[#FFF313] bg-[#198499]/20 border-1 border-[#FFF313] rounded-[10px] pl-4 pr-10 py-3"
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
          <button className="text-black w-62 font-bold  py-3 bg-[#FFF313] rounded-full shadow-lg transition duration-300 ease-in-out transfor hover:bg-[#E1AD01] cursor-pointer">
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
