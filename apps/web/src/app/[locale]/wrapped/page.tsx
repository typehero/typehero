import type { Metadata } from 'next';
import { buildMetaForEventPage } from '~/app/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetaForEventPage({
    title: '2023 Wrapped | TypeHero',
    description: '2023 Wrapped on TypeHero',
  });
}

export { TypeHeroWrapped as default } from './_components';
