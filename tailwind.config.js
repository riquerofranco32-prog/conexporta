/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a1628",
          800: "#0f2044",
          700: "#1a3a6b",
        },
        gold: {
          400: "#f5c842",
          500: "#d4a017",
        },
      },
    },
  },
  plugins: [],
};
