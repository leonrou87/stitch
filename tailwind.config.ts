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
      boxShadow: {
        card: '0 1px 2px rgba(26,26,23,0.04), 0 8px 24px -12px rgba(26,26,23,0.12)',
        lift: '0 12px 40px -16px rgba(26,26,23,0.28)',
      },
    },
  },
  plugins: [],
}

export default config
