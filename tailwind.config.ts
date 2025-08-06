import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["data-[state=open]:rotate-180", "data-[state=checked]:font-semibold"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: {
          primary: "#FFFFFF",
          secondary: "#DEE0E3",
          tertiary: "#F2F2F5",
          accent1: "#7A73F1",
          accent2: "#AFABEE",
          accent3: "#DEDcFD",
          bk: "#000000",
        },
        text: {
          primary: "#121417",
          secondary: "#697582",
          tertiary: "#868E96",
          disabled: "#ADB5BD",
          inverse: "#FFFFFF",
          accent1: "#7A73F1",
        },
        border: {
          secondary: "#DEE0E3",
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};
export default config;
