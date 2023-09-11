import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,css,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'slide-over': {
          from: { opacity: '0.7', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-to-o30': {
          from: { opacity: '0' },
          to: { opacity: '0.3' },
        },
      },
      animation: {
        'slide-over': 'slide-over 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-to-o30': 'fade-in-to-o30 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
