import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        wk: {
          primary: "#0085FE",
          "primary-dark": "#165656",
          secondary: "#FBFF3A",
          "secondary-dark": "#DFE242",
          success: "#28A745",
          error: "#DC3545",
          warning: "#FBFF3A",
          info: "#DFE242",
        },
      },
      fontFamily: {
        Inconsolata: ["Inconsolata", "monospace"],
        SourceSansPro: ["Source Code Pro", "monospace"],
        Inter: ["Inter", "sans-serif"],
        Hind: ["Hind Siliguri", "sans-serif"],
      },
      screens: {
        "2xl": "1685px",
      },
      padding: {
        "100": "25rem",
        "104": "26rem",
        "108": "27rem",
        "112": "28rem",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "7%",
        xl: "8%",
        "2xl": "10%",
      },
    },
  },
  plugins: [],
};
export default config;
