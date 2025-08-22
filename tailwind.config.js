/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgba(229,87,46,0.08)',
          600: '#E5572E',
          700: '#C94B27',
        },
      },
    },
  },
  plugins: [],
};
