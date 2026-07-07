import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        zona: {
          "purple-deep": "#4A1988",
          "purple-mid": "#7025B6",
          purple: "#7025B6",
          orange: "#FE642D",
          amber: "#FEA91E",
          navy: "#0E172A",
          "off-white": "#F1F2EF",
          // v2 marketing surfaces — "Arizona warm" per the design handoff
          sand: "#FBF7F1",
          "sand-deep": "#F4ECDD"
        }
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        // Design-system elevation tokens (purple-tinted, per handoff)
        card: "0 2px 8px rgba(74, 25, 136, 0.08)",
        kpi: "0 4px 16px rgba(15, 23, 42, 0.06)",
        btn: "0 4px 14px rgba(74, 25, 136, 0.25)",
        "btn-hover": "0 6px 18px rgba(74, 25, 136, 0.35)",
        lift: "0 16px 36px rgba(74, 25, 136, 0.12)",
        "card-float": "0 30px 60px -25px rgba(74, 25, 136, 0.25)",
        "hero-photo":
          "0 30px 60px -20px rgba(74, 25, 136, 0.35), 0 10px 30px -10px rgba(254, 100, 45, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
