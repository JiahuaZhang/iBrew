/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        gradient: {
          '0%': { backgroundPosition: '0% 50%', },
          '50%': { backgroundPosition: '100% 50%', },
          '100%': { backgroundPosition: '0% 50%', }
        },
      },
      animation: {
        'flow': 'gradient 4s ease infinite',
      },
    },
  },
  plugins: [],
}
