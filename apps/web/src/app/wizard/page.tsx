import { getServerAuthSession } from '@repo/auth/server';
import { TypographyH2 } from '@repo/ui';
import { Wizard } from '~/components/wizard';

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
