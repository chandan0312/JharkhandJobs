/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Jharkhand JobAlert X brand palette ──────────────────────────────
        // Gradient 04: #FFFB08 → #AED0C9 → #1B6F81 → #09324A
        brand: {
          50: '#e6f7fb',
          100: '#b3e7f3',
          200: '#7dd4e9',
          300: '#47c1de',
          400: '#29b3d4',
          500: '#1B6F81', // primary mid-blue teal
          600: '#155d6c',
          700: '#0f4a57',
          800: '#09324A', // dark navy
          900: '#061e2d',
          950: '#030f18',
        },
        // Jharkhand golden accent (from gradient #FFFB08)
        gold: {
          50: '#fffff0',
          100: '#fefec0',
          200: '#fefe80',
          300: '#fffd40',
          400: '#FFFB08', // primary gold
          500: '#e6e207',
          600: '#ccca06',
          700: '#b3b205',
          800: '#999904',
          900: '#807f03',
        },
        // Light teal (from gradient #AED0C9)
        teal: {
          50: '#f0f8f6',
          100: '#d5ece8',
          200: '#AED0C9', // light teal
          300: '#88b5ad',
          400: '#63998f',
          500: '#4a8078',
          600: '#3b6760',
          700: '#2d4e48',
          800: '#1e3530',
          900: '#0f1b18',
        },
        // Navy dark (from gradient #09324A)
        navy: {
          950: '#030f18',
          900: '#061e2d',
          800: '#09324A', // darkest
          700: '#0d4060',
          600: '#10506e',
          500: '#1B6F81', // matches brand.500
        },
        // Semantic tokens — driven by CSS variables so they respond to the
        // .dark class on <html>. See index.css for the light/dark values.
        page: 'var(--bg-page)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        subtle: 'var(--bg-subtle)',
        hairline: 'var(--border-hairline)',
        ink: {
          DEFAULT: 'var(--text-strong)',
          soft: 'var(--text-soft)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
      },
      spacing: {
        18: '4.5rem',   /* 72px — collapsed sidebar */
        65: '16.25rem', /* 260px — expanded sidebar */
      },
      boxShadow: {
        card: '0 1px 2px rgba(9, 50, 74, 0.04), 0 1px 3px rgba(9, 50, 74, 0.06)',
        cardhover: '0 10px 30px rgba(27, 111, 129, 0.15)',
        rail: '0 1px 2px rgba(9, 50, 74, 0.03), 0 1px 8px rgba(9, 50, 74, 0.05)',
        'sidebar-glow': '0 0 20px rgba(27, 111, 129, 0.25)',
        'gold-glow': '0 0 20px rgba(255, 251, 8, 0.3)',
        'teal-glow': '0 0 20px rgba(174, 208, 201, 0.3)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'ticker-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'ping-once': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '80%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'spin-slow': 'spin-slow 26s linear infinite',
        'slide-in': 'slide-in 0.3s ease-out both',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'ticker-scroll': 'ticker-scroll 30s linear infinite',
        'ping-once': 'ping-once 0.45s ease-out forwards',
      },
      backgroundImage: {
        'jharkhand-gradient': 'linear-gradient(135deg, #FFFB08 0%, #AED0C9 35%, #1B6F81 70%, #09324A 100%)',
        'jharkhand-gradient-dark': 'linear-gradient(160deg, #09324A 0%, #1B6F81 50%, #AED0C9 100%)',
        'brand-gradient': 'linear-gradient(135deg, #1B6F81 0%, #09324A 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,251,8,0.4) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
