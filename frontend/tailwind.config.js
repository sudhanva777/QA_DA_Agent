/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#050507',
          deep: '#030305',
          elevated: '#0B0B10',
        },
        surface: {
          DEFAULT: '#0B0B10',
          muted: '#0F0F16',
          card: '#12121A',
          elevated: '#181824',
          highlight: '#202030',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(255, 255, 255, 0.16)',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // Primary Indigo Accent
          600: '#4F46E5', // Primary Hover
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          glow: 'rgba(99, 102, 241, 0.25)',
        },
        accent: {
          violet: '#8B5CF6',
          purple: '#A855F7',
          cyan: '#06B6D4',
          blue: '#3B82F6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        text: {
          primary: '#F5F5F7',
          secondary: '#A1A1AA',
          muted: '#71717A',
          dim: '#52525B',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          light: 'rgba(255, 255, 255, 0.12)',
          subtle: 'rgba(255, 255, 255, 0.04)',
          glow: 'rgba(99, 102, 241, 0.4)',
        },
        status: {
          success: '#10B981',
          'success-bg': 'rgba(16, 185, 129, 0.1)',
          'success-border': 'rgba(16, 185, 129, 0.25)',
          warning: '#F59E0B',
          'warning-bg': 'rgba(245, 158, 11, 0.1)',
          'warning-border': 'rgba(245, 158, 11, 0.25)',
          error: '#EF4444',
          'error-bg': 'rgba(239, 68, 68, 0.1)',
          'error-border': 'rgba(239, 68, 68, 0.25)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(99, 102, 241, 0.15)',
        'glow-md': '0 0 30px rgba(99, 102, 241, 0.22)',
        'glow-lg': '0 0 50px rgba(99, 102, 241, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'dark-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'dark-card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(99, 102, 241, 0.35), 0 0 20px rgba(99, 102, 241, 0.15)',
      },
      borderRadius: {
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}

