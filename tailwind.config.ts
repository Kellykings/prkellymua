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
        navy: {
          950: '#071016',
          900: '#0E1E28',
          800: '#142936',
          700: '#1C3747',
          600: '#2A4B60',
        },
        gold: {
          200: '#EFE0BE',
          300: '#E2C992',
          400: '#D4B475',
          500: '#C8A86B',
          600: '#9E7D43',
          700: '#7D602B',
          800: '#5E471E',
        },
        bronze: {
          500: '#8C6721',
          600: '#7A5A1A',
          700: '#684C14',
          800: '#533B0D',
        },
        surface: {
          light: '#F8F9F8',
          paper: '#F2F4F3',
          card: '#FFFFFF',
          muted: '#EAECEB',
          border: '#DCE1DF',
        },
        ink: {
          900: '#111B21',
          700: '#2C3B45',
          500: '#52626D',
          400: '#4B5563',
        },
        slate: {
          850: '#1D2A32',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        institutional: '0 1px 3px 0 rgba(14, 30, 40, 0.04), 0 8px 24px -6px rgba(14, 30, 40, 0.05)',
        elevated: '0 16px 40px -12px rgba(14, 30, 40, 0.14)',
      },
      lineHeight: {
        display: '1.1',
      },
    },
  },
  plugins: [],
};

export default config;
