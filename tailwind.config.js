/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1B4332',
        accent: '#52B788',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        surface: '#FFFFFF',
        background: '#F0F4F0',
        'text-main': '#1A1A1A',
      },
    },
  },
  plugins: [],
}
