/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        surface: {
          0:  '#0f0e0c',
          1:  '#1a1916',
          2:  '#242320',
          3:  '#2e2d29',
          4:  '#3a3935',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #f59e0b, #b45309)',
        'surface-gradient': 'linear-gradient(145deg, #1a1712 0%, #0f0e0c 40%, #1c1510 100%)',
      },
      boxShadow: {
        brand: '0 0 24px rgba(245,158,11,0.25)',
        'brand-lg': '0 4px 20px rgba(245,158,11,0.4)',
      },
    },
  },
  plugins: [],
}
