/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2185d0',
        secondary: '#6435c9',
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}
