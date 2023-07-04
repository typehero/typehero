'use client';

import { clsx } from 'clsx';
import { debounce } from 'lodash';
import { Bookmark as BookmarkIcon, Share, ThumbsUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { TypographyH3 } from '~/components/ui/typography/h3';
import type { Challenge } from '.';
import { DifficultyBadge } from '../explore/difficulty-badge';
import { addOrRemoveBookmark } from './bookmark.action';
import { incrementOrDecrementUpvote } from './increment.action';
import { ShareForm } from './share-form';
import { Solutions } from './solutions';

interface Props {
  challenge: NonNullable<Challenge>;
}

export function DescriptionPanel({ challenge }: Props) {
  const router = useRouter();
  const [votes, setVotes] = useState(challenge._count.Vote);
  const [hasVoted, setHasVoted] = useState(challenge.Vote.length > 0);
  const [hasBookmarked, setHasBookmarked] = useState(challenge.Bookmark.length > 0);
  const session = useSession();
  const debouncedSearch = useRef(
    debounce(async (challengeId: number, userId: string, shouldIncrement: boolean) => {
      const votes = await incrementOrDecrementUpvote(challengeId, userId, shouldIncrement);
      if (votes !== undefined && votes !== null) {
        setVotes(votes);
      }

      router.refresh();
    }, 500),
  ).current;

  const debouncedBookmark = useRef(
    debounce(async (challengeId: number, userId: string, shouldBookmark: boolean) => {
      try {
        await addOrRemoveBookmark(challengeId, userId, shouldBookmark);
        setHasBookmarked(shouldBookmark);
        router.refresh();
      } catch (e) {
        console.error(e);
        // it errored so reverse the intended changes
        setHasBookmarked(!shouldBookmark);
      }
    }, 500),
  ).current;

  return (
    <>
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="sticky top-0 grid w-full grid-cols-2 rounded-xl bg-neutral-200 bg-opacity-70 backdrop-blur-md dark:bg-muted">
          <TabsTrigger className="rounded-lg" value="description">
            Description
          </TabsTrigger>
          <TabsTrigger className="rounded-lg" value="solutions">
            Solutions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0">
          <div className="h-full px-1 pb-0 pt-3 dark:px-4 dark:pb-2">
            <TypographyH3 className="mb-2 font-medium">{challenge.name}</TypographyH3>
            <div className="mb-6 flex items-center gap-4">
              <DifficultyBadge difficulty={challenge.difficulty} />

              <TooltipProvider>
                <Tooltip delayDuration={0.05} open={session?.data?.user?.id ? false : undefined}>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="ghost"
                        className="p-1"
                        disabled={!session?.data?.user?.id}
                        onClick={(): void => {
                          let shouldBookmark = false;
                          if (hasBookmarked) {
                            shouldBookmark = false;
                            setHasBookmarked(false);
                          } else {
                            shouldBookmark = true;
                            setHasBookmarked(true);
                          }
                          debouncedBookmark(
                            challenge.id,
                            session?.data?.user?.id as string,
                            shouldBookmark,
                          )?.catch((e) => {
                            console.error(e);
                          });
                        }}
                      >
                        <BookmarkIcon
                          size={20}
                          className={clsx(
                            {
                              'fill-blue-500 stroke-blue-500': hasBookmarked,
                              'stroke-gray-500': !hasBookmarked,
                            },
                            'hover:stroke-gray-400',
                          )}
                        />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Login to Bookmark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger>
                  <Button variant="ghost" className="p-1">
                    <Share size={20} className="stroke-gray-500 hover:stroke-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[200px]">
                  <DialogHeader>
                    <DialogTitle>Share this challenege</DialogTitle>
                    <div className="pt-4">
                      <ShareForm />
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <TooltipProvider>
                <Tooltip delayDuration={0.05} open={session?.data?.user?.id ? false : undefined}>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        className="group -ml-1 w-14 gap-2 rounded-lg p-1"
                        variant="ghost"
                        disabled={!session?.data?.user?.id}
                        onClick={(): void => {
                          let shouldIncrement = false;
                          if (hasVoted) {
                            setVotes((v) => v - 1);
                            shouldIncrement = false;
                            setHasVoted(false);
                          } else {
                            setVotes((v) => v + 1);
                            shouldIncrement = true;
                            setHasVoted(true);
                          }
                          debouncedSearch(
                            challenge.id,
                            session?.data?.user?.id as string,
                            shouldIncrement,
                          )?.catch((e) => {
                            console.error(e);
                          });
                        }}
                      >
                        <ThumbsUp
                          size={20}
                          className={clsx(
                            {
                              'fill-emerald-600 stroke-emerald-600 group-hover:stroke-emerald-500 dark:fill-emerald-400 dark:stroke-emerald-400':
                                hasVoted,
                              'stroke-zinc-500': !hasVoted,
                            },
                            'duration-300 group-hover:stroke-zinc-400',
                          )}
                        />
                        <span
                          className={clsx(
                            {
                              'text-emerald-600 dark:text-emerald-400': hasVoted,
                              'text-zinc-500 group-hover:text-zinc-400': !hasVoted,
                            },
                            'self-end text-lg duration-300',
                          )}
                        >
                          {votes}
                        </span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Login to Upvote</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="prose-invert leading-8 prose-h3:text-xl">
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
                {challenge?.description}
              </ReactMarkdown>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="solutions">
          <Solutions challenge={challenge} />
        </TabsContent>
      </Tabs>
    </>
  );
}
