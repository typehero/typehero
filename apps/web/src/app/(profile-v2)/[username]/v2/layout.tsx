import { prisma } from '@repo/db';
import { cn } from '@repo/ui/cn';
import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui/components/avatar';
import { ArrowUpRight, Github, Twitter } from '@repo/ui/icons';
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
import { Button } from '@repo/ui/components/button';
import { title } from 'process';
import { BackgroundGrid } from '~/app/_components/hero-illustration';
import { ProgressChart } from './_components-v2/progress-chart';

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

  return (
    <div className="container pt-16">
      <div className="relative flex flex-row items-center justify-between">
        <div className="absolute -inset-40 top-1/2 -z-30 -translate-y-1/2 translate-x-[-30px] overflow-hidden rounded-full">
          <BackgroundGrid />
        </div>
        <div className="space-y-4">
          <div className="flex flex-row items-end space-x-6">
            <Avatar className="h-48 w-48 rounded-lg">
              <AvatarImage src={user.image ?? ''} alt={`${user.name} profile picture`} />
              <AvatarFallback className="rounded-lg capitalize">
                {user.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute -left-8 top-8 -z-10 h-[100px] w-[300px] rounded-full blur-[140px] ${gradient}`}
            />
            <div className="flex flex-col space-y-2">
              <h1
                className={cn(
                  'w-min bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent',
                  gradient,
                )}
              >
                {user.name}
              </h1>
              <Titles data={titles} />
              <h2 className="text-muted-foreground text-sm tracking-tight">
                Joined {getRelativeTime(user.createdAt)}
              </h2>
              <div className="flex flex-row space-x-1">
                <Button variant="ghost" size="sm" className="p-2">
                  <Twitter className="h-7 w-7" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Github className="h-7 w-7" />
                </Button>
              </div>
            </div>
          </div>
          <div className="max-w-[60ch]">
            <p className="tracking-tight">{user.bio}</p>
          </div>
        </div>
        <ProgressChart />
      </div>
      {props.children}
    </div>
  );
}

function BeamOfLight() {
  return (
    <svg
      className="animate-beam pointer-events-none absolute left-0 top-0 z-[-1] h-[169%] w-[138%] lg:w-[84%]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter0_f_1065_8)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill="white"
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_1065_8"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="151" result="effect1_foregroundBlur_1065_8" />
        </filter>
      </defs>
    </svg>
  );
}
