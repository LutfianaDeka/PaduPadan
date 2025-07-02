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
        confirmButtonColor: "#FFF313",
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-pass",
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
        text: "Link reset password telah dikirim ke email kamu.",
        confirmButtonColor: "#FFF313",
      });
    }
  };
  return (
    <>
      <div className="reset min-h-screen overflow-auto bg-black flex flex-col items-center text-center">
        <h2 className="text-white text-2xl font-bold mt-20">
          Konfirmasi Email Anda
        </h2>
        <p className="text-white pt-4 text-sm">
          Masukkan email yang akan anda gunakan untuk mereset password
        </p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-[#FFF313] bg-[#198499]/20 border-1 border-[#FFF313] rounded-[10px] pl-4 w-62 py-3 mt-4"
        />
        <button
          onClick={handleReset}
          className="text-black w-62 font-bold  py-3 bg-[#FFF313] rounded-full shadow-lg transition duration-300 ease-in-out transfor hover:bg-[#E1AD01] cursor-pointer mt-10"
        >
          KONFIRMASI
        </button>
      </div>
    </>
  );
}
