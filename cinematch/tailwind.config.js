/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          950: '#050308',
          900: '#0a0712',
          800: '#120d1f',
          700: '#1c1430',
        },
        brand: {
          purple: '#8b5cf6',
          magenta: '#c026d3',
          red: '#ef4444',
        },
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #ef4444 100%)',
      },
      // The matching @keyframes live in src/index.css
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
