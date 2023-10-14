import { getServerAuthSession } from '@repo/auth/server';
import { prisma } from '@repo/db';
import { Settings } from '../_components/settings';

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

  // NOTE: make the user links have 4 at all times
  const userLinks = (profileData.userLinks = [
    ...profileData.userLinks,
    ...Array(4 - profileData.userLinks.length).fill({
      id: null,
      url: '',
    }),
  ])
    // NOTE: sort the user links so empty strings are at the bottom
    .sort((a, b) => b.url.localeCompare(a.url));

  return (
    <>
      <Settings user={profileData} />
    </>
  );
}
