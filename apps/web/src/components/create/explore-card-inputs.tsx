'use client';
// TODO: unify this with the explore card into single component (maybe? idk how that'd work, too many changes)
import { MessageCircle, ThumbsUp } from '@repo/ui/icons';
import { type Difficulty } from '@repo/db/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  DifficultyBadge,
} from '@repo/ui';
import { getRelativeTime } from '~/utils/relativeTime';

// NOTE: this does not have hover: effects from explore-card
const GRADIENTS_BY_DIFFICULTY = {
  BEGINNER:
    'bg-gradient-to-br bg-[length:200%_200%] bg-left-top dark:from-pink-950 dark:via-pink-500 dark:to-pink-300 dark:via-30% via-30% via-pink-500 from-pink-300 to-pink-600',
  EASY: 'bg-gradient-to-br bg-[length:200%_200%] bg-left-top dark:from-green-950 dark:via-green-500 dark:to-green-300 dark:via-30% via-30% via-green-500 from-green-300 to-green-600',
  MEDIUM:
    'bg-gradient-to-br bg-[length:200%_200%] bg-left-top dark:from-yellow-950 dark:via-yellow-500 dark:to-yellow-300 dark:via-30% via-30% via-yellow-500 from-yellow-300 to-yellow-600',
  HARD: 'bg-gradient-to-br bg-[length:200%_200%] bg-left-top dark:from-red-950 dark:via-red-500 dark:to-red-300 dark:via-30% via-30% via-red-500 from-red-300 to-red-600',
  EXTREME:
    'bg-gradient-to-br bg-[length:200%_200%] bg-left-top dark:from-orange-950 dark:via-orange-500 dark:to-orange-300 dark:via-30% via-30% via-orange-500 from-orange-300 to-orange-600',
};

interface Props {
  name: string;
  setName: (name: string) => void;
  difficulty: Difficulty | 'BEGINNER';
  setDifficulty: (difficulty: Difficulty | 'BEGINNER') => void;
  shortDescription: string;
  setShortDescription: (shortDescription: string) => void;
}
function ExploreCardInputs({
  name,
  setName,
  difficulty,
  setDifficulty,
  shortDescription,
  setShortDescription,
}: Props) {
  return (
    <Card
      className={`overflow-hidden duration-300
        ${GRADIENTS_BY_DIFFICULTY[difficulty]}
      `}
    >
      <CardHeader className="relative flex flex-col items-start gap-1 py-5">
        <CardTitle className="pb-4 pt-0 text-3xl dark:text-white">
          <input
            className="bg-transparent placeholder-black/50 focus:outline-none dark:placeholder-white/70"
            onChange={(ev) => setName(ev.currentTarget.value)}
            placeholder="Enter Challenge Title"
            style={{ textShadow: '0 0 0.5rem #0003' }}
            value={name}
          />
        </CardTitle>
        <div className="flex items-center gap-6 text-center text-white duration-300 dark:group-hover:text-black">
          <Select onValueChange={(value: Difficulty) => setDifficulty(value)} value={difficulty}>
            <SelectTrigger className="h-8 max-w-fit border-0 p-0 focus:ring-0 focus:ring-offset-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <DifficultyBadge difficulty={difficulty || 'BEGINNER'} />
            </SelectTrigger>
            <SelectContent className="border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
              <SelectItem value="BEGINNER">BEGINNER</SelectItem>
              <SelectItem value="MEDIUM">MEDIUM</SelectItem>
              <SelectItem value="HARD">HARD</SelectItem>
              <SelectItem value="EXTREME">EXTREME</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-sm">
            <MessageCircle size={18} />
            20
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ThumbsUp size={18} />
            100
          </div>
        </div>
      </CardHeader>

      <CardContent className="bg-background group-hover:bg-card-hovered relative flex flex-col justify-between gap-2 rounded-xl p-6 pb-0 duration-300">
        <div className="flex items-center gap-2">
          <Button
            className="-ml-[0.33rem] flex h-auto w-fit items-center rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 hover:bg-black/10 dark:text-white dark:hover:bg-white/20"
            size="sm"
          >
            @you
          </Button>
          <div className="text-muted-foreground text-sm">{getRelativeTime(new Date())}</div>
        </div>
        <CardDescription className="relative h-20 overflow-hidden pb-4">
          <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
          <textarea
            className="w-full resize-none bg-transparent placeholder-black/70 focus:outline-none dark:text-white dark:placeholder-white/70"
            onChange={(ev) => setShortDescription(ev.currentTarget.value)}
            placeholder="Enter Short Description"
            value={shortDescription}
          />
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default ExploreCardInputs;
