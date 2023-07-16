import { getServerSession } from 'next-auth';
import { Settings } from '~/components/settings';
import { authOptions } from '~/server/auth';
import { prisma } from '~/server/db';

export default async function SettingsPage() {
  // NOTE: what's weird about this API is that it should have the
  // param to be required but it's not for some reason
  const session = await getServerSession(authOptions);

  if (!session?.user || !session?.user.name) {
    return null;
  }

  const profileData = await prisma.user.findFirstOrThrow({
    where: {
      id: session.user.id,
    },
  });

  return (
    <Settings
      data={{
        bio: profileData.bio,
        socialUrls: profileData.socialUrls,
      }}
    />
  );
}
