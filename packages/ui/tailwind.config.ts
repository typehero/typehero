// this is a way to get tailwind autocomplete to work

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'difficulty-beginner': 'var(--difficulty-beginner)',
        'difficulty-easy': 'var(--difficulty-easy)',
        'diffuculty-medium': 'var(--difficulty-medium)',
        'difficulty-hard': 'var(--difficulty-hard)',
        'difficulty-extreme': 'var(--difficulty-extreme)',

        'difficulty-beginner-dark': 'var(--difficulty-beginner-dark)',
        'difficulty-easy-dark': 'var(--difficulty-easy-dark)',
        'diffuculty-medium-dark': 'var(--difficulty-medium-dark)',
        'difficulty-hard-dark': 'var(--difficulty-hard-dark)',
        'difficulty-extreme-dark': 'var(--difficulty-extreme-dark)',
      },
    },
  },
};
