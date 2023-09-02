// this is a way to get tailwind autocomplete to work

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
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
    },
  },
};
