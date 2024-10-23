import type { Metadata } from 'next';
import { buildMetaForDefault } from '~/app/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetaForDefault({
    title: 'Explore Tracks | TypeHero',
    description:
      'Explore the tracks available on TypeHero. These tracks are designed to help you learn and improve your TypeScript skills.',
  });
}

export { Tracks as default } from './_components';
