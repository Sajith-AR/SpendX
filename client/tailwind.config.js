/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        finora: {
          bg: '#0A0F1E',
          sidebar: '#0F172A',
          card: '#111827',
          border: '#1E293B',
          primary: '#14F195',
          blue: '#3B82F6',
          purple: '#8B5CF6',
          success: '#22C55E',
          expense: '#EF4444',
          warning: '#F59E0B',
          textPrimary: '#F8FAFC',
          textSecondary: '#94A3B8',
        },
      },
      borderRadius: {
        '2xl': '1.25rem', // 20px
        '3xl': '1.5rem', // 24px
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
