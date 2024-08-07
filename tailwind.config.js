/** @type {import('tailwindcss').Config} */
const { default: daisyui } = require('daisyui');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  daisyui: {
    themes: [
      "dracula","lemonade"
    ],
  },
  plugins: [
    require('daisyui'),
    require('tailwindcss')
  ],
}


