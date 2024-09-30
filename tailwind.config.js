/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#433878',
        'secondary': '#7E60BF',
        'accent': '#E4B1F0',
        'background': '#FFE1FF',
      },
    },
  },
  plugins: [],
}