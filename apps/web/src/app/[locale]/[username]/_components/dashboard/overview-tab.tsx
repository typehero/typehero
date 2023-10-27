import type { User } from '@repo/db/types';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Markdown } from '@repo/ui/components/markdown';

interface Props {
  // TODO: how do do this union type with just letting prisma halp
  user: Pick<User, 'bio' | 'createdAt' | 'id' | 'image' | 'name'> & {
    userLinks: { id: string | null; url: string }[];
  };
}

export async function OverviewTab({ user }: Props) {
  const hasBio = Boolean(user.bio) && user.bio.trim().length > 0;

  return (
    <Card className="col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)]">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
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
  );
}
