/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0071E3',
          sky: '#0284C7',
          cyan: '#0891B2',
          gold: '#D97706',
          amber: '#D97706',
          emerald: '#059669',
          rose: '#E11D48',
          slate: '#475569',
        },
        glass: {
          border: 'rgba(0, 0, 0, 0.08)',
          'border-light': 'rgba(0, 0, 0, 0.04)',
          'border-active': 'rgba(37, 99, 235, 0.4)',
          surface: 'rgba(255, 255, 255, 0.85)',
          'surface-hover': 'rgba(255, 255, 255, 0.95)',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glass-sm': '0 2px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'glass-md': '0 6px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'glass-lg': '0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
        'glow-blue': '0 0 25px -5px rgba(2, 132, 199, 0.25)',
        'glow-gold': '0 0 25px -5px rgba(217, 119, 6, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(5, 150, 105, 0.2)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        thick: '24px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
