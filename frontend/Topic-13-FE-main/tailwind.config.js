/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        Merriweather: ['Merriweather']
      },
      backgroundColor: {
        'main-1': '#EA580B',
        'main-2': '#DD813C'
      },
      colors: {
        'main-1': '#EA580B'
      },
      height: {
        'min-heigh-custom': 'calc(100vh - 116px)'
      },
      keyframes: {
        scrollLeftLoop: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scrollLeftLoop: 'scrollLeftLoop 10s linear infinite',
      },
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
