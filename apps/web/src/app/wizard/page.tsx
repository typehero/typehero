import { getServerSession } from 'next-auth';
import { TypographyH2 } from '~/components/ui/typography/h2';
import { Wizard } from '~/components/wizard';
import { authOptions } from '~/server/auth';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="container flex h-full flex-col items-center justify-center">
        <TypographyH2>You must be logged in to create a challenge.</TypographyH2>
      </div>
    );
  }

  return <Wizard />;
}
