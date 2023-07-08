'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { MessageCircle, Play } from 'lucide-react';
import * as React from 'react';
import { cn } from '~/utils/cn';
import { TypographyP } from '../ui/paragraph';
import { TypographyH3 } from '../ui/typography/h3';
import type { Challenge } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { getRelativeTime } from '~/utils/relativeTime';

const cardVariants = cva('card border-2 rounded-xl @container/card dark:bg-gray-900', {
  variants: {
    variant: {
      BEGINNER: 'border-pink-300 hover:shadow-lg dark:hover:shadow-pink-400/30',
      EASY: 'border-green-500 hover:shadow-lg dark:hover:shadow-green-500/40',
      MEDIUM: 'border-yellow-400 hover:shadow-lg dark:hover:shadow-yellow-300/50',
      HARD: 'border-red-600 hover:shadow-lg dark:hover:shadow-red-500/40',
      EXTREME: 'border-orange-400 hover:shadow-lg dark:hover:shadow-orange-300/50',
    },
  },
  defaultVariants: {
    variant: 'BEGINNER',
  },
});

const headerVariants = cva('relative rounded-t-xl bg-gradient-to-b p-6 pb-12', {
  variants: {
    variant: {
      BEGINNER: 'dark:bg-pink-400 dark:text-gray-800 dark:from-pink-700/40 dark:to-pink-300/50',
      EASY: 'dark:bg-green-500 dark:from-green-800/60 dark:to-green-600',
      MEDIUM: 'dark:bg-yellow-400 dark:text-gray-800 dark:from-yellow-700/60 dark:to-yellow-400',
      EXTREME: 'dark:bg-orange-400 dark:from-orange-700/60 dark:to-orange-400',
      HARD: 'dark:bg-red-600 dark:from-red-800/50 dark:to-red-500',
    },
  },
  defaultVariants: {
    variant: 'BEGINNER',
  },
});

const actionButton = cva('rounded-full p-4 hover:shadow hover:outline', {
  variants: {
    variant: {
      BEGINNER: 'dark:bg-pink-400 dark:shadow-pink-300',
      EASY: 'dark:bg-green-600 dark:shadow-green-400 dark:hover:outline-green-800',
      MEDIUM: 'dark:bg-yellow-400',
      HARD: 'dark:bg-red-500 dark:shadow-red-300 dark:hover:outline-red-800',
      EXTREME:
        'dark:bg-orange-400 dark:hover:outline-orange-700/70 dark:hover:shadow-orange-800/70',
    },
  },
  defaultVariants: {
    variant: 'BEGINNER',
  },
});

export interface CardProps extends VariantProps<typeof cardVariants> {
  title: string;
  content: React.ReactNode;
  // children: React.ReactNode | React.ReactNode[] | undefined;
  challenge: Challenge & {
    _count: {
      vote: number;
      comment: number;
      solution: number;
    };
  };
}

export default function Card({ challenge, variant }: CardProps) {
  const router = useRouter();

  return (
    <div className={cn(cardVariants({ variant: variant }), '')}>
      <header className={headerVariants({ variant: variant })}>
        <TypographyH3>{challenge.name}</TypographyH3>
        <p className="capitalize">{challenge.difficulty.toLowerCase()}</p>
        <p>{getRelativeTime(challenge.updatedAt)}</p>
        <section className="absolute bottom-0 right-6 translate-y-1/2 ">
          <button
            className={actionButton({ variant: variant })}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/challenge/${challenge.id}`);
            }}
          >
            <Play size={36} />
          </button>
        </section>
      </header>
      <section className="flex flex-col gap-6 px-6 pb-6 pt-8 shadow-inner">
        <div className="flex justify-start gap-6">
          <div className="flex flex-col items-center">
            <TypographyH3>{challenge._count.solution}</TypographyH3>
            <TypographyP>Solutions</TypographyP>
          </div>
          <div className="flex flex-col items-center">
            <TypographyH3>
              <div className="flex items-center gap-4">
                <MessageCircle size={28} />
                <TypographyH3>{challenge._count.comment}</TypographyH3>
              </div>
            </TypographyH3>
            <TypographyP>Comments</TypographyP>
          </div>
        </div>
        <p>{challenge.shortDescription}</p>
      </section>
    </div>
  );
}
