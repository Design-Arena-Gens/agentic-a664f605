import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecf0ff",
          100: "#cfd7ff",
          200: "#a3b1ff",
          300: "#768bff",
          400: "#4a65ff",
          500: "#1e3fff",
          600: "#0d2fe6",
          700: "#0a24b3",
          800: "#071a80",
          900: "#040f4d"
        }
      },
      boxShadow: {
        glass: "0 10px 40px rgba(15, 30, 60, 0.2)"
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: []
};

export default config;
