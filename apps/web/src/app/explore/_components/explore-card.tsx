import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DifficultyBadge,
  Markdown,
} from '@repo/ui';
import { Circle, Diamond, MessageCircle, Plus, Sparkle, ThumbsUp, Triangle } from '@repo/ui/icons';
import type { ExploreChallengeData } from './explore.action';
import { getRelativeTime } from '~/utils/relativeTime';

interface ExploreCardProps {
  challenge: Pick<
    Awaited<ExploreChallengeData>[0],
    '_count' | 'difficulty' | 'name' | 'shortDescription' | 'updatedAt' | 'user'
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
  MEDIUM:
    'hover:shadow-[0_0_1rem_-0.15rem_#ca8a04] group-focus:shadow-[0_0_1rem_-0.15rem_#fde047] dark:hover:shadow-[0_0_1rem_-0.15rem_#fde047]',
  HARD: 'hover:shadow-[0_0_1rem_-0.15rem_#fca5a5] group-focus:shadow-[0_0_1rem_-0.15rem_#fca5a5]',
  EXTREME:
    'hover:shadow-[0_0_1rem_-0.15rem_#fdba74] group-focus:shadow-[0_0_1rem_-0.15rem_#fdba74]',
};

export function ExploreCard({ challenge }: ExploreCardProps) {
  return (
    <Card
      className={`group/card bg-background hover:bg-card-hovered relative overflow-hidden duration-300 sm:min-w-[300px] xl:min-w-[333px]
      ${SHADOWS_BY_DIFFICULTY[challenge.difficulty]}
      ${BORDERS_BY_DIFFICULTY[challenge.difficulty]}
      `}
    >
      {challenge.difficulty === 'BEGINNER' && (
        <>
          <Circle className="absolute -right-4 -top-8 h-24 w-24 origin-top-right stroke-[0.5] text-black/10 duration-300 group-hover/card:scale-90 group-hover/card:text-pink-500/80 dark:text-white/10 dark:group-hover/card:text-pink-300/80" />
          <Circle className="absolute -right-4 -top-8 h-32 w-32 origin-top-right stroke-[0.4] text-black/10 duration-500 group-hover/card:scale-90 group-hover/card:text-pink-500/80 dark:text-white/10 dark:group-hover/card:text-pink-300/80" />
        </>
      )}
      {challenge.difficulty === 'EASY' && (
        <>
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 origin-top-right stroke-[0.66] text-black/10 duration-300 group-hover/card:rotate-6 group-hover/card:scale-90 group-hover/card:text-green-400/90 dark:text-white/10 dark:group-hover/card:text-green-300/90" />
          <Diamond className="absolute -right-6 -top-12 h-36 w-36 rotate-12 stroke-[0.44] text-black/10 duration-500 group-hover/card:-translate-y-2 group-hover/card:translate-x-3 group-hover/card:rotate-6 group-hover/card:scale-90 group-hover/card:text-green-400/90 dark:text-white/10 dark:group-hover/card:text-green-300/90" />
        </>
      )}
      {challenge.difficulty === 'MEDIUM' && (
        <>
          <Triangle className="absolute -right-5 -top-5 h-16 w-16 rotate-0 stroke-[0.75] text-black/10 duration-500 group-hover/card:-translate-x-10 group-hover/card:translate-y-10 group-hover/card:rotate-[90deg] group-hover/card:text-yellow-500 dark:text-white/10 dark:group-hover/card:text-yellow-300/80" />
          <Triangle className="absolute -right-14 -top-16 h-36 w-36 rotate-12 stroke-[0.4] text-black/10 duration-300 group-hover/card:translate-x-3 group-hover/card:rotate-[30deg] group-hover/card:scale-50 group-hover/card:stroke-[0.66] group-hover/card:text-yellow-500 dark:text-white/10 dark:group-hover/card:text-yellow-300/80" />
        </>
      )}
      {challenge.difficulty === 'HARD' && (
        <>
          <Plus className="absolute -right-4 -top-8 h-24 w-24 stroke-[0.5] text-black/10 duration-300 group-hover/card:scale-0 group-hover/card:text-red-500/80 dark:text-white/10 dark:group-hover/card:text-red-300/80" />
          <Plus className="absolute -right-4 -top-8 h-32 w-32 stroke-[0.5] text-black/10 duration-500 group-hover/card:-translate-y-5 group-hover/card:translate-x-9 group-hover/card:-rotate-90 group-hover/card:scale-75 group-hover/card:text-red-500/80 dark:text-white/10 dark:group-hover/card:text-red-300/80" />
        </>
      )}
      {challenge.difficulty === 'EXTREME' && (
        <>
          <Sparkle className="absolute -right-4 -top-10 h-24 w-24 stroke-[0.5] text-black/10 duration-500 group-hover/card:-translate-x-4 group-hover/card:translate-y-10 group-hover/card:-rotate-[125deg] group-hover/card:text-orange-500/80 dark:text-white/10 dark:group-hover/card:text-orange-300/90" />
          <Sparkle className="absolute -right-14 -top-24 h-48 w-48 origin-top-right -rotate-3 stroke-[0.33] text-black/10 duration-300 group-hover/card:scale-50 group-hover/card:text-orange-500/80 dark:text-white/10 dark:group-hover/card:text-orange-300/90" />
        </>
      )}
      <CardHeader className="relative flex flex-col items-start gap-1 py-5">
        <CardTitle className="max-w-[75%] truncate text-2xl duration-300">
          {challenge.name}
        </CardTitle>
        <div className="flex items-center gap-6 text-center duration-300">
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
      <CardContent className="relative flex flex-col justify-between gap-2 rounded-xl p-6 pb-0 duration-300">
        <div className="flex items-center gap-2">
          <div className="-ml-[0.33rem] flex h-auto w-fit items-center whitespace-nowrap rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 duration-300 hover:bg-black/10 dark:text-white dark:hover:bg-white/20">
            @{challenge.user.name}
          </div>
          <div className="text-muted-foreground whitespace-nowrap text-sm">
            {getRelativeTime(challenge.updatedAt)}
          </div>
        </div>
        <CardDescription className="relative h-20 pb-4">
          <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover/card:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
          <Markdown>{challenge.shortDescription}</Markdown>
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default ExploreCard;
