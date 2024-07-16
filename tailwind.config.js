/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        login__lg: "3fr 2fr",
      },
      boxShadow: {
        "3xl": "0px 0px 16px -2px rgba(0,0,0,0.20)",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
