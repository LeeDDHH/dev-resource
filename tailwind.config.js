/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rod: {
          stone: {
            800: '#404040',
          },
          gray: {
            800: '#2b2b2b',
            500: '#7c7c7c',
          },
          black: {
            100: '#1a1a1a',
          },
          green: {
            500: '#00fcb1',
          },
          blue: {
            100: '#b4c6ff',
            600: '#2600bd',
          },
          yellow: {
            300: '#fddea5',
            400: '#fff1cf',
          },
          red: {
            500: '#ed6d3d',
          },
          ivory: '#fffff0',
        },
      },
    },
  },
  plugins: [],
};
