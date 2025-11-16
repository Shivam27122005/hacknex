import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
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
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        mood: {
          excited: {
            50: '#fff1f0',
            100: '#ffe4e1',
            200: '#ffcdc7',
            300: '#ffaba1',
            400: '#ff6b6b',
            500: '#ff4444',
            600: '#e63946',
            700: '#d62828',
            800: '#ba181b',
            900: '#a4161a',
          },
          focused: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
          creative: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
          },
          tired: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
          frustrated: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          productive: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'excited-pulse': 'excitedPulse 2s ease-in-out infinite',
        'focused-steady': 'focusedSteady 4s ease-in-out infinite',
        'creative-flow': 'creativeFlow 3s ease-in-out infinite',
        'tired-slow': 'tiredSlow 6s ease-in-out infinite',
        'frustrated-tense': 'frustratedTense 1.5s ease-in-out infinite',
        'productive-efficient': 'productiveEfficient 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        excitedPulse: {
          '0%, 100%': { 
            filter: 'brightness(1.05) saturate(1.4) hue-rotate(10deg)',
            boxShadow: '0 0 20px rgba(255, 107, 107, 0.1)'
          },
          '50%': { 
            filter: 'brightness(1.15) saturate(1.5) hue-rotate(15deg)',
            boxShadow: '0 0 30px rgba(255, 107, 107, 0.2)'
          },
        },
        focusedSteady: {
          '0%, 100%': { 
            filter: 'brightness(1.02) saturate(1.1) hue-rotate(0deg)'
          },
          '50%': { 
            filter: 'brightness(1.05) saturate(1.15) hue-rotate(2deg)'
          },
        },
        creativeFlow: {
          '0%': { 
            filter: 'brightness(1.05) saturate(1.3) hue-rotate(15deg)'
          },
          '33%': { 
            filter: 'brightness(1.08) saturate(1.35) hue-rotate(20deg)'
          },
          '66%': { 
            filter: 'brightness(1.03) saturate(1.25) hue-rotate(10deg)'
          },
          '100%': { 
            filter: 'brightness(1.05) saturate(1.3) hue-rotate(15deg)'
          },
        },
        tiredSlow: {
          '0%, 100%': { 
            filter: 'brightness(0.9) saturate(0.7) hue-rotate(-5deg)'
          },
          '50%': { 
            filter: 'brightness(0.92) saturate(0.75) hue-rotate(-3deg)'
          },
        },
        frustratedTense: {
          '0%, 100%': { 
            filter: 'brightness(0.95) saturate(1.2) hue-rotate(-10deg)'
          },
          '25%': { 
            filter: 'brightness(0.98) saturate(1.25) hue-rotate(-8deg)'
          },
          '75%': { 
            filter: 'brightness(0.92) saturate(1.15) hue-rotate(-12deg)'
          },
        },
        productiveEfficient: {
          '0%, 100%': { 
            filter: 'brightness(1.05) saturate(1.2) hue-rotate(5deg)'
          },
          '50%': { 
            filter: 'brightness(1.08) saturate(1.25) hue-rotate(8deg)'
          },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const moodUtilities = {
        // Excited mood utilities
        '.mood-excited-bg': {
          background: `linear-gradient(to bottom right, ${theme('colors.mood.excited.50')}, ${theme('colors.mood.excited.100')})`,
        },
        '.mood-excited-btn': {
          borderColor: theme('colors.mood.excited.400'),
          '&:hover': {
            backgroundColor: theme('colors.mood.excited.50'),
            borderColor: theme('colors.mood.excited.500'),
          }
        },
        '.mood-excited-input': {
          borderColor: theme('colors.mood.excited.300'),
          '&:focus': {
            borderColor: theme('colors.mood.excited.500'),
            boxShadow: `0 0 0 3px ${theme('colors.mood.excited.200')}`,
          }
        },
        
        // Focused mood utilities
        '.mood-focused-bg': {
          background: `linear-gradient(to bottom right, ${theme('colors.mood.focused.50')}, ${theme('colors.mood.focused.100')})`,
        },
        '.mood-focused-btn': {
          borderColor: theme('colors.mood.focused.400'),
          '&:hover': {
            backgroundColor: theme('colors.mood.focused.50'),
            borderColor: theme('colors.mood.focused.500'),
          }
        },
        '.mood-focused-input': {
          borderColor: theme('colors.mood.focused.300'),
          '&:focus': {
            borderColor: theme('colors.mood.focused.500'),
            boxShadow: `0 0 0 3px ${theme('colors.mood.focused.200')}`,
          }
        },
        
        // Creative mood utilities
        '.mood-creative-bg': {
          background: `linear-gradient(to bottom right, ${theme('colors.mood.creative.50')}, ${theme('colors.mood.creative.100')})`,
        },
        '.mood-creative-btn': {
          borderColor: theme('colors.mood.creative.400'),
          '&:hover': {
            backgroundColor: theme('colors.mood.creative.50'),
            borderColor: theme('colors.mood.creative.500'),
          }
        },
        '.mood-creative-input': {
          borderColor: theme('colors.mood.creative.300'),
          '&:focus': {
            borderColor: theme('colors.mood.creative.500'),
            boxShadow: `0 0 0 3px ${theme('colors.mood.creative.200')}`,
          }
        },
        
        // Tired mood utilities
        '.mood-tired-bg': {
          background: `linear-gradient(to bottom right, ${theme('colors.mood.tired.50')}, ${theme('colors.mood.tired.100')})`,
        },
        '.mood-tired-btn': {
          borderColor: theme('colors.mood.tired.400'),
          '&:hover': {
            backgroundColor: theme('colors.mood.tired.50'),
            borderColor: theme('colors.mood.tired.500'),
          }
        },
        '.mood-tired-input': {
          borderColor: theme('colors.mood.tired.300'),
          '&:focus': {
            borderColor: theme('colors.mood.tired.500'),
            boxShadow: `0 0 0 3px ${theme('colors.mood.tired.200')}`,
          }
        },
        
        // Frustrated mood utilities
        '.mood-frustrated-bg': {
          background: `linear-gradient(to bottom right, ${theme('colors.mood.frustrated.50')}, ${theme('colors.mood.frustrated.100')})`,
        },
        '.mood-frustrated-btn': {
          borderColor: theme('colors.mood.frustrated.400'),
          '&:hover': {
            backgroundColor: theme('colors.mood.frustrated.50'),
            borderColor: theme('colors.mood.frustrated.500'),
          }
        },
        '.mood-frustrated-input': {
          borderColor: theme('colors.mood.frustrated.300'),
          '&:focus': {
            borderColor: theme('colors.mood.frustrated.500'),
            boxShadow: `0 0 0 3px ${theme('colors.mood.frustrated.200')}`,
          }
        },
        
        // Productive mood utilities
        '.mood-productive-bg': {
          background: `linear-gradient(to bottom right, ${theme('colors.mood.productive.50')}, ${theme('colors.mood.productive.100')})`,
        },
        '.mood-productive-btn': {
          borderColor: theme('colors.mood.productive.400'),
          '&:hover': {
            backgroundColor: theme('colors.mood.productive.50'),
            borderColor: theme('colors.mood.productive.500'),
          }
        },
        '.mood-productive-input': {
          borderColor: theme('colors.mood.productive.300'),
          '&:focus': {
            borderColor: theme('colors.mood.productive.500'),
            boxShadow: `0 0 0 3px ${theme('colors.mood.productive.200')}`,
          }
        },
      }
      
      addUtilities(moodUtilities)
    }
  ],
}
