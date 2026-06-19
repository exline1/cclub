import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#0a0e1a",
          secondary: "#0f1729",
          glass: "rgba(15, 23, 41, 0.6)",
        },
        accent: {
          primary: "#4f46e5",
          glow: "#6366f1",
          deep: "#312e81",
        },
        status: {
          free: "#10b981",
          occupied: "#ef4444",
          ending: "#f59e0b",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
        },
        border: {
          glass: "rgba(99, 102, 241, 0.2)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "accent-glow": "0 0 20px rgba(99, 102, 241, 0.35)",
        "accent-glow-sm": "0 0 12px rgba(99, 102, 241, 0.25)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0a0e1a 0%, #0f1729 40%, #312e81 100%)",
        "card-gradient":
          "linear-gradient(180deg, rgba(15, 23, 41, 0.8) 0%, rgba(10, 14, 26, 0.95) 100%)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
