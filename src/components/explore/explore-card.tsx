import { Circle, Diamond, MessageCircle, Plus, Sparkle, ThumbsUp, Triangle } from 'lucide-react';

import { getRelativeTime } from '~/utils/relativeTime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { type ExploreChallengeFetcher } from './';
import { DifficultyBadge } from '../ui/difficulty-badge';

interface ExploreCardProps {
  challenge: Pick<
    Awaited<ReturnType<ExploreChallengeFetcher>>[0],
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

export const ExploreCard = ({ challenge }: ExploreCardProps) => {
  return (
    <Card
      className={`group relative overflow-hidden duration-300 sm:min-w-[300px] xl:min-w-[333px]
      ${GRADIENTS_BY_DIFFICULTY[challenge.difficulty]}
      ${SHADOWS_BY_DIFFICULTY[challenge.difficulty]} 
      ${BORDERS_BY_DIFFICULTY[challenge.difficulty]}
      `}
    >
      {challenge.difficulty === 'BEGINNER' && (
        <>
          <Circle className="absolute -right-4 -top-8 h-24 w-24 origin-top-right stroke-1 text-white/30 duration-300 group-hover:scale-90 dark:group-hover:text-black/30"></Circle>
          <Circle className="absolute -right-4 -top-8 h-32 w-32 origin-top-right stroke-1 text-white/30 duration-500 group-hover:scale-90 dark:group-hover:text-black/30"></Circle>
        </>
      )}
      {challenge.difficulty === 'EASY' && (
        <>
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 origin-top-right stroke-1 text-white/30 duration-300 group-hover:rotate-6 group-hover:scale-90 dark:group-hover:text-black/30"></Diamond>
          <Diamond className="absolute -right-6 -top-12 h-36 w-36 rotate-12 stroke-[0.75] text-white/30 duration-300 group-hover:-translate-y-2 group-hover:translate-x-3 group-hover:rotate-6 group-hover:scale-90 dark:group-hover:text-black/30"></Diamond>
        </>
      )}
      {challenge.difficulty === 'MEDIUM' && (
        <>
          <Triangle className="absolute -right-5 -top-5 h-16 w-16 rotate-0 stroke-2 text-white/50 duration-500 group-hover:-translate-x-10 group-hover:translate-y-10 group-hover:rotate-[90deg] dark:group-hover:text-black/30"></Triangle>
          <Triangle className="absolute -right-14 -top-16 h-36 w-36 rotate-0 stroke-1 text-white/50 duration-300 group-hover:translate-x-3 group-hover:rotate-[30deg] group-hover:scale-50 group-hover:stroke-2 dark:group-hover:text-black/30"></Triangle>
        </>
      )}
      {challenge.difficulty === 'HARD' && (
        <>
          <Plus className="absolute -right-4 -top-8 h-24 w-24 stroke-1 text-white/30 duration-300 group-hover:scale-0 dark:group-hover:text-black/30"></Plus>
          <Plus className="absolute -right-4 -top-8 h-32 w-32 stroke-1 text-white/30 duration-500 group-hover:-translate-y-5 group-hover:translate-x-5 group-hover:-rotate-90 group-hover:scale-75 dark:group-hover:text-black/30"></Plus>
        </>
      )}
      {challenge.difficulty === 'EXTREME' && (
        <>
          <Sparkle className="absolute -right-4 -top-10 h-24 w-24 stroke-1 text-white/40 duration-500 group-hover:-translate-x-4 group-hover:translate-y-10 group-hover:-rotate-[125deg] dark:group-hover:text-black/30"></Sparkle>
          <Sparkle className="absolute -right-12 -top-20 h-48 w-48 origin-top-right stroke-1 text-white/40 duration-300 group-hover:scale-50 dark:group-hover:text-black/30"></Sparkle>
        </>
      )}
      <CardHeader className="relative flex flex-col items-start gap-1 py-5">
        <CardTitle className="max-w-[75%] truncate text-2xl text-white duration-300 dark:text-white dark:group-hover:text-black/70">
          {challenge.name}
        </CardTitle>
        <div className="flex items-center gap-6 text-center text-white duration-300 dark:group-hover:text-black">
          <DifficultyBadge difficulty={challenge.difficulty} />
          <div className="flex items-center gap-2 text-sm">
            <MessageCircle size={18} />
            {challenge._count.comment}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ThumbsUp size={18} />
            {challenge._count.vote}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative flex flex-col justify-between gap-2 rounded-xl bg-background p-6 pb-0 duration-300 group-hover:bg-card-hovered">
        <div className="flex items-center gap-2">
          <div className="-ml-[0.33rem] flex h-auto w-fit items-center whitespace-nowrap rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 duration-300 hover:bg-black/10 dark:text-white dark:hover:bg-white/20">
            @{challenge.user.name}
          </div>
          <div className="whitespace-nowrap text-sm text-muted-foreground">
            {getRelativeTime(challenge.updatedAt)}
          </div>
        </div>
        <CardDescription className="relative h-20 overflow-hidden pb-4">
          <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
          {challenge?.shortDescription}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ExploreCard;
