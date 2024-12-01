import type { Metadata } from 'next';
import { buildMetaForDefault } from '~/app/metadata';
import { Wizard } from './_components';

export function generateMetadata(): Promise<Metadata> {
  return buildMetaForDefault({
    title: 'Create a Challenge | TypeHero',
    description: 'Create a challenge on TypeHero and share it with the world!',
  });
}

export default function Page() {
  return <Wizard />;
}
