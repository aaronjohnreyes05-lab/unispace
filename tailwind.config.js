/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#151c2c',
          900: '#0f172a',
          950: '#090d16',
        },
        indigo: {
          500: '#6366f1',
          600: '#4f46e5',
        },
        cyan: {
          450: '#00d8f6',
          500: '#06b6d4',
        }
      },
    },
  },
  plugins: [],
}