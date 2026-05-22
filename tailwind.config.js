/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg:       '#08080f',
        surface:  { DEFAULT: '#0f0f1a', 2: '#141423', 3: '#1a1a2e' },
        border:   { DEFAULT: '#1e1e35', 2: '#272744' },
        accent:   { DEFAULT: '#6366f1', light: '#818cf8', glow: 'rgba(99,102,241,0.18)' },
        success:  '#10b981',
        warning:  '#f59e0b',
        danger:   '#ef4444',
        purple:   '#a855f7',
        text:     { DEFAULT: '#e8e8f5', 2: '#9898bb', 3: '#55556e' },
        primary: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe',
          300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81',
        },
      },
      boxShadow: {
        soft:  '0 1px 3px rgba(0,0,0,0.4)',
        md:    '0 4px 16px rgba(0,0,0,0.45)',
        lg:    '0 12px 40px rgba(0,0,0,0.6)',
        glow:  '0 0 24px rgba(99,102,241,0.22)',
        'accent-sm': '0 4px 14px rgba(99,102,241,0.4)',
      },
      borderRadius: { '2xl': '16px', '3xl': '20px' },
      animation: {
        'fade-up':    'fadeUp .3s ease forwards',
        'fade-in':    'fadeIn .25s ease forwards',
        'scale-in':   'scaleIn .2s ease forwards',
        'spin-slow':  'spin 1.4s linear infinite',
        blob:         'blobFloat 8s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'none' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
        blobFloat: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(20px,-30px) scale(1.08)' },
          '66%': { transform: 'translate(-15px,20px) scale(.94)' },
        },
      },
    },
  },
  plugins: [],
};
