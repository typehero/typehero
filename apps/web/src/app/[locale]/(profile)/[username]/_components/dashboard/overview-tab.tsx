import type { User } from '@repo/db/types';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Markdown } from '@repo/ui/components/markdown';
import { ChallengesProgress } from './challenges-progress';

interface Props {
  // TODO: how do do this union type with just letting prisma halp
  user: Pick<User, 'bio' | 'createdAt' | 'id' | 'image' | 'name'> & {
    userLinks: { id: string | null; url: string }[];
  };
}

export async function OverviewTab({ user }: Props) {
  const hasBio = Boolean(user.bio) && user.bio.trim().length > 0;

  return (
    <div className="col-span-4 flex flex-col gap-6 md:min-h-[calc(100vh_-_56px_-_6rem)]">
      <div className="flex flex-col md:flex-row md:gap-6">
        <ChallengesProgress />
        {/* //Todo: Filling with void for now, may put contributions / something else */}
        <div className="max-w-sm flex-grow" />
      </div>
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full text-sm">
            {hasBio ? (
              <Markdown>{user.bio}</Markdown>
            ) : (
              <p className="text-muted-foreground">{user.name} does not have a bio.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
