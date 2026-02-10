import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        casa: {
          navy: '#1B1464',
          'navy-light': '#2D2080',
          'navy-dark': '#110D40',
        },
        gold: {
          DEFAULT: '#B8860B',
          light: '#D4A843',
        },
        canvas: '#FAFAFA',
        surface: '#FFFFFF',
        subtle: '#F5F5F4',
        warm: '#FAF8F5',
        'text-primary': '#0A0A0A',
        'text-secondary': '#525252',
        'text-tertiary': '#A3A3A3',
        'text-inverse': '#FAFAFA',
        border: '#E5E5E5',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-dm-serif)', 'Georgia', 'serif'],
        logo: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '16px',
        button: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 40px rgba(27,20,100,0.08)',
        elevated: '0 4px 12px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'counter': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
