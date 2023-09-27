import type { Metadata } from 'next';
import { buildMetaForDefault } from '~/app/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetaForDefault({
    title: 'Explore Tracks | TypeHero',
  });
}

export { Tracks as default } from './_components';
