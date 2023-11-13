import type { User } from '@repo/db/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/card';
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
      <div className="flex flex-col gap-6 md:flex-row">
        <ChallengesProgress />
        <Card className="flex-grow md:max-w-xs">
          <CardHeader>
            <CardTitle>Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-6">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="bg-muted h-4 w-4 rounded-full" />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-muted-foreground mt-1 text-xs">
              <span className="text-foreground text-xl">0</span> in October
            </div>
          </CardFooter>
        </Card>
      </div>
      <Card className="flex-grow">
        <CardHeader>
          <CardTitle>Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full text-sm">
            {Boolean(hasBio) && <Markdown>{user.bio}</Markdown>}
            {Boolean(!hasBio) && (
              <p className="text-muted-foreground">{user.name} does not have a bio.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
