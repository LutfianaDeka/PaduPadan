import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const ONE_HOUR = 1 * 60 * 60 * 1000;

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      const dismissedAt = localStorage.getItem("pwaDismissedAt");
      const now = Date.now();

      if (dismissedAt && now - parseInt(dismissedAt) < ONE_HOUR) return;

      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
      setTimeout(() => setFadeIn(true), 100); // delay agar animasi berjalan
    };

    window.addEventListener("beforeinstallprompt", handler);

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

    if (outcome === "dismissed") {
      localStorage.setItem("pwaDismissedAt", Date.now().toString());
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleClose = () => {
    localStorage.setItem("pwaDismissedAt", Date.now().toString());
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
        opacity: fadeIn ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
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
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            border: "none",
            borderRadius: "9999px",
            width: "24px",
            height: "24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Jangan tampilkan lagi"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
