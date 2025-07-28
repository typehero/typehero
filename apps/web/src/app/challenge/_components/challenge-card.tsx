import type {} from '@repo/db/types';
import { cn } from '@repo/ui/cn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { User, Calendar } from '@repo/ui/icons';
import { DIFFICULTY_COLORS } from '~/constants/difficulties';
import type { ChallengeCardProps } from '~/types/challenge';

export function ChallengeCard({ challenge, className }: ChallengeCardProps) {
  const hasBeenSolved = challenge.submission.length > 0;

  return (
    <Card
      className={cn(
        `group/card relative overflow-hidden rounded-[15px]
        border border-[rgba(229,231,235,1)] bg-[rgba(255,255,255,1)] shadow-sm duration-300 dark:border-[rgba(31,36,47,1)]
        dark:bg-[rgba(30,30,30,1)] dark:hover:shadow-md
        `,
        className,
      )}
    >
      {/* Header with category and solved badge */}
      <CardHeader className="relative flex flex-col items-start gap-3 px-6 py-6">
        {/* Category and solved badge row */}
        <div className="flex w-full items-start items-center justify-between">
          <span className={cn('text-sm font-normal', DIFFICULTY_COLORS[challenge.difficulty])}>
            TypeScript Foundations
          </span>
          {Boolean(hasBeenSolved) && (
            <div className="flex items-center gap-1.5 rounded-full border border-green-300 bg-green-900/30 px-3 py-1.5 dark:bg-green-900/30">
              <div className="h-2 w-2 rounded-full bg-green-400 dark:bg-green-400" />
              <span className="text-sm font-medium text-green-300 dark:text-green-300">Solved</span>
            </div>
          )}
        </div>

        {/* Title */}
        <CardTitle className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          {challenge.name.length > 18 ? `${challenge.name.slice(0, 18)}...` : challenge.name}
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="relative flex flex-col gap-4 px-6 pb-6">
        {/* Description - plain text only, no markdown */}
        <CardDescription
          className="overflow-hidden text-sm leading-relaxed text-gray-400"
          style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
        >
          {challenge.shortDescription}
        </CardDescription>

        {/* Footer stats */}
        <div className="mt-auto flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <User size={14} />
            <span>{challenge._count.submission} people</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size={14} />
            <span>35 minutes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
