import type { Metadata } from 'next';
import { buildMetaForDefault } from '~/app/metadata';

export function generateMetadata(): Promise<Metadata> {
  return buildMetaForDefault({
    title: 'Newsletter | TypeHero',
    description: 'Subscribe to the TypeHero newsletter and stay informed about our latest updates!',
  });
}
export { Newsletter as default } from './_components';
