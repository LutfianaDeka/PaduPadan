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
        title: "Password kosong",
        text: "Silakan masukkan password baru",
        confirmButtonColor: "#FFF313",
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
        confirmButtonColor: "#FFF313",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Password berhasil diperbarui. Silakan login ulang.",
        confirmButtonColor: "#FFF313",
      }).then(() => {
        window.location.href = "/login";
      });
    }
  };

  return (
    <>
      <div className="update-pass">
        <div className="reset min-h-screen overflow-auto bg-black flex flex-col items-center text-center">
          <h2 className="text-white text-2xl font-bold mt-20 max-md:text-xl">
            Masukkan Pass Anda yang baru
          </h2>
          <div className="pass relative mt-4">
            {/* Eye Icon Inside Input */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

          <button
            onClick={handleUpdatePassword}
            className="text-black w-62 font-bold  py-3 bg-[#FFF313] rounded-full shadow-lg transition duration-300 ease-in-out transfor hover:bg-[#E1AD01] cursor-pointer mt-14"
          >
            KONFIRMASI
          </button>
        </div>
      </div>
    </>
  );
}
