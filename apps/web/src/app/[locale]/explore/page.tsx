import type { Metadata } from 'next';

// CI fails without this
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Explore Challenges | TypeHero',
  description: 'Explore all challenges by difficulty or tags on TypeHero.',
};

export { Explore as default } from './_components';
