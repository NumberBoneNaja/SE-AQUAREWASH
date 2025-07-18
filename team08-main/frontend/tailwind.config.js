/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {

      boxShadow: {
        'base-shadow': '0px 2px 20px -11px #9AAACF',
        'base-shadow-10': '0px 2px 20px -2px rgba(154, 170, 207, 0.25)',
      },
      colors: {
        'base-red': '#F73859',
        'base-black': '#24292E',
        'base-black-10':'#484C51',
        'base-bg':'#FBFBFB',
        'blue-bg':'#00BBF0',
        'blue-bg-10':'#A5DEF2',
        'base-green':'#80ED99',
        'base-puple':'#7540EE',
        'base-blue-20':'#F0FCFF',
        'base-green-10':'#DDFFE5',
      },

    },
  },
  plugins: [],
}