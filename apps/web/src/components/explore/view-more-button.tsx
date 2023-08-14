'use client';

import { Button } from '@repo/ui';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ExploreChallengeData } from './explore.action';

const BUTTONS_BY_DIFFICULTY = {
  BEGINNER:
    'bg-pink-500/10 text-pink-700 hover:text-pink-700 dark:text-pink-300 dark:bg-pink-300/10 hover:bg-pink-500/20 dark:hover:bg-pink-300/20',
  EASY: 'bg-green-500/10 text-green-700 hover:text-green-700 dark:text-green-300 dark:bg-green-300/10 hover:bg-green-500/20 dark:hover:bg-green-300/20',
  MEDIUM:
    'bg-yellow-500/10 text-yellow-700 hover:text-yellow-700 dark:text-yellow-300 dark:bg-yellow-300/10 hover:bg-yellow-500/20 dark:hover:bg-yellow-300/20',
  HARD: 'bg-red-500/10 text-red-700 hover:text-red-700 dark:text-red-300 dark:bg-red-300/10 hover:bg-red-500/20 dark:hover:bg-red-300/20',
  EXTREME:
    'bg-orange-500/10 text-orange-700 hover:text-orange-700 dark:text-orange-300 dark:bg-orange-300/10 hover:bg-orange-500/20 dark:hover:bg-orange-300/20',
};

interface ViewMoreButtonProps {
  challenges: Awaited<ExploreChallengeData>;
  moreRoute: string;
}

export function ViewMoreButton({ challenges, moreRoute }: ViewMoreButtonProps) {
  const router = useRouter();
  return (
    <Button
      className={`group items-center whitespace-nowrap rounded-full py-2 pl-4 pr-3 backdrop-blur-sm
  ${BUTTONS_BY_DIFFICULTY[challenges[0]?.difficulty || 'BEGINNER']}`}
      onClick={() => {
        router.push(`/explore/${moreRoute}`);
      }}
      variant="ghost"
    >
      view more
      <ChevronRight className="ml-2 h-4 w-4 stroke-[3] duration-300 group-hover:translate-x-1" />
    </Button>
  );
}
