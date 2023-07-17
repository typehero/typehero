'use client';

import { clsx } from 'clsx';
import { debounce } from 'lodash';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { useForm } from 'react-hook-form';

import { Bookmark as BookmarkIcon, Share, ThumbsUp } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { UserBadge } from '~/components/ui/user-badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { TypographyH3 } from '~/components/ui/typography/h3';
import { DifficultyBadge } from '~/components/ui/difficulty-badge';
import { ActionMenu } from '~/components/ui/action-menu';
import { Checkbox } from '~/components/ui/checkbox';
import { Form, FormField, FormItem } from '~/components/ui/form';
import { Markdown } from '~/components/ui/markdown';
import { Textarea } from '~/components/ui/textarea';
import { TypographyLarge } from '~/components/ui/typography/large';
import { ShareForm } from '../share-form';

import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { toast } from '~/components/ui/use-toast';
import { addOrRemoveBookmark } from '../bookmark.action';
import { incrementOrDecrementUpvote } from '../increment.action';
import { addChallengeReport } from '../report.action';
import { getRelativeTime } from '~/utils/relativeTime';

interface Props {
  challenge: ChallengeRouteData;
}

export type FormValues = {
  comments: string;
  examples: boolean;
  derogatory: boolean;
  other: boolean;
};

export function Description({ challenge }: Props) {
  const router = useRouter();
  const [votes, setVotes] = useState(challenge._count.vote);
  const [hasVoted, setHasVoted] = useState(challenge.vote.length > 0);
  const [hasBookmarked, setHasBookmarked] = useState(challenge.bookmark.length > 0);
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
      } catch (e) {
        console.error(e);
        // it errored so reverse the intended changes
        setHasBookmarked(!shouldBookmark);
      }
    }, 500),
  ).current;

  const form = useForm<FormValues>({
    defaultValues: {
      comments: '',
      other: false,
      examples: false,
      derogatory: false,
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const response = await addChallengeReport(
        challenge.id,
        session?.data?.user?.id as string,
        data,
      );
      if (response === 'created') {
        toast({
          title: 'Feedback Sent',
          variant: 'success',
          description: (
            <p>
              Thank you for submitting this feedback. Someone from our moderator team will be
              reviewing it shortly.
            </p>
          ),
        });
      } else if (response === 'report_already_made') {
        toast({
          title: 'Report already made',
          description: (
            <p>
              You have already made a report about this challenge. We are still reviewing the
              question.
            </p>
          ),
        });
      } else if (response === 'not_logged_in') {
        toast({
          title: 'You are not loggeed in',
          description: <p>Please log in to make this report.</p>,
        });
      }
    } catch (e) {
      toast({
        title: 'Something went wrong.',
        variant: 'destructive',
        description: <p>An error was encountered while trying to make a report.</p>,
      });
    }
  }
  return (
    <div className="px-4 py-3">
      {/* NOTE: collapse this element */}
      <div className="flex items-center gap-4">
        <TypographyH3 className="mb-2 mr-auto max-w-[75%] items-center truncate text-2xl font-bold">
          {challenge.name}
        </TypographyH3>
        {/* TODO: split this mess into components, make buttons have bigger horizontal padding and decrease the gap value on container above */}
        <TooltipProvider>
          <Tooltip delayDuration={0.05} open={session?.data?.user?.id ? false : undefined}>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="ghost"
                  className="p-1"
                  disabled={!session?.data?.user?.id}
                  onClick={() => {
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
                    className={clsx(
                      {
                        'fill-blue-500 stroke-blue-500': hasBookmarked,
                        'stroke-zinc-500': !hasBookmarked,
                      },
                      'h-4 w-4 hover:stroke-zinc-400',
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
            <Share className="h-4 w-4 stroke-zinc-500 hover:stroke-zinc-400" />
          </DialogTrigger>
          <DialogContent className="w-[200px]">
            <DialogHeader>
              <DialogTitle>Share this challenge</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <ShareForm />
            </div>
          </DialogContent>
        </Dialog>
        <Tooltip delayDuration={0.05} open={session?.data?.user?.id ? false : undefined}>
          <TooltipTrigger asChild>
            <span>
              <Button
                className="group gap-2 rounded-xl px-2 py-1"
                variant="ghost"
                disabled={!session?.data?.user?.id}
                onClick={() => {
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
                  className={clsx(
                    {
                      'fill-emerald-600 stroke-emerald-600 group-hover:stroke-emerald-400 dark:fill-emerald-400 dark:stroke-emerald-400':
                        hasVoted,
                      'stroke-zinc-500 group-hover:stroke-zinc-400': !hasVoted,
                    },
                    'h-4 w-4 duration-200 group-hover:scale-105 group-active:scale-95 group-active:duration-75',
                  )}
                />
                <span
                  className={clsx(
                    {
                      'text-emerald-600 dark:text-emerald-400': hasVoted,
                      'text-zinc-500 group-hover:text-zinc-400': !hasVoted,
                    },
                    'my-auto w-4 self-end duration-300',
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
        <Dialog>
          <DialogTrigger>
            <ActionMenu
              items={[
                {
                  key: 'feedback',
                  label: 'Feedback',
                  icon: 'Flag',
                },
              ]}
              onChange={() => {
                // do nothing
              }}
            />
          </DialogTrigger>

          <DialogContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Feedback: {challenge.name}</DialogTitle>
                </DialogHeader>

                <div className="my-4 flex flex-col gap-4">
                  <TypographyLarge>Issues Encountered</TypographyLarge>
                  <FormField
                    name="examples"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <Checkbox
                            id="examples"
                            checked={field.value as boolean}
                            onChange={field.onChange}
                            onCheckedChange={field.onChange}
                          />
                          <label htmlFor="examples">
                            Description or examples are unclear or incorrect
                          </label>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="derogatory"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <Checkbox
                            id="derogatory"
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                          <label htmlFor="derogatory">Racist or other derogatory statement</label>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="other"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-4">
                          <Checkbox
                            id="other"
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                          <label htmlFor="other">Other</label>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <TypographyLarge>Comments</TypographyLarge>
                        <Textarea value={field.value as string} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <DialogPrimitive.Close asChild>
                    <Button type="submit">Report</Button>
                  </DialogPrimitive.Close>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <DifficultyBadge difficulty={challenge.difficulty} />
        <UserBadge username={challenge.user.name} />
        <span className="-ml-1 text-xs text-muted-foreground">
          {getRelativeTime(challenge.updatedAt)}
        </span>
      </div>
      <div className="prose-invert leading-8 prose-h3:text-xl">
        <Markdown>{challenge.description}</Markdown>
      </div>
    </div>
  );
}
