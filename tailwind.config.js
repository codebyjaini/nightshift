/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#0B1120',
          card: '#151B2E',
          'card-hover': '#1A2235',
          border: '#1E2A42',
          navy: '#0F1729',
        },
        accent: {
          cyan: '#00D9FF',
          'cyan-light': '#33E1FF',
          'cyan-dark': '#00B8D9',
          teal: '#00E5A5',
          'teal-light': '#33EEBB',
          purple: '#8B5CF6',
          'purple-light': '#A78BFA',
          blue: '#3B82F6',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#E2E8F0',
          muted: '#94A3B8',
          dim: '#64748B',
        },
        risk: {
          critical: '#EF4444',
          medium: '#F59E0B',
          low: '#10B981',
        },
        status: {
          treated: '#6366F1',
          untreated: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 217, 255, 0.15)',
        modal: '0 20px 40px rgba(0, 0, 0, 0.5)',
        glow: '0 0 30px rgba(0, 217, 255, 0.2)',
        'glow-purple': '0 0 40px rgba(139, 92, 246, 0.3)',
        'glow-teal': '0 0 30px rgba(0, 229, 165, 0.2)',
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #00D9FF 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'scale-in': 'scale-in 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
