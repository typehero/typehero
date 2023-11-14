import { notFound } from 'next/navigation';
import { isAdminOrModerator } from '~/utils/auth-guards';
import { Description } from './description';
import { auth } from '@repo/auth/server';

export default async function ChallengePlaygroundPage() {
  const session = await auth();

  if (!isAdminOrModerator(session)) {
    return notFound();
  }

  return (
    <div className="relative h-full">
      <Description />
    </div>
  );
}
