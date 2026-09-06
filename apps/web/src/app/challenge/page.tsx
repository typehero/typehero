import type { Metadata } from 'next';
import { buildMetaForDefault } from '~/app/metadata';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return buildMetaForDefault({
    title: 'Challenges | TypeHero',
    description:
      'Challenges on TypeHero. These are interactive coding challenges to help you learn and improve your TypeScript skills.',
  });
}

export { Challenges as default } from './_components';
