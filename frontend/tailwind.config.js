/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        black: '#0A0A0A',
        'dark-gray': '#121212',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'SF Pro', 'Cairo', 'sans-serif'],
        arabic: ['Cairo', 'Droid Arabic Kufi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}