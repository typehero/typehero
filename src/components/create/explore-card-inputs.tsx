'use client';
// TODO: unify this with the explore card into single component (maybe? idk how that'd work, too many changes)
import { ThumbsUp, PlayCircle, Bookmark } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DifficultyBadge } from '../explore/difficulty-badge';
import { Markdown } from '../ui/markdown';
import { getRelativeTime } from '~/utils/relativeTime';

import { Select, SelectContent, SelectItem, SelectTrigger } from '../../components/ui/select';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';

import { type Difficulty } from '@prisma/client';
import { useState } from 'react';

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
const ExploreCardInputs = ({
  name,
  setName,
  difficulty,
  setDifficulty,
  shortDescription,
  setShortDescription,
}: Props) => {
  const [isPreviewing, setIsPreviewing] = useState({
    shortDescription: false,
  });

  return (
    <Card
      className={`group overflow-hidden duration-300
        ${GRADIENTS_BY_DIFFICULTY[difficulty]}
      `}
    >
      {/* TODO: add background shapes grid pattern */}
      <CardHeader className="relative grid items-start gap-4">
        <div className="flex flex-col items-start">
          <h1 className="text-sm text-black/50 dark:text-white/70">Challenge Difficulty Level:</h1>
          <Select onValueChange={(value: Difficulty) => setDifficulty(value)} value={difficulty}>
            <SelectTrigger className="h-8 max-w-fit border-0 p-0 focus:ring-0 focus:ring-offset-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0">
              <DifficultyBadge difficulty={difficulty || 'BEGINNER'} />
            </SelectTrigger>
            <SelectContent className="border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
              <SelectItem value="BEGINNER">BEGINNER</SelectItem>
              <SelectItem value="EASY">EASY</SelectItem>
              <SelectItem value="MEDIUM">MEDIUM</SelectItem>
              <SelectItem value="HARD">HARD</SelectItem>
              <SelectItem value="EXTREME">EXTREME</SelectItem>
            </SelectContent>
          </Select>
          <h1 className="pt-3 text-sm text-black/50 dark:text-white/70">Challenge Title:</h1>
          <CardTitle className="pb-4 pt-0 text-3xl dark:text-white">
            <input
              className="bg-transparent placeholder-black/50 focus:outline-none dark:placeholder-white/70"
              style={{ textShadow: '0 0 0.5rem #0003' }}
              value={name}
              placeholder="Enter Challenge Title"
              onChange={(ev) => setName(ev.currentTarget.value)}
            />
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative rounded-xl bg-background p-6 duration-300 group-hover:bg-card-hovered">
        <div className="absolute right-7 top-1 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-background duration-300 group-hover:bg-card-hovered">
          <PlayCircle />
        </div>

        <div className="mb-1 flex items-center justify-between pr-1">
          <h1 className="text-sm text-black/70 dark:text-white/70">Short Description:</h1>

          <Label
            htmlFor="preview"
            className="flex cursor-pointer items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Preview:
            <Checkbox
              id="preview"
              className="border-zinc-500"
              checked={isPreviewing.shortDescription}
              onCheckedChange={(checked) =>
                setIsPreviewing((rest) => ({ ...rest, shortDescription: checked === true }))
              }
            />
          </Label>
        </div>
        <CardDescription className="relative h-14 max-w-[75%] overflow-hidden pb-4">
          <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
          {isPreviewing.shortDescription ? (
            <Markdown>{shortDescription}</Markdown>
          ) : (
            <textarea
              className="w-full resize-none bg-transparent placeholder-black/70 focus:outline-none dark:text-white dark:placeholder-white/70"
              value={shortDescription}
              placeholder="Enter Short Description"
              onChange={(ev) => setShortDescription(ev.currentTarget.value)}
            />
          )}
        </CardDescription>
        <div className="flex items-end justify-between gap-8 pt-2 text-sm text-muted-foreground">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-black dark:text-white">0</h1>
            <span>Comments</span>
          </div>
          <div className="mr-auto flex flex-col items-center">
            <h1 className="text-4xl font-bold text-black dark:text-white">0</h1>
            <span>Solutions</span>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center justify-center gap-2 text-center">
              <Bookmark size={20} className="mr-2" />
              <ThumbsUp size={20} />
              <span>69</span>
            </div>
            {getRelativeTime(new Date())}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExploreCardInputs;
