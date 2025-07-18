// tailwind.config.js
import scrollbar from "tailwind-scrollbar";
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    "opacity-0",
    "opacity-100",
    "transition-opacity",
    "duration-500",
    "animate-ping",
    "border-yellow-400",
    "rounded-full",
    "w-16",
    "h-16",
  ],
  theme: {
    colors: {
      white: "#ffffff",
      black: "#000000",
      green: {
        500: "#2E8B57",
        600: "#276b48",
      },
      gray: {
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
      },
    },
    extend: {
      animation: {
        spinSlow: "spin 5s linear infinite",
        spinSlower: "spin 3s linear infinite",
        pop: "pop 0.8s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.2)", opacity: "0" },
          "30%": { transform: "scale(1.2)", opacity: "1" },
          "60%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [scrollbar],

  future: {
    hoverOnlyWhenSupported: true,
  },
};
