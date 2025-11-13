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
          purple: "#6366F1",
          midnight: "#0F172A",
          sand: "#F5F0E1"
        }
      }
    }
  },
  plugins: []
};

export default config;
