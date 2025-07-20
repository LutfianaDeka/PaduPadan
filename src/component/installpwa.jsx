import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Deteksi apakah perangkat mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(outcome);
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: isMobile ? "50%" : "auto",
        right: isMobile ? "auto" : 20,
        transform: isMobile ? "translateX(-50%)" : "none",
        zIndex: 9999,
      }}
    >
      <button
        onClick={handleInstall}
        style={{
          background: "#10b981",
          color: "white",
          padding: "12px 20px",
          borderRadius: "9999px",
          display: "inline-flex",
          alignItems: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          fontWeight: "600",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          gap: "8px",
        }}
      >
        <Download size={18} />
        Install App
      </button>
    </div>
  );
}
