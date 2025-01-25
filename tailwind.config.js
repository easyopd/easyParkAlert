/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0E9577",
        "primary-800": "#016B54",
        secondary: "#F2F2F2",
      },
    },
  },
  plugins: [],
};
