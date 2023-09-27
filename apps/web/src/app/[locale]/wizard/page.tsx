import { getServerAuthSession } from '@repo/auth/server';
import { TypographyH2 } from '@repo/ui/components/typography/h2';
import type { Metadata } from 'next';
import { Wizard } from './_components';
import { buildMetaForDefault } from '~/app/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetaForDefault({
    title: 'Create a Challenge | TypeHero',
    description: 'Create a challenge on TypeHero and share it with the world!',
  });
}

export default async function Page() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    return (
      <div className="container flex h-full flex-col items-center justify-center">
        <TypographyH2>You must be logged in to create a challenge.</TypographyH2>
      </div>
    );
  }

  return <Wizard />;
}
