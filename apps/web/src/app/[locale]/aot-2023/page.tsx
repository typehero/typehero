import type { Metadata } from 'next';
import { buildMetaForDefault } from '~/app/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetaForDefault({
    title: 'Advent of Typescript 2023 | TypeHero',
    description: 'Advent of Typescript 2023',
  });
}

export { AotLandingPage as default } from './_components';
