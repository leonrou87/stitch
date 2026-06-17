import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1a17',
          soft: '#3a3a34',
          mute: '#6b6a60',
        },
        paper: {
          DEFAULT: '#faf7f0',
          card: '#ffffff',
          edge: '#ece6da',
        },
        clay: {
          50: '#fbf3ee',
          100: '#f5e2d6',
          400: '#d98a5f',
          500: '#c66f3e',
          600: '#a9572c',
          700: '#8a4524',
        },
        moss: {
          500: '#5b7553',
          600: '#46603f',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '46rem',
      },
      fontSize: {
        // Tightened, editorial-leaning scale with paired line-heights.
        xs: ['0.75rem', { lineHeight: '1.1rem' }],
        sm: ['0.875rem', { lineHeight: '1.4rem' }],
        base: ['1rem', { lineHeight: '1.65rem' }],
        lg: ['1.125rem', { lineHeight: '1.7rem' }],
        xl: ['1.3rem', { lineHeight: '1.65rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.6rem', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
        '3xl': ['2.05rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        '4xl': ['2.7rem', { lineHeight: '1.08', letterSpacing: '-0.022em' }],
        '5xl': ['3.4rem', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        '6xl': ['4.25rem', { lineHeight: '1', letterSpacing: '-0.028em' }],
      },
      borderRadius: {
        card: '1.125rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(26,26,23,0.04), 0 10px 30px -18px rgba(26,26,23,0.16)',
        lift: '0 18px 48px -22px rgba(26,26,23,0.30)',
      },
      transitionTimingFunction: {
        gentle: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
