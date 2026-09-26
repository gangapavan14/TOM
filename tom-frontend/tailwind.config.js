/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        surface: {
          0:  '#09090b',
          1:  '#121215',
          2:  '#18181b',
          3:  '#27272a',
          4:  '#3f3f46',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Inter', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #ffffff 0%, #e4e4e7 100%)',
        'surface-gradient': 'linear-gradient(145deg, #18181b 0%, #09090b 100%)',
      },
      boxShadow: {
        brand: '0 0 20px rgba(255,255,255,0.15)',
        'brand-lg': '0 4px 20px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}

