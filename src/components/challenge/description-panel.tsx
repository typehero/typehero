'use client';

import type { Bookmark, Challenge, Vote } from '@prisma/client';
import { clsx } from 'clsx';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { debounce } from 'lodash';
import { Bookmark as BookmarkIcon, Share, ThumbsUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { incrementOrDecrementUpvote } from './increment.action';
import { TypographyH3 } from '../ui/typography/h3';
import { DifficultyBadge } from '../explore/difficulty-badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ShareForm } from './share-form';
import { addOrRemoveBookmark } from './bookmark.action';

interface Props {
  challenge: Challenge & {
    Vote: Vote[];
    Bookmark: Bookmark[];
    _count: {
      Vote: number;
    };
  };
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
    <div className="flex-1 overflow-y-auto rounded-md bg-white dark:bg-zinc-800">
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
              <Button
                className="gap-2 p-1"
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
                      'fill-green-700 stroke-green-700': hasVoted,
                      'stroke-gray-500': !hasVoted,
                    },
                    'hover:stroke-gray-400',
                  )}
                />
                <span className="self-end text-lg text-gray-500">{votes}</span>
              </Button>
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
              <Dialog>
                <DialogTrigger>
                  <Share size={20} className="stroke-gray-500 hover:stroke-gray-400" />
                </DialogTrigger>
                <DialogContent className="w-[200px]">
                  <DialogHeader>
                    <DialogTitle>Share this challenege</DialogTitle>
                    <div className="py-4">
                      <ShareForm />
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
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
