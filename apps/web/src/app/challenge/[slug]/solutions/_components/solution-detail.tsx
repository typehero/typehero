'use client';

import { useSession } from '@repo/auth/react';
import { ActionMenu } from '@repo/ui/components/action-menu';
import { Button } from '@repo/ui/components/button';
import { Markdown } from '@repo/ui/components/markdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { TypographyLarge } from '@repo/ui/components/typography/large';
import { toast } from '@repo/ui/components/use-toast';
import { UserAvatar } from '@repo/ui/components/user-avatar';
import { ArrowLeft, Calendar, Flag, Pencil, Pin, Share, Trash } from '@repo/ui/icons';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import type { ChallengeSolution } from '~/app/challenge/[slug]/solutions/[solutionId]/page';
import { UserBadge } from '~/app/challenge/_components/comments/enhanced-user-badge';
import { ReportDialog } from '~/components/ReportDialog';
import { isAdminOrModerator, isAuthor } from '~/utils/auth-guards';
import { getRelativeTimeStrict } from '~/utils/relativeTime';
import { Vote } from '../../../_components/vote';
import { pinOrUnpinSolution } from './_actions';
import { SolutionDeleteDialog } from './delete';
import { EditSolution } from './edit-solution';
import { useGetQueryString } from './useGetQueryString';

interface SolutionDetailsProps {
  solution: ChallengeSolution;
}

export function SolutionDetails({ solution }: SolutionDetailsProps) {
  const { slug } = useParams();
  const { data: session } = useSession();
  const showPin = isAdminOrModerator(session);
  const [isEditing, setIsEditing] = useState(false);
  const queryString = useGetQueryString();
  const queryClient = useQueryClient();

  const handlePinClick = async () => {
    await pinOrUnpinSolution(solution.id, !solution.isPinned, slug as string);
    queryClient.invalidateQueries({
      queryKey: ['challenge-solutions', slug],
    });
  };
  const handleShareClick = async () => {
    if (navigator.clipboard) {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({
        variant: 'success',
        description: 'Link To Solution Copied!',
      });
    }
  };
  return (
    <div className="relative h-full">
      <div className="relative flex h-full flex-col">
        <div className="custom-scrollable-element flex-1 overflow-y-auto px-4 pb-16 pt-3">
          <div className="mb-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Link href={`/challenge/${slug}/solutions?${queryString}`} className="h-7 w-7">
                <div className="rounded-full p-1 hover:bg-gray-200 hover:bg-opacity-10">
                  <ArrowLeft className="stroke-gray-500" size={20} />
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <UserAvatar src={solution.user?.image ?? ''} />
                <TypographyLarge>{solution.title}</TypographyLarge>
              </div>
              <div className="flex items-center gap-2">
                <ReportDialog reportType="SOLUTION" solutionId={solution.id}>
                  <ActionMenu
                    items={[
                      {
                        key: 'report',
                        label: 'Report',
                        icon: Flag,
                      },
                    ]}
                    onChange={() => {
                      // do nothing
                    }}
                  />
                </ReportDialog>
              </div>
            </div>
            {/* Author, Time, Action Buttons */}
            <div className="flex items-center gap-4">
              <UserBadge
                user={{
                  name: solution.user?.name ?? '',
                  image: solution.user?.image ?? '',
                  bio: solution.user?.bio ?? '',
                  roles: solution.user?.roles ?? [],
                }}
              />
              <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">{getRelativeTimeStrict(solution.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Vote
                challengeSlug={solution.challenge?.slug ?? ''}
                // TODO: Is this guaranteed to exist, or is userId actually optional?
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                toUserId={solution.user?.id!}
                voteCount={solution._count.vote}
                initialHasVoted={solution.vote.length > 0}
                disabled={!session?.user?.id || solution.userId === session?.user?.id}
                rootType="SHAREDSOLUTION"
                rootId={solution.id}
                onVote={(didUpvote: boolean) => {
                  solution.vote = didUpvote
                    ? [
                        {
                          userId: session?.user?.id ?? '',
                        },
                      ]
                    : [];
                  solution._count.vote += didUpvote ? 1 : -1;
                }}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleShareClick} variant="secondary" size="xs">
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
              {showPin ? (
                <Button
                  onClick={handlePinClick}
                  variant="secondary"
                  size="xs"
                  className={clsx(
                    'gap-2 border border-transparent [&:not(:disabled)]:hover:border-emerald-600  [&:not(:disabled)]:hover:text-emerald-600',
                    {
                      'border-emerald-600 text-emerald-600': solution.isPinned,
                    },
                  )}
                >
                  <Pin className={clsx('h-4 w-4')} />
                </Button>
              ) : null}

              {isAuthor(session, solution.userId) || isAdminOrModerator(session) ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant="secondary"
                        size="xs"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                  <SolutionDeleteDialog solution={solution} slug={slug}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="secondary" size="xs">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </SolutionDeleteDialog>
                </>
              ) : null}
            </div>
          </div>
          {!isEditing && (
            <div className="prose-invert prose-h3:text-xl mt-6 leading-7">
              <Markdown>{solution.description || ''}</Markdown>{' '}
            </div>
          )}
          {isEditing ? <EditSolution solution={solution} setIsEditing={setIsEditing} /> : null}
        </div>
      </div>
    </div>
  );
}
