'use client';

import { Circle, Diamond, MessageCircle, Plus, Sparkle, ThumbsUp, Triangle } from 'lucide-react';

import { getRelativeTime } from '~/utils/relativeTime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Markdown } from '../ui/markdown';
import { type ExploreChallengeData } from './';
import { DifficultyBadge } from '../ui/difficulty-badge';
import { UserBadge } from '../ui/user-badge';

interface ExploreCardProps {
  challenge: Pick<
    ExploreChallengeData[0],
    'difficulty' | 'name' | 'shortDescription' | 'user' | '_count' | 'updatedAt'
  >;
}

const BORDERS_BY_DIFFICULTY = {
  BEGINNER:
    'dark:hover:border-pink-300 hover:border-pink-500 dark:group-focus:border-pink-300 group-focus:border-pink-500',
  EASY: 'dark:hover:border-green-300 hover:border-green-500 dark:group-focus:border-green-300 group-focus:border-green-500',
  MEDIUM:
    'dark:hover:border-yellow-300 hover:border-yellow-500 dark:group-focus:border-yellow-300 group-focus:border-yellow-500',
  HARD: 'dark:hover:border-red-300 hover:border-red-500 dark:group-focus:border-red-300 group-focus:border-red-500',
  EXTREME:
    'dark:hover:border-orange-300 hover:border-orange-500 dark:group-focus:border-orange-300 group-focus:border-orange-500',
};

const SHADOWS_BY_DIFFICULTY = {
  BEGINNER:
    'hover:shadow-[0_0_1rem_-0.15rem_#f9a8d4] group-focus:shadow-[0_0_1rem_-0.15rem_#f9a8d4]',
  EASY: 'hover:shadow-[0_0_1rem_-0.15rem_#86efac] group-focus:shadow-[0_0_1rem_-0.15rem_#86efac]',
  MEDIUM: 'hover:shadow-[0_0_1rem_-0.15rem_#fde047] group-focus:shadow-[0_0_1rem_-0.15rem_#fde047]',
  HARD: 'hover:shadow-[0_0_1rem_-0.15rem_#fca5a5] group-focus:shadow-[0_0_1rem_-0.15rem_#fca5a5]',
  EXTREME:
    'hover:shadow-[0_0_1rem_-0.15rem_#fdba74] group-focus:shadow-[0_0_1rem_-0.15rem_#fdba74]',
};

const GRADIENTS_BY_DIFFICULTY = {
  BEGINNER:
    'bg-gradient-to-br hover:bg-[right_-2px_bottom] bg-[length:200%_200%] bg-left-top dark:from-pink-950 dark:via-pink-500 dark:to-pink-300 dark:via-30% from-pink-400 via-pink-600 via-30% to-pink-600',
  EASY: 'bg-gradient-to-br hover:bg-[right_-2px_bottom] bg-[length:200%_200%] bg-left-top dark:from-green-950 dark:via-green-500 dark:to-green-300 dark:via-30% from-green-400 via-green-600 via-30% to-green-600',
  MEDIUM:
    'bg-gradient-to-br hover:bg-[right_-2px_bottom] bg-[length:200%_200%] bg-left-top dark:from-yellow-950 dark:via-yellow-500 dark:to-yellow-300 dark:via-30% from-yellow-400 via-yellow-600 via-30% to-yellow-600',
  HARD: 'bg-gradient-to-br hover:bg-[right_-2px_bottom] bg-[length:200%_200%] bg-left-top dark:from-red-950 dark:via-red-500 dark:to-red-300 dark:via-30% from-red-400 via-red-600 via-30% to-red-600',
  EXTREME:
    'bg-gradient-to-br hover:bg-[right_-2px_bottom] bg-[length:200%_200%] bg-left-top dark:from-orange-950 dark:via-orange-500 dark:to-orange-300 dark:via-30% from-orange-400 via-orange-600 via-30% to-orange-600',
};

