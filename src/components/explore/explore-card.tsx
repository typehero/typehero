'use client';

import { ThumbsUp, PlayCircle, Bookmark } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DifficultyBadge } from './difficulty-badge';
import { Markdown } from '../ui/markdown';
import { getRelativeTime } from '~/utils/relativeTime';
import { type ExploreChallengeData } from './';

interface Props {
  challenge: Pick<
    Awaited<ExploreChallengeData>[0],
    'difficulty' | 'name' | 'shortDescription' | '_count' | 'updatedAt'
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
    'bg-gradient-to-br hover:bg-[right_-2px_bottom] bg-[length:200%_200%] bg-left-top dark:from-pink-950 dark:via-pink-500 dark:to-pink-300 dark:via-30% from-pink-300 via-pink-500 via-30% to-pink-600',
  EASY: 'bg-gradient-to-br hover:bg-[right_-2px_bottom] bg-[length:200%_200%] bg-left-top dark:from-green-950 dark:via-green-500 dark:to-green-300 dark:via-30% from-green-300 via-green-500 via-30% to-green-600',
  MEDIUM:
    'bg-gradient-to-br hover:bg-[right_-2px_bottom] bg-[length:200%_200%] bg-left-top dark:from-yellow-950 dark:via-yellow-500 dark:to-yellow-300 dark:via-30% from-yellow-300 via-yellow-500 via-30% to-yellow-600',
  HARD: 'bg-gradient-to-br hover:bg-[right_-2px_bottom] bg-[length:200%_200%] bg-left-top dark:from-red-950 dark:via-red-500 dark:to-red-300 dark:via-30% from-red-300 via-red-500 via-30% to-red-600',
  EXTREME:
    'bg-gradient-to-br hover:bg-[right_-2px_bottom] bg-[length:200%_200%] bg-left-top dark:from-orange-950 dark:via-orange-500 dark:to-orange-300 dark:via-30% from-orange-300 via-orange-500 via-30% to-orange-600',
};

const ExploreCard = ({ challenge }: Props) => {
  return (
    <Card
      className={`group overflow-hidden duration-300
      ${GRADIENTS_BY_DIFFICULTY[challenge.difficulty]}
      ${SHADOWS_BY_DIFFICULTY[challenge.difficulty]} 
      ${BORDERS_BY_DIFFICULTY[challenge.difficulty]}
      `}
    >
      {/* TODO: add background shapes grid pattern */}
      <CardHeader className="relative grid items-start gap-4">
        <div className="flex flex-col items-start gap-2">
          <DifficultyBadge difficulty={challenge.difficulty} />
          <CardTitle
            className="pb-4 text-4xl text-white"
            style={{ textShadow: '0 0 0.5rem #0003' }}
          >
            {challenge.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative rounded-xl bg-background p-6 duration-300 group-hover:bg-card-hovered">
        <div className="absolute right-7 top-1 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-background duration-300 group-hover:bg-card-hovered">
          <PlayCircle />
        </div>
        <CardDescription className="relative h-14 max-w-[75%] overflow-hidden pb-4">
          <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
          <Markdown>{challenge?.shortDescription}</Markdown>
        </CardDescription>
        <div className="flex items-end justify-between gap-8 pt-2 text-sm text-muted-foreground">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-black dark:text-white">
              {challenge._count.comment}
            </h1>
            <span>Comments</span>
          </div>
          <div className="mr-auto flex flex-col items-center">
            <h1 className="text-4xl font-bold text-black dark:text-white">
              {challenge._count.solution}
            </h1>
            <span>Solutions</span>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center justify-center gap-2 text-center">
              <Bookmark size={20} className="mr-2" />
              <ThumbsUp size={20} />
              <span>{challenge._count.vote}</span>
            </div>
            {getRelativeTime(challenge.updatedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExploreCard;
