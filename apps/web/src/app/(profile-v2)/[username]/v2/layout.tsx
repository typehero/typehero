import { prisma } from '@repo/db';
import { cn } from '@repo/ui/cn';
import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui/components/avatar';
import { Github, Twitter } from '@repo/ui/icons';
import { notFound } from 'next/navigation';
import {
  getBadges,
  type BadgeInfo,
} from '~/app/(profile)/[username]/_components/dashboard/_actions';
import { SlugToBadgeIcon } from '~/app/(profile)/[username]/_components/dashboard/badges';
import { Titles } from '~/app/challenge/_components/comments/enhanced-user-badge';
import {
  getTitles,
  getGradient,
} from '~/app/challenge/_components/comments/enhanced-user-badge.getTitles';
import { getRelativeTime } from '~/utils/relativeTime';
import { ProgressChart } from './_components/progress-chart';
import { SharedSolutionCard } from './_components/shared-solution-card';
import { Button } from '@repo/ui/components/button';

export default async function LayoutPage(
  props: React.PropsWithChildren<{ params: { username: string } }>,
) {
  const [, username] = decodeURIComponent(props.params.username).split('@');
  if (username === undefined) {
    notFound();
  }
  const user = await prisma.user.findFirst({
    where: {
      name: username,
    },
    select: {
      id: true,
      bio: true,
      name: true,
      image: true,
      roles: true,
      createdAt: true,
    },
  });
  if (user === null) {
    notFound();
  }

  const titles = getTitles(user.roles);
  const gradient = getGradient(user.roles);
  const badges = await getBadges(user.id);

  return (
    <div className="container py-8">
      <div className="flex flex-row space-x-12">
        <div className="flex max-w-64 flex-col space-y-4">
          <Avatar className="h-64 w-64 rounded-lg">
            <AvatarImage src={user.image ?? ''} />
            <AvatarFallback className="rounded-lg uppercase">
              {user.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col space-y-1">
              <h1
                className={cn(
                  'w-min bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent',
                  gradient,
                )}
              >
                {user.name}
              </h1>
              <Titles data={titles} />
              <p className="text-muted-foreground text-sm tracking-tight">
                Joined {getRelativeTime(user.createdAt)}
              </p>
            </div>
            <p className="text-card-foreground w-full break-words">{user.bio}</p>
            <div className="flex flex-row items-center space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <Twitter className="h-7 w-7" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Github className="h-7 w-7" />
              </Button>
            </div>
            <div>
              <h2>Badges</h2>
              <Badges data={badges} />
            </div>
          </div>
        </div>
        {props.children}
      </div>
    </div>
  );
}

function Badges(props: { data: BadgeInfo[] }) {
  return (
    <div className="flex flex-row space-x-2">
      {props.data.map((b) => {
        const Icon = SlugToBadgeIcon[b.slug];
        return <Icon className="h-10 w-10" key={b.slug} />;
      })}
    </div>
  );
}
