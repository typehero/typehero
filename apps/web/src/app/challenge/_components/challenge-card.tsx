import type { Submission, Difficulty } from '@repo/db/types';
import { cn } from '@repo/ui/cn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  User,
  Calendar,
} from '@repo/ui/icons';
import { DIFFICULTY_COLORS } from '~/constants/difficulties';
import type { ChallengeCardProps } from '~/types/challenge';

export function ChallengeCard({ challenge, className }: ChallengeCardProps) {
  const hasBeenSolved = challenge.submission.length > 0;

  return (
    <Card
      className={cn(
        `group/card relative overflow-hidden duration-300
        rounded-[15px] border dark:border-[rgba(31,36,47,1)] border-[rgba(229,231,235,1)] shadow-sm dark:hover:shadow-md
        dark:bg-[rgba(30,30,30,1)] bg-[rgba(255,255,255,1)]
        `,
        className,
      )}
    >
      {/* Header with category and solved badge */}
      <CardHeader className="relative flex flex-col items-start gap-3 py-6 px-6">
        {/* Category and solved badge row */}
        <div className="flex items-start justify-between w-full items-center">
          <span className={cn("text-sm font-normal", DIFFICULTY_COLORS[challenge.difficulty])}>
            TypeScript Foundations
          </span>
          {Boolean(hasBeenSolved) && (
            <div className="flex items-center gap-1.5 bg-green-900/30 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-green-300">Solved</span>
            </div>
          )}
        </div>
        
        {/* Title */}
        <CardTitle className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300">
          {challenge.name.length > 18 ? challenge.name.slice(0, 18) + '...' : challenge.name}
        </CardTitle>
      </CardHeader>
      
      {/* Content */}
      <CardContent className="relative flex flex-col gap-4 px-6 pb-6">
        {/* Description - plain text only, no markdown */}
        <CardDescription className="text-gray-400 leading-relaxed text-sm overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {challenge.shortDescription}
        </CardDescription>
        
        {/* Footer stats */}
        <div className="flex items-center gap-4 mt-auto">
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
