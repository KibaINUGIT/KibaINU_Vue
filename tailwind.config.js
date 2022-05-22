const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        "bangers": ["Bangers", "sans-serif"]
      },
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      kiba: {
        lightgray: "#393654",
        lightblack: "#252632"
      }
    }),
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      blue: colors.blue,
      kiba: {
        lightgray: "#393654",
        lightblack: "#252632"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
