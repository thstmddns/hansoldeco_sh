/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

const number0_100 = { ...Array.from(Array(101)).map((_, i) => `${i}`) };

const px0_10 = { ...Array.from(Array(11)).map((_, i) => `${i}px`) };
const px0_100 = { ...Array.from(Array(101)).map((_, i) => `${i}px`) };
const px0_200 = { ...Array.from(Array(201)).map((_, i) => `${i}px`) };
const px0_500 = { ...Array.from(Array(501)).map((_, i) => `${i}px`) };
const px0_1000 = { ...Array.from(Array(1001)).map((_, i) => `${i}px`) };
const px0_2000 = { ...Array.from(Array(2001)).map((_, i) => `${i}px`) };


module.exports = {
  darkMode: 'class',
  greenMode: 'class',
  content: ["./index.html", "./pages/**/*.{vue,js,ts,jsx,tsx}", "./views/**/*.{vue,js,ts,jsx,tsx}", "./components/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      pre: ['Pretendard'],
      ibm: ['IBM-Plex-Sans-KR'],
    },
    extend: {
      borderWidth: px0_10,
      fontSize: px0_100,
      lineHeight: px0_100,
      minWidth: px0_2000,
      minHeight: px0_2000,
      maxWidth: px0_2000,
      maxHeight: px0_2000,
      width: px0_2000,
      height: px0_2000,
      margin: px0_500,
      marginBottom: px0_500,
      marginTop: px0_500,
      marginLeft: px0_500,
      padding: px0_500,
      paddingBottom: px0_500,
      paddingTop: px0_500,
      paddingLeft: px0_500,
      paddingRight: px0_500,
      spacing: px0_200,
      gap: px0_500,
      zIndex: number0_100,
      colors: {
				dark: {
					900: "#111",
					800: "#181818",
					700: "#303030",
					600: "#8b8b8b",
					500: "#6e6e6e",
					400: "#898989",
					300: "#606060",
				},
				pink: "#de8edf",
				brown: "#261e1e",
			},
    },
  },
  plugins: [
    require("daisyui"),
    plugin(function({addVariant}) {
      // here is your CSS selector - could be anything
      addVariant('theme-white', '.theme-white &')
      addVariant('theme-dark', '.theme-dark &')
    })
  ],
}