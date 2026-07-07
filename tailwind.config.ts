import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: "#1a4fa0",
          dark: "#0d2d6b",
          light: "#2d6fd4",
        },
        gold: {
          DEFAULT: "#d4af37",
          light: "#f0cc5a",
          dark: "#a88520",
        },
        ink: {
          DEFAULT: "#071222",
          alt: "#0c1a35",
          card: "#101f3d",
          elevated: "#152848",
        },
        content: {
          DEFAULT: "#f4f7fc",
          muted: "#8fa3c4",
        },
      },
      fontFamily: {
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-rajdhani)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "24px",
        xl: "32px",
      },
      maxWidth: {
        container: "1240px",
      },
      boxShadow: {
        sm: "0 4px 12px rgba(0, 0, 0, 0.25)",
        md: "0 12px 32px rgba(0, 0, 0, 0.35)",
        "glow-blue": "0 0 40px rgba(26, 79, 160, 0.45)",
        "glow-gold": "0 0 40px rgba(212, 175, 55, 0.35)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scroll-hint": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.4, 0, 0.2, 1) both",
        float: "float 6s ease-in-out infinite",
        "scroll-hint": "scroll-hint 1.8s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
