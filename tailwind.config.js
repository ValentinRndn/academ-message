/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./frontend/src/**/*.{vue,js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        'bluee': '#db8ced',
        'purplee': 'rgba(217,167,228,1)',
        'darkgray': '#222222',
        'lightgray': '#393939',
        'backgray': '#171717',
        'purewhite': '#424242',

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
