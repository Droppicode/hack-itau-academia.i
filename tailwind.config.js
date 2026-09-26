/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        itau: {
          orange: "#EC7000",
          navy: "#1F2A63",
          blue: "#003087",
          pending: "#1A3EBF",
          bg: "#F0F1F3",
          chip: "#F0F1F3",
          text: "#1A1A1A",
          muted: "#6B6B6B",
          body: "#4A4A4A",
          line: "#E5E5E5",
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
