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
import { DifficultyBadge } from '~/components/explore/difficulty-badge';
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
        router.refresh();
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
    <>
      <div className="flex items-baseline justify-between">
        <TypographyH3 className="mb-2 flex items-center gap-2 font-medium">
          {challenge.name}
        </TypographyH3>
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

      <div className="mb-6 flex items-center gap-2">
        <UserBadge username={challenge.user.name} />
        <DifficultyBadge difficulty={challenge.difficulty} />

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
            <Share size={20} className="stroke-gray-500 hover:stroke-gray-400" />
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
                className="group -ml-1 w-14 gap-2 rounded-lg p-1"
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
      </div>
      <div className="prose-invert leading-8 prose-h3:text-xl">
        <Markdown>{challenge.description}</Markdown>
      </div>
    </>
  );
}
