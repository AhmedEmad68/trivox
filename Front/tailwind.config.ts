import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ─── TRIVOX BRAND COLORS ───────────────────────────────────────
      colors: {
        // Core palette
        deep: {
          DEFAULT: "#1A1208",
          50:  "#F5F0E8",
          100: "#E8DCC8",
          200: "#D4C09E",
          300: "#B89B72",
          400: "#8B6B42",
          500: "#5C4020",
          600: "#3D2A12",
          700: "#2A1C0A",
          800: "#1A1208",
          900: "#0D0904",
        },
        gold: {
          DEFAULT: "#C8913A",
          50:  "#FDF6EC",
          100: "#FAE9CC",
          200: "#F5D099",
          300: "#EDB860",
          400: "#E0A040",
          500: "#C8913A",
          600: "#A67428",
          700: "#7D541A",
          800: "#54380F",
          900: "#2A1C07",
        },
        rust: {
          DEFAULT: "#B54A2C",
          50:  "#FBF0EC",
          100: "#F5D5C8",
          200: "#ECAC98",
          300: "#E07E60",
          400: "#CC6040",
          500: "#B54A2C",
          600: "#923A22",
          700: "#6E2C18",
          800: "#4A1E0F",
          900: "#250F07",
        },
        sand: {
          DEFAULT: "#F5F0E8",
          50:  "#FDFCFA",
          100: "#FAF8F3",
          200: "#F5F0E8",
          300: "#EDE5D5",
          400: "#E2D8C2",
          500: "#D4C9AE",
          600: "#C0B095",
          700: "#A0917A",
          800: "#7A6E60",
          900: "#524840",
        },
        dusk: {
          DEFAULT: "#7A6E60",
          50:  "#F3F1EE",
          100: "#E4DFD8",
          200: "#CCC4BA",
          300: "#AFA69A",
          400: "#948A7D",
          500: "#7A6E60",
          600: "#625849",
          700: "#4A4236",
          800: "#332E28",
          900: "#1C1A16",
        },
        leaf: {
          DEFAULT: "#4A7C3F",
          50:  "#EDF5EB",
          100: "#D0E8CC",
          200: "#A8D4A0",
          300: "#7ABB70",
          400: "#5C9F50",
          500: "#4A7C3F",
          600: "#3A6331",
          700: "#2B4A24",
          800: "#1C3118",
          900: "#0E190C",
        },

        // Semantic aliases that map to brand
        primary: {
          DEFAULT: "#C8913A",
          foreground: "#FDFCFA",
        },
        secondary: {
          DEFAULT: "#F5F0E8",
          foreground: "#1A1208",
        },
        accent: {
          DEFAULT: "#B54A2C",
          foreground: "#FDFCFA",
        },
        muted: {
          DEFAULT: "#EDE5D5",
          foreground: "#7A6E60",
        },
        background: "#FDFCFA",
        foreground: "#1A1208",
        border: "#E2D8C2",
        input: "#E2D8C2",
        ring: "#C8913A",

        // Card
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1208",
        },

        // Popover
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1208",
        },

        // Destructive
        destructive: {
          DEFAULT: "#B54A2C",
          foreground: "#FDFCFA",
        },
      },

      // ─── TYPOGRAPHY ───────────────────────────────────────────────
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        xs:    ["0.75rem",  { lineHeight: "1.125rem" }],
        sm:    ["0.875rem", { lineHeight: "1.375rem" }],
        base:  ["1rem",     { lineHeight: "1.625rem" }],
        lg:    ["1.125rem", { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",  { lineHeight: "1.875rem" }],
        "2xl": ["1.5rem",   { lineHeight: "2rem",    letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
        "4xl": ["2.25rem",  { lineHeight: "2.625rem",letterSpacing: "-0.025em" }],
        "5xl": ["3rem",     { lineHeight: "3.375rem",letterSpacing: "-0.03em" }],
        "6xl": ["3.75rem",  { lineHeight: "4rem",    letterSpacing: "-0.035em" }],
        "7xl": ["4.5rem",   { lineHeight: "4.75rem", letterSpacing: "-0.04em" }],
      },

      // ─── SPACING SCALE ────────────────────────────────────────────
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
        "30":  "7.5rem",
        "34":  "8.5rem",
        "88":  "22rem",
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
      },

      // ─── BORDER RADIUS ────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // ─── BOX SHADOW ───────────────────────────────────────────────
      boxShadow: {
        "warm-sm": "0 1px 3px 0 rgba(26,18,8,0.08), 0 1px 2px -1px rgba(26,18,8,0.06)",
        "warm":    "0 4px 16px -2px rgba(26,18,8,0.10), 0 2px 6px -2px rgba(26,18,8,0.06)",
        "warm-md": "0 8px 24px -4px rgba(26,18,8,0.12), 0 4px 10px -3px rgba(26,18,8,0.07)",
        "warm-lg": "0 16px 48px -8px rgba(26,18,8,0.16), 0 8px 20px -5px rgba(26,18,8,0.08)",
        "warm-xl": "0 32px 80px -12px rgba(26,18,8,0.22), 0 16px 32px -8px rgba(26,18,8,0.10)",
        "gold":    "0 4px 24px -4px rgba(200,145,58,0.35)",
        "gold-lg": "0 8px 40px -8px rgba(200,145,58,0.45)",
        "card":    "0 0 0 1px rgba(26,18,8,0.06), 0 4px 16px -2px rgba(26,18,8,0.08)",
        "card-hover": "0 0 0 1px rgba(200,145,58,0.20), 0 8px 32px -4px rgba(26,18,8,0.14)",
      },

      // ─── ANIMATIONS ───────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%":   { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-468px 0" },
          "100%": { backgroundPosition: "468px 0" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(200,145,58,0.4)" },
          "50%":       { boxShadow: "0 0 0 8px rgba(200,145,58,0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-in":       "fade-in 0.4s ease-out",
        "fade-up":       "fade-up 0.5s ease-out",
        "fade-down":     "fade-down 0.4s ease-out",
        "slide-in-right":"slide-in-right 0.4s ease-out",
        "scale-in":      "scale-in 0.3s ease-out",
        "shimmer":       "shimmer 1.5s infinite linear",
        "pulse-gold":    "pulse-gold 2s ease-in-out infinite",
        "float":         "float 3s ease-in-out infinite",
      },

      // ─── BACKGROUND PATTERNS ──────────────────────────────────────
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        "warm-gradient": "linear-gradient(135deg, #FDFCFA 0%, #F5F0E8 50%, #EDE5D5 100%)",
        "hero-gradient": "linear-gradient(to bottom, rgba(26,18,8,0) 0%, rgba(26,18,8,0.4) 60%, rgba(26,18,8,0.85) 100%)",
        "card-gradient": "linear-gradient(to bottom, transparent 40%, rgba(26,18,8,0.75) 100%)",
        "gold-gradient": "linear-gradient(135deg, #E0A040 0%, #C8913A 50%, #A67428 100%)",
        "shimmer-gradient": "linear-gradient(90deg, #EDE5D5 25%, #F5F0E8 50%, #EDE5D5 75%)",
      },

      // ─── TRANSITIONS ─────────────────────────────────────────────
      transitionTimingFunction: {
        "spring":     "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "smooth":     "cubic-bezier(0.4, 0, 0.2, 1)",
        "ease-in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "ease-out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },

      // ─── SCREENS ──────────────────────────────────────────────────
      screens: {
        "xs": "480px",
        "3xl": "1800px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
