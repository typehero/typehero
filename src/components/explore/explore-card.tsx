'use client';

import { ArrowBigUp } from 'lucide-react';

import { type Challenge } from '.';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DifficultyBadge } from './difficulty-badge';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  challenge: Awaited<Challenge>[0];
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
    'hover:shadow-[0_0_1rem_-0.5rem_#f9a8d4,inset_0_0_1rem_-0.5rem_#f9a8d4] group-focus:shadow-[0_0_1rem_-0.5rem_#f9a8d4,inset_0_0_1rem_-0.5rem_#f9a8d4]',
  EASY: 'hover:shadow-[0_0_1rem_-0.5rem_#86efac,inset_0_0_1rem_-0.5rem_#86efac] group-focus:shadow-[0_0_1rem_-0.5rem_#86efac,inset_0_0_1rem_-0.5rem_#86efac]',
  MEDIUM:
    'hover:shadow-[0_0_1rem_-0.5rem_#fde047,inset_0_0_1rem_-0.5rem_#fde047] group-focus:shadow-[0_0_1rem_-0.5rem_#fde047,inset_0_0_1rem_-0.5rem_#fde047]',
  HARD: 'hover:shadow-[0_0_1rem_-0.5rem_#fca5a5,inset_0_0_1rem_-0.5rem_#fca5a5] group-focus:shadow-[0_0_1rem_-0.5rem_#fca5a5,inset_0_0_1rem_-0.5rem_#fca5a5]',
  EXTREME:
    'hover:shadow-[0_0_1rem_-0.5rem_#fdba74,inset_0_0_1rem_-0.5rem_#fdba74] group-focus:shadow-[0_0_1rem_-0.5rem_#fdba74,inset_0_0_1rem_-0.5rem_#fdba74]',
};

// in miliseconds
const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const rtf = new Intl.RelativeTimeFormat('en', {
  numeric: 'auto',
  // TODO: style: 'short' on 640px - 720px
});

// get relevant time from a date object
const getRelativeTime = (date: Date) => {
  const elapsed = date.getTime() - Date.now();

  for (const [unit, ms] of Object.entries(units)) {
    if (Math.abs(elapsed) > ms || unit === 'second') {
      return rtf.format(Math.round(elapsed / ms), unit as Intl.RelativeTimeFormatUnit);
    }
  }
};

export function ExploreCard({ challenge }: Props) {
  return (
    <Card
      className={`group duration-300 hover:bg-card-hovered group-focus:bg-card-hovered ${
        SHADOWS_BY_DIFFICULTY[challenge.difficulty]
      } ${BORDERS_BY_DIFFICULTY[challenge.difficulty]}`}
    >
      <CardHeader className="grid items-start gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="pb-4">{challenge.name}</CardTitle>
          <CardDescription className="relative h-48 overflow-hidden pb-4">
            <div className="pointer-events-none absolute inset-0 h-full w-full shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card))] duration-300 group-hover:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))] group-focus:shadow-[inset_0_-1.5rem_1rem_-0.5rem_hsl(var(--card-hovered))]" />
            {/* // TODO: we use this in two places and we should just make this shared */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ ...props }) => <p className="mb-4" {...props} />,
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      // @ts-ignore
                      style={vscDarkPlus} // theme
                      className="rounded-xl dark:rounded-md"
                      language={match[1]}
                      PreTag="section" // parent tag
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="rounded-md bg-neutral-200 p-1 font-mono dark:bg-black">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {challenge?.shortDescription}
            </ReactMarkdown>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex">
            <div className="flex items-center">
              <DifficultyBadge difficulty={challenge.difficulty} />
            </div>
            <div className="ml-4 flex items-center">
              <ArrowBigUp /> {challenge._count.Vote}
            </div>
          </div>
          <div>Updated {getRelativeTime(challenge.updatedAt)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
