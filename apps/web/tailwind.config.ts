const { fontFamily } =
  // eslint-disable-next-line
  require('tailwindcss/defaultTheme') as typeof import('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    'src/**/*.{ts,tsx}',
    '../../packages/{ui,monaco}/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        // iPad Pro vertical is 1024px exactly
        lg: '1025px',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          hovered: 'hsl(var(--card-hovered))',
          foreground: 'hsl(var(--card-foreground))',
        },

        difficultyBeginner: 'var(--difficulty-beginner)',
        difficultyEasy: 'var(--difficulty-easy)',
        difficultyMedium: 'var(--difficulty-medium)',
        difficultyHard: 'var(--difficulty-hard)',
        difficultyExtreme: 'var(--difficulty-extreme)',

        difficultyBeginnerDark: 'var(--difficulty-beginner-dark)',
        difficultyEasyDark: 'var(--difficulty-easy-dark)',
        difficultyMediumDark: 'var(--difficulty-medium-dark)',
        difficultyHardDark: 'var(--difficulty-hard-dark)',
        difficultyExtremeDark: 'var(--difficulty-extreme-dark)',
      },
      boxShadow: {
        beginner: '0 0 1rem -0.15rem var(--difficulty-beginner)',
        easy: '0 0 1rem -0.15rem var(--difficulty-easy)',
        medium: '0 0 1rem -0.15rem var(--difficulty-medium)',
        hard: '0 0 1rem -0.15rem var(--difficulty-hard)',
        extreme: '0 0 1rem -0.15rem var(--difficulty-extreme)',

        beginnerDark: '0 0 1rem -0.15rem var(--difficulty-beginner-dark)',
        easyDark: '0 0 1rem -0.15rem var(--difficulty-easy-dark)',
        mediumDark: '0 0 1rem -0.15rem var(--difficulty-medium-dark)',
        hardDark: '0 0 1rem -0.15rem var(--difficulty-hard-dark)',
        extremeDark: '0 0 1rem -0.15rem var(--difficulty-extreme-dark)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
};
