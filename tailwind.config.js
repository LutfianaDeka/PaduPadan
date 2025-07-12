// tailwind.config.js
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
  plugins: [],
};
