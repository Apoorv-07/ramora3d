/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'SF Pro Display', 'sans-serif'] },
      colors: {
        gold: '#C9A84C',
        'gold-muted': '#8B6914',
      },
    },
  },
  plugins: [],
}
