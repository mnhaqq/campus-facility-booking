/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body:    ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        /* ── Deep void backgrounds ── */
        void:     '#09050F',
        abyss:    '#07030D',
        amethyst: '#120B1C',
        nebula: {
          900: '#190D2E',
          800: '#1F1238',
          700: '#251643',
          600: '#2D1A52',
        },
        /* ── UV Purple scale ── */
        uv: {
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7C3AED',
          800: '#6D28D9',
          900: '#5B21B6',
        },
        /* ── Fuchsia / Magenta accent ── */
        mag: {
          400: '#E879F9',
          500: '#D946EF',
          600: '#C026D3',
        },
        /* ── Indigo lavender ── */
        lav: {
          400: '#818CF8',
          500: '#6366F1',
        },
        /* ── Status (high contrast on dark purple bg) ── */
        emerald: {
          400: '#34D399',
          500: '#10B981',
        },
        solar: {
          400: '#FCD34D',
          500: '#F59E0B',
        },
        rose: {
          400: '#F87171',
          500: '#EF4444',
        },
        /* ── Light text scale ── */
        ink: {
          50:  '#F0EAFF',
          100: '#E2D9F3',
          200: '#C4B5FD',
          300: '#A78BFA',
          400: '#8B5CF6',
          500: '#7C3AED',
          600: '#6D28D9',
          muted: '#9580C1',
          dim:   '#6B5E8A',
          ghost: '#42355E',
        },
      },
      backgroundImage: {
        'uv-btn':    'linear-gradient(135deg, #7C3AED 0%, #A855F7 55%, #C084FC 100%)',
        'uv-accent': 'linear-gradient(135deg, #A855F7 0%, #E879F9 100%)',
        'hero-void': 'radial-gradient(ellipse at 50% -5%, #251643 0%, #09050F 65%)',
        'mesh-uv':   `
          radial-gradient(at 20% 15%, rgba(124,58,237,0.18) 0px, transparent 55%),
          radial-gradient(at 80% 5%,  rgba(168,85,247,0.12) 0px, transparent 50%),
          radial-gradient(at 50% 90%, rgba(232,121,249,0.08) 0px, transparent 50%)
        `,
      },
      animation: {
        'float':        'float 7s ease-in-out infinite',
        'float-slow':   'float 10s ease-in-out infinite',
        'pulse-uv':     'pulseUV 3s ease-in-out infinite',
        'shimmer-uv':   'shimmerUV 2.2s linear infinite',
        'spin-slow':    'spin 10s linear infinite',
        'glow-pulse':   'glowPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        pulseUV: {
          '0%,100%': { opacity: '0.6' },
          '50%':     { opacity: '1'   },
        },
        shimmerUV: {
          '0%':   { backgroundPosition: '-300% 0' },
          '100%': { backgroundPosition:  '300% 0' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 15px rgba(168,85,247,0.3)' },
          '50%':     { boxShadow: '0 0 40px rgba(168,85,247,0.7)' },
        },
      },
    },
  },
  plugins: [],
}
