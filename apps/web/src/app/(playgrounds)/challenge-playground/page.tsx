import { notFound } from 'next/navigation';
import { auth } from '~/server/auth';
import { isAdminOrModerator } from '~/utils/auth-guards';
import { Description } from './description';

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
