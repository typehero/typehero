import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/tooltip';

import {
  HolidayBronzeBadge,
  HolidayGoldBadge,
  HolidayPlatinumBadge,
  HolidaySilverBadge,
} from './aot-badges/aot-2023-badge';
import type { BadgeInfo } from '../user-info';
import type { FC } from 'react';
import { BronzeBadge, GoldBadge, PlatinumBadge, SilverBadge } from './aot-badges/aot-2024-badges';

export const SlugToBadgeIcon: Record<BadgeInfo['slug'], FC<{ className: string }>> = {
  'aot-2023-bronze': HolidayBronzeBadge,
  'aot-2023-silver': HolidaySilverBadge,
  'aot-2023-gold': HolidayGoldBadge,
  'aot-2023-platinum': HolidayPlatinumBadge,
  'aot-2024-bronze': BronzeBadge,
  'aot-2024-silver': SilverBadge,
  'aot-2024-gold': GoldBadge,
  'aot-2024-platinum': PlatinumBadge,
};
export function Badges(props: { data: BadgeInfo[] }) {
  return (
    <div>
      <TooltipProvider>
        <BadgesStuff data={props.data} />
      </TooltipProvider>
    </div>
  );
}

function BadgesStuff(props: { data: BadgeInfo[] }) {
  return (
    <div className="mx-auto grid w-fit grid-cols-4 gap-4  ">
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

export function EmptyBadge() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      fill="none"
      className="h-16 w-16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="mask0_408_2530" maskUnits="userSpaceOnUse" x="0" y="0" width="52" height="52">
          <circle cx="26" cy="26" r="26" fill="white" />
        </mask>
      </defs>
      <g mask="url(#mask0_408_2530)">
        <path d="M56 0H-4V52H56V0Z" className="dark:fill-muted/50 fill-muted-foreground/50" />
        <path d="M22.9998 1.73207C24.8562 0.660273 27.1434 0.660273 28.9998 1.73207L48.9805 13.268C50.8369 14.3398 51.9805 16.3205 51.9805 18.4641V41.5359C51.9805 43.6795 50.8369 45.6603 48.9805 46.7321L28.9998 58.2679C27.1434 59.3398 24.8562 59.3398 22.9998 58.2679L3.01904 46.7321C1.16264 45.6603 0.019043 43.6795 0.019043 41.5359V18.4641C0.019043 16.3205 1.16264 14.3398 3.01904 13.268L22.9998 1.73207Z" />
      </g>
    </svg>
  );
}
