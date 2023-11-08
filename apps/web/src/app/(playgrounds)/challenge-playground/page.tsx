import { getServerAuthSession } from '@repo/auth/server';
import { notFound } from 'next/navigation';
import { isAdminOrModerator } from '~/utils/auth-guards';
import { Description } from './description';

export default async function ChallengePlaygroundPage() {
  const session = await getServerAuthSession();

  if (!isAdminOrModerator(session)) {
    return notFound();
  }

  return (
    <div className="relative h-full">
      <Description />
    </div>
  );
}