const ExploreCard = ({ challenge }: ExploreCardProps) => {
  return (
    <Card
      className={`group relative overflow-hidden duration-500
      ${GRADIENTS_BY_DIFFICULTY[challenge.difficulty]}
      ${SHADOWS_BY_DIFFICULTY[challenge.difficulty]} 
      ${BORDERS_BY_DIFFICULTY[challenge.difficulty]}
      `}
    >
      {challenge.difficulty === 'BEGINNER' && (
        <>
          <Circle className="absolute -right-4 -top-8 h-24 w-24 stroke-1 text-white/30 duration-300 group-hover:h-20 group-hover:w-20 dark:group-hover:text-black/30"></Circle>
          <Circle className="absolute -right-4 -top-8 h-32 w-32 stroke-1 text-white/30 duration-500 group-hover:h-28 group-hover:w-28 dark:group-hover:text-black/30"></Circle>
        </>
      )}
      {challenge.difficulty === 'EASY' && (
        <>
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 stroke-1 text-white/30 duration-300 group-hover:h-20 group-hover:w-20 group-hover:rotate-0 dark:group-hover:text-black/30"></Diamond>
          <Diamond className="absolute -right-5 -top-10 h-32 w-32 rotate-12 stroke-1 text-white/30 duration-500 group-hover:h-28 group-hover:w-28 group-hover:-rotate-12 dark:group-hover:text-black/30"></Diamond>
        </>
      )}
      {challenge.difficulty === 'MEDIUM' && (
        <>
          <Triangle className="absolute -right-4 -top-6 h-20 w-20 rotate-[40deg] stroke-2 text-white/50 duration-200 group-hover:rotate-[0deg] group-hover:scale-50 dark:group-hover:text-black/30"></Triangle>
          <Triangle className="absolute -right-12 -top-14 h-36 w-36 rotate-45 stroke-1 text-white/50 duration-300 group-hover:h-32 group-hover:w-32 group-hover:rotate-[20deg] dark:group-hover:text-black/30"></Triangle>
        </>
      )}
      {challenge.difficulty === 'HARD' && (
        <>
          <Plus className="absolute -right-4 -top-8 h-24 w-24 stroke-1 text-white/30 duration-300 group-hover:scale-0 dark:group-hover:text-black/30"></Plus>
          <Plus className="absolute -right-4 -top-8 h-32 w-32 stroke-1 text-white/30 duration-500 group-hover:scale-[3] dark:group-hover:text-black/30"></Plus>
        </>
      )}
      {challenge.difficulty === 'EXTREME' && (
        <>
          <Sparkle className="absolute -right-4 -top-10 h-24 w-24 stroke-1 text-white/40 duration-500 group-hover:-translate-x-4 group-hover:translate-y-10 group-hover:-rotate-[125deg] dark:group-hover:text-black/30"></Sparkle>
          <Sparkle className="absolute -right-12 -top-20 h-48 w-48 stroke-1 text-white/40 duration-300 group-hover:h-24 group-hover:w-24 dark:group-hover:text-black/30"></Sparkle>
        </>
      )}
      <CardHeader className="relative flex flex-col items-start gap-1">
        <CardTitle className="max-w-[75%] truncate text-2xl text-white duration-300 dark:text-white dark:group-hover:text-black/70">
          {challenge.name}
        </CardTitle>
        <div className="flex items-center gap-4 text-center text-white duration-300 dark:group-hover:text-black">
          <DifficultyBadge difficulty={challenge.difficulty} />
          {/* NOTE: Tailwind is a programming language */}
          <div className="dark duration-300 dark:group-hover:invert">
            <UserBadge username={challenge.user.name} />
          </div>
          <div className="-ml-2 text-xs">{getRelativeTime(challenge.updatedAt)}</div>
        </div>
      </CardHeader>
      <CardContent className="relative flex justify-between gap-2 rounded-xl bg-background p-6 pb-0 duration-300 group-hover:bg-card-hovered">
        <CardDescription className="relative h-20 overflow-hidden pb-4">
          <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
          <Markdown>{challenge?.shortDescription}</Markdown>
        </CardDescription>
        <div className="flex flex-col items-end justify-end gap-3 pb-6 pl-6 text-muted-foreground">
          <div className="flex items-center gap-2 text-sm">
            {challenge._count.comment}
            <MessageCircle size={18} />
          </div>
          <div className="flex items-center gap-2 text-sm">
            {challenge._count.vote}
            <ThumbsUp size={18} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExploreCard;
