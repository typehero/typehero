import type { BadgeInfo } from '~/app/(profile)/[username]/_components/dashboard/_actions';
import { SlugToBadgeIcon } from '~/app/(profile)/[username]/_components/dashboard/badges';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';

export function Badges(props: { data: BadgeInfo[] }) {
  const data = [
    { slug: 'aot-2023-bronze', name: 'Advent of TypeScript 2023 Bronze' },
    { slug: 'aot-2023-silver', name: 'Advent of TypeScript 2023 Bronze' },
    { slug: 'aot-2023-gold', name: 'Advent of TypeScript 2023 Bronze' },
    { slug: 'aot-2023-platinum', name: 'Advent of TypeScript 2023 Bronze' },
  ] as BadgeInfo[];
  return (
    <div>
      <TooltipProvider>
        <BadgesStuff data={data} />
      </TooltipProvider>
    </div>
  );
}

function BadgesStuff(props: { data: BadgeInfo[] }) {
  return (
    <div className="mx-auto grid w-fit grid-cols-3 gap-4  ">
      {props.data.map((b) => {
        const Icon = SlugToBadgeIcon[b.slug];
        return (
          <Tooltip key={b.slug}>
            <TooltipTrigger>
              <Icon className="h-16 w-16" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{b.name}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
      {props.data.length < 12
        ? Array.from({ length: 12 - props.data.length }).map((i) => (
            <EmptyBadge key={`empty-badge-${i}`} />
          ))
        : null}
    </div>
  );
}

function EmptyBadge() {
  return (
    <svg
      width="52"
      height="60"
      viewBox="0 0 52 60"
      fill="none"
      className="h-16 w-16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_408_2530"
        style={{
          maskType: 'alpha',
        }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="52"
        height="60"
      >
        <path
          d="M22.9998 1.73207C24.8562 0.660273 27.1434 0.660273 28.9998 1.73207L48.9805 13.268C50.8369 14.3398 51.9805 16.3205 51.9805 18.4641V41.5359C51.9805 43.6795 50.8369 45.6603 48.9805 46.7321L28.9998 58.2679C27.1434 59.3398 24.8562 59.3398 22.9998 58.2679L3.01904 46.7321C1.16264 45.6603 0.019043 43.6795 0.019043 41.5359V18.4641C0.019043 16.3205 1.16264 14.3398 3.01904 13.268L22.9998 1.73207Z"
          fill="black"
        />
      </mask>
      <g mask="url(#mask0_408_2530)">
        <path d="M56 0H-4V60H56V0Z" className="fill-muted/50" />
      </g>
    </svg>
  );
}
