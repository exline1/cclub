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
          primary: "#0A0E1A",
          secondary: "#12172A",
          tertiary: "#161C33",
          glass: "rgba(18, 23, 42, 0.6)",
        },
        accent: {
          primary: "#6366F1", // indigo
          secondary: "#818CF8", // indigo-400
          deep: "#3730a3",
          glow: "#6366f1",
        },
        status: {
          free: "#34D399",
          occupied: "#ef4444",
          ending: "#f59e0b",
          online: "#34D399",
        },
        text: {
          primary: "#E2E4F3",
          secondary: "#7C839E",
        },
        border: {
          primary: "#232A45",
          glass: "rgba(99, 102, 241, 0.2)",
        },
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.03)',
        'glass-hover': 'rgba(255, 255, 255, 0.06)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-sora)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "accent-glow": "0 0 40px rgba(99, 102, 241, 0.15)",
        "accent-glow-sm": "0 0 20px rgba(99, 102, 241, 0.2)",
        "card-hover": "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glow': '0 0 60px rgba(99,102,241,0.15)',
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, rgba(10, 14, 26, 1) 50%)",
        "cta-gradient": "linear-gradient(135deg, #0A0E1A 0%, rgba(99, 102, 241, 0.15) 100%)",
        "card-gradient": "linear-gradient(180deg, #12172A 0%, #0A0E1A 100%)",
        'stripe-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.3) 0%, transparent 100%)',
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
