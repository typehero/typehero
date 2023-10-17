import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import type { User } from '@repo/db/types';

interface Props {
  // TODO: how do do this union type with just letting prisma halp
  user: Pick<User, 'bio' | 'createdAt' | 'id' | 'image' | 'name'> & {
    userLinks: { id: string | null; url: string }[];
  };
}

export async function OverviewTab({ user }: Props) {
  const hasBio = Boolean(user.bio) && user.bio.trim().length > 0;

  return (
    <div className="w-full text-sm md:w-64 md:text-start">
      {Boolean(hasBio) && <ReactMarkdown>{user.bio}</ReactMarkdown>}
      {Boolean(!hasBio) && (
        <p className="text-muted-foreground">{user.name} does not have a bio.</p>
      )}
    </div>
  );
}
