/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        'blue': '#1E8EFE',


        'blue1' : 'ADE1FB',
        'blue2' : '#266CA9',
        'blue3' : '#0F2573',
        'blue4' : '#041D56',
        'blue5' : '#01082D',
      },
      fontFamily: {
        'quicksand' : ['quicksand', 'sans-serif'],
    },
      fontSize: {
        '10xl': '19rem',
      },
      backgroundImage: {

        





      }, 
      boxShadow: {
        '3xl': '0 10px 60px -10px rgba(0, 0, 0, 0.6)',
      },
      screens: {
        'sm': {'max': '639px'}, // jusqu'à 640px
        'md': {'max': '767px'}, // jusqu'à 768px
        'lg': {'max': '1023px'}, // jusqu'à 1024px
        'xl': {'max': '1279px'}, // jusqu'à 1280px
        '2xl': {'max': '1535px'}, // jusqu'à 1536px
      }, 
      },
    },
  }
