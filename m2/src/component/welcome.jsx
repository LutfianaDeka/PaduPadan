import { useNavigate } from "react-router-dom";
export default function WelcomPage() {
  const navigate = useNavigate();

  const loginHandle = () => {
    navigate("/login");
    setTimeout(() => {
      const el = document.getElementById("login");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const registerHandle = () => {
    navigate("/registrasi");
    setTimeout(() => {
      const el = document.getElementById("registrasi");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  return (
    <>
      <div className="welcome bg-black h-screen flex flex-col justify-between items-center text-center">
        <div className="wel-text mt-40">
          <h1
            className="text-[#FFF313] text-3xl"
            style={{ fontFamily: "Redressed" }}
          >
            Welcome to M2Outfit
          </h1>
          <h2 className="text-white pt-2">Wear Your Style. Share Your Look.</h2>
        </div>
        <div className="btn grid gap-6 mb-26">
          <button
            onClick={loginHandle}
            className="text-black w-62 font-bold py-3 bg-[#FFF313] rounded-full shadow-lg transition duration-300 ease-in-out transfor hover:bg-[#E1AD01] cursor-pointer"
          >
            LOGIN
          </button>
          <button
            onClick={registerHandle}
            className="text-[#FFF313] w-62 font-bold px-20 py-3 bg-[#198499]/20 rounded-full shadow-lg border border-[#FFF313] transition duration-300 ease-in-out transform hover:bg-[#E1AD01] hover:text-black  cursor-pointer"
          >
            REGISTER
          </button>
        </div>
      </div>
    </>
  );
}
