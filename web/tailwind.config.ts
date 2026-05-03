import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Backgrounds */
        cream:  '#FAFAF8',
        paper:  '#F2EDE8',
        /* Text */
        ink:        '#0C0C0C',
        'ink-soft': '#6B6760',
        'ink-muted':'#ADADAD',
        /* Accents */
        red:        '#C0392B',
        'red-deep': '#922B21',
        gold:       '#B8933A',
        'gold-light':'#E4CFA0',
        sakura:     '#F4A7B9',
        'sakura-soft':'#FDE8EF',
        /* Dark (feed hero, day pages) */
        dark:       '#0C0C0C',
        'dark-card':'#161616',
        /* Borders */
        border:     'rgba(0,0,0,0.08)',
      },
      fontFamily: {
        /* Fraunces — editorial display serif */
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        serif:   ['var(--font-fraunces)', 'Georgia', 'serif'],
        /* DM Sans — clean UI sans */
        sans:    ['var(--font-dm-sans)',  'system-ui', 'sans-serif'],
      },
      fontSize: {
        /* Custom display sizes */
        'display-xl': ['clamp(3.5rem, 14vw, 7rem)',   { lineHeight: '0.90' }],
        'display-lg': ['clamp(2.4rem,  9vw, 5rem)',   { lineHeight: '0.92' }],
        'display-md': ['clamp(1.8rem,  6vw, 3.2rem)', { lineHeight: '0.96' }],
        'display-sm': ['clamp(1.3rem,  4vw, 2rem)',   { lineHeight: '1.05' }],
      },
      letterSpacing: {
        label: '.3em',
        wide:  '.2em',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
};

export default config;
