/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lucky-point': {
          '50': 'hsl(225, 100%, 98%)',
          '100': 'hsl(226, 91%, 95%)',
          '200': 'hsl(225, 95%, 92%)',
          '300': 'hsl(228, 95%, 85%)',
          '400': 'hsl(230, 92%, 76%)',
          '500': 'hsl(233, 91%, 66%)',
          '600': 'hsl(237, 84%, 58%)',
          '700': 'hsl(238, 71%, 50%)',
          '800': 'hsl(238, 70%, 42%)',
          '900': 'hsl(239, 67%, 35%)',
          '950': 'hsl(236, 73%, 25%)',
        },
      }
    },
  },
  plugins: [],
}

