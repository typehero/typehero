import { cn } from '@repo/ui/cn';
import { Text } from '@repo/ui/components/typography/typography';
import { Shield } from '@repo/ui/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';

import { type BadgeInfo } from './_actions';

const Badge = ({ name }: BadgeInfo) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div>
          <Shield className="fill-foreground h-16 w-16" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span>{name}</span>
      </TooltipContent>
    </Tooltip>
  );
};

interface BadgesProps {
  badges: BadgeInfo[];
  className?: string;
}

export const Badges = ({ badges, className }: BadgesProps) => {
  if (badges.length === 0) return null;

  return (
    <div className={cn('border-border flex flex-col gap-4 border-t py-4', className)}>
      <Text intent="leading">Badges</Text>
      <div className="grid grid-cols-4">
        {badges.map((badge) => (
          <Badge key={badge.id} {...badge} />
        ))}
      </div>
    </div>
  );
};
