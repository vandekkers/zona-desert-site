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
          "off-white": "#F1F2EF"
        }
      }
    }
  },
  plugins: []
};

export default config;
