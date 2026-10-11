/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'Segoe UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      colors: {
        // ── Design-token–driven semantic colors (respond to data-theme) ─────
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',

        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        hairline: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },

        text: {
          DEFAULT: 'var(--text)',
          2: 'var(--text-2)',
          muted: 'var(--text-muted)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          soft: 'var(--text-2)',
          muted: 'var(--text-2)',
          faint: 'var(--text-muted)',
        },

        subtle: 'var(--surface-2)',
        page: 'var(--bg)',

        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
          strong: 'var(--accent-strong)',
          on: 'var(--on-accent)',
        },

        'header-bg': 'var(--header-bg)',
        'hero-bg': 'var(--hero-bg)',
        overlay: 'var(--overlay)',

        // Status colors
        success: {
          DEFAULT: 'var(--success)',
          bg: 'var(--success-bg)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          bg: 'var(--warning-bg)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          bg: 'var(--danger-bg)',
        },
        info: {
          DEFAULT: 'var(--info)',
          bg: 'var(--info-bg)',
        },

        // ── Jharkhand JobAlert X brand palette ──────────────────────────────
        brand: {
          50:  '#e6f7fb',
          100: '#b3e7f3',
          200: '#7dd4e9',
          300: '#47c1de',
          400: '#29b3d4',
          500: '#1B6F81',
          600: '#155d6c',
          700: '#0f4a57',
          800: '#09324A',
          900: '#061e2d',
          950: '#030f18',
        },
        gold: {
          50:  '#fffff0',
          100: '#fefec0',
          200: '#fefe80',
          300: '#fffd40',
          400: '#FFFB08',
          500: '#e6e207',
          600: '#ccca06',
        },
        navy: {
          950: '#030f18',
          900: '#061e2d',
          800: '#09324A',
          700: '#0d4060',
          600: '#10506e',
          500: '#1B6F81',
        },

        // Data-viz palette
        viz: {
          1: 'var(--viz-1)',
          2: 'var(--viz-2)',
          3: 'var(--viz-3)',
          4: 'var(--viz-4)',
          5: 'var(--viz-5)',
          6: 'var(--viz-6)',
          7: 'var(--viz-7)',
          8: 'var(--viz-8)',
        },
      },

      spacing: {
        18: '4.5rem',   /* 72px */
        65: '16.25rem', /* 260px */
        80: '20rem',    /* 320px sidebar spec */
      },

      borderRadius: {
        badge: '6px',
        btn:   '8px',
        row:   '10px',
        card:  '12px',
        panel: '14px',
        dialog:'16px',
        pill:  '999px',
      },

      boxShadow: {
        sm:     'var(--shadow-sm)',
        md:     'var(--shadow-md)',
        lg:     'var(--shadow-lg)',
        focus:  'var(--focus-ring)',
        card:   '0 1px 2px rgba(9,50,74,0.04), 0 1px 3px rgba(9,50,74,0.06)',
        cardhover: '0 4px 12px rgba(16,24,40,.08)',
      },

      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          '0%':   { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        'slide-right': {
          '0%':   { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',      opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
        'marquee': {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%':           { transform: 'scale(1)' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'indicator-slide': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'ping-once': {
          '0%':         { transform: 'scale(1)',   opacity: '0.6' },
          '80%, 100%':  { transform: 'scale(1.6)', opacity: '0' },
        },
      },

      animation: {
        'fade-in':      'fade-in 0.25s ease-out both',
        'slide-left':   'slide-left 0.3s cubic-bezier(.4,0,.2,1) both',
        'slide-right':  'slide-right 0.3s cubic-bezier(.4,0,.2,1) both',
        'shimmer':      'shimmer 2s linear infinite',
        'pulse-dot':    'pulse-dot 2s ease-in-out infinite',
        'marquee':      'marquee 38s linear infinite',
        'bounce-dot':   'bounce-dot 1.4s ease-in-out infinite both',
        'spin-slow':    'spin-slow 26s linear infinite',
        'ping-once':    'ping-once 0.45s ease-out forwards',
      },

      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #071d49, #0066f5)',
        'hero-gradient':  'linear-gradient(180deg, #e3eefc, #eef4fc)',
        'gold-shimmer':   'linear-gradient(90deg, transparent 0%, rgba(255,251,8,.4) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
