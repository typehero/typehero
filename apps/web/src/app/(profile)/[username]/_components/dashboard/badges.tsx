import { type FC } from 'react';

import { cn } from '@repo/ui/cn';
import { Text } from '@repo/ui/components/typography/typography';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';

import type { AllBadgeObjs, AllBadges, BadgeModel } from '~/app/actions/badges/_actions';
import {
  HolidayBronzeBadge,
  HolidayGoldBadge,
  HolidayPlatinumBadge,
  HolidaySilverBadge,
} from '../badges/aot-2023-badge';
import { toast } from '@repo/ui/components/use-toast';
import { BronzeBadge, GoldBadge, PlatinumBadge, SilverBadge } from '../badges/badge-svg';

export const SlugToBadgeIcon: Record<
  keyof AllBadgeObjs,
  FC<{ className?: string; shortName: string }>
> = {
  'aot-2023-bronze': HolidayBronzeBadge,
  'aot-2023-silver': HolidaySilverBadge,
  'aot-2023-gold': HolidayGoldBadge,
  'aot-2023-platinum': HolidayPlatinumBadge,
  EASY: GoldBadge,
  MEDIUM: GoldBadge,
  HARD: GoldBadge,
  EXTREME: PlatinumBadge,
  'most-shared-solutions-bronze': BronzeBadge,
  'most-shared-solutions-silver': SilverBadge,
  'most-shared-solutions-gold': GoldBadge,
  'most-shared-solutions-platinum': PlatinumBadge,
};

const Badge = ({ slug, name, shortName }: AllBadges) => {
  const Icon = SlugToBadgeIcon[slug];

  if (Icon === undefined) return null;

  return (
    <Tooltip>
      <TooltipTrigger>
        <span
          onClick={(e) => {
            navigator.clipboard
              .writeText(e.currentTarget.innerHTML)
              .then((_x) => {
                toast({
                  title: 'Copied to clipboard',
                  variant: 'success',
                });
              })
              .catch();
          }}
        >
          <Icon className="h-12 w-12" shortName={shortName} />
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span>{name}</span>
      </TooltipContent>
    </Tooltip>
  );
};

interface BadgesProps {
  badges: BadgeModel[];
  className?: string;
}

export const Badges = ({ badges, className }: BadgesProps) => {
  if (Object.keys(badges).length === 0) return null;

  return (
    <div className={cn('border-border flex flex-col gap-4 border-t py-4', className)}>
      <Text intent="leading">Badges</Text>
      <div className="flex max-w-60 flex-wrap gap-2">
        {badges.map((badge) => (
          <Badge key={badge.slug} {...badge} />
        ))}
      </div>
    </div>
  );
};
