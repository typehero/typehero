import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import type { Metadata } from 'next';
import { NewSettings } from './_components/new-settings';
import { buildMetaForDefault } from '~/app/metadata';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetaForDefault({
    title: 'Settings | TypeHero',
    description: 'Change your settings on TypeHero.',
  });
}

export default async function SettingsPage() {
  const session = await getServerAuthSession();

  if (!session?.user || !session.user.name) {
    return null;
  }

  const profileData = await prisma.user.findFirstOrThrow({
    where: {
      id: session.user.id,
    },
    include: {
      userLinks: true,
    },
    orderBy: {
      updatedAt: 'asc',
    },
  });

  return (
    <>
      <NewSettings user={profileData} />
    </>
  );
}
