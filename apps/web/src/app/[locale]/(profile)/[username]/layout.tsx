import { Suspense } from 'react';
import { Profile } from './_components/profile';
import { ProfileSkeleton } from './_components/profile-skeleton';

export default async function LayoutProfile({
  children,
  params: { username },
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Profile username={username}>{children}</Profile>;
    </Suspense>
  );
}
