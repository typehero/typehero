'use client';

import type { Challenge, Vote } from '@prisma/client';
import { clsx } from 'clsx';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { debounce } from 'lodash';
import { Bookmark, Share, ThumbsUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { incrementOrDecrementUpvote } from './increment.action';
import { TypographyH3 } from '../ui/typography/h3';
import { DifficultyBadge } from '../explore/difficulty-badge';
import { Button } from '../ui/button';

interface Props {
  challenge: Challenge & {
    Vote: Vote[];
    _count: {
      Vote: number;
    };
  };
}
export function DescriptionPanel({ challenge }: Props) {
  const [votes, setVotes] = useState(challenge._count.Vote);
  const [hasVoted, setHasVoted] = useState(challenge.Vote.length > 0);
  const session = useSession();
  const debouncedSearch = useRef(
    debounce(async (challengeId: number, userId: string, shouldIncrement: boolean) => {
      const votes = await incrementOrDecrementUpvote(challengeId, userId, shouldIncrement);
      if (votes !== undefined && votes !== null) {
        setVotes(votes);
      }
    }, 500),
  ).current;

  return (
    <div className="flex-1 rounded-md bg-white dark:bg-zinc-800">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="solutions">Solutions</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0">
          <div className="h-full p-5">
            <TypographyH3 className="mb-2 font-medium">{challenge.name}</TypographyH3>
            <div className="mb-6 flex items-center gap-6">
              <DifficultyBadge difficulty={challenge.difficulty} />
              {session?.data?.user?.id && (
                <Button
                  className="gap-2 p-1"
                  variant="ghost"
                  onClick={(): void => {
                    let shouldIncrement: boolean;
                    if (hasVoted) {
                      setVotes((v) => v - 1);
                      shouldIncrement = false;
                      setHasVoted(false);
                    } else {
                      setVotes((v) => v + 1);
                      shouldIncrement = true;
                      setHasVoted(true);
                    }
                    debouncedSearch(challenge.id, session?.data?.user?.id, shouldIncrement)?.catch(
                      (e) => {
                        console.error(e);
                      },
                    );
                  }}
                >
                  <ThumbsUp
                    size={20}
                    className={clsx({
                      'fill-green-700 stroke-green-700': hasVoted,
                      'stroke-gray-500': !hasVoted,
                    })}
                  />
                  <span className="self-end text-lg text-gray-500">{votes}</span>
                </Button>
              )}
              <Button variant="ghost" className="p-1">
                <Bookmark size={20} className="stroke-gray-500 hover:stroke-gray-400" />
              </Button>
              <Button variant="ghost" className="p-1">
                <Share size={20} className="stroke-gray-500 hover:stroke-gray-400" />
              </Button>
            </div>
            <div className="prose-invert prose-h3:text-xl">
              {/* @ts-ignore */}
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
                        language={match[1]}
                        PreTag="section" // parent tag
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {challenge.description}
              </ReactMarkdown>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="solutions">
          <div className="p-4">solutions</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
