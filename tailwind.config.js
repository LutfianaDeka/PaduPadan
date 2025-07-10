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
    "h-16"
  ],
  theme: {
    extend: {
      animation: {
        spinSlow: "spin 5s linear infinite",
        spinSlower: "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
};
