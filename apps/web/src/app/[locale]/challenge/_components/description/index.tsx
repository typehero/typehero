import { Calendar, CheckCircle } from '@repo/ui/icons';
import Link from 'next/link';
import { type ChallengeRouteData } from '~/app/[locale]/challenge/[slug]/getChallengeRouteData';
import { getRelativeTime } from '~/utils/relativeTime';
import { ShareForm } from '../share-form';
import { TypographyH3 } from '@repo/ui/components/typography/h3';
import { UserBadge } from '@repo/ui/components/user-badge';
import { DifficultyBadge } from '@repo/ui/components/difficulty-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { Markdown } from '@repo/ui/components/markdown';
import { BookmarkTooltip } from './bookmark';
import { Report } from './report';
import { ShareTooltip } from './share';
import { auth } from '@repo/auth/server';
import { Vote } from '../vote';

export interface ChallengeProps {
  challenge: ChallengeRouteData['challenge'];
}

export interface FormValues {
  comments: string;
  examples: boolean;
  derogatory: boolean;
  other: boolean;
}

export async function Description({ challenge }: ChallengeProps) {
  const session = await auth();

  return (
    <div className="custom-scrollable-element h-full overflow-y-auto px-4 pb-36 pt-3">
      <div className="flex items-center">
        <TypographyH3 className="mr-auto max-w-[75%] items-center truncate text-2xl font-bold">
          {challenge.name}
        </TypographyH3>
        <Report challenge={challenge} />
      </div>
      {/* Author & Time */}
      <div className="mt-2 flex items-center gap-4">
        <UserBadge username={challenge.user.name} linkComponent={Link} />
        <div className="text-muted-foreground flex items-center gap-2">
          <Calendar className=" h-4 w-4" />
          <span className="text-xs">Last updated {getRelativeTime(challenge.updatedAt)}</span>
        </div>
      </div>
      {/* Difficulty & Action Buttons */}
      <div className="mt-3 flex items-center gap-3">
        <DifficultyBadge difficulty={challenge.difficulty} />
        {challenge.hasSolved ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <CheckCircle className="stroke-green-600 dark:stroke-green-300" size={20} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Solved</p>
            </TooltipContent>
          </Tooltip>
        ) : null}
        <Vote
          voteCount={challenge._count.vote}
          initialHasVoted={challenge.vote.length > 0}
          disabled={!session?.user?.id}
          rootType="CHALLENGE"
          rootId={challenge?.id}
        />
        <Dialog>
          <DialogTrigger>
            <ShareTooltip />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <ShareForm />
            </div>
          </DialogContent>
        </Dialog>
        <BookmarkTooltip challenge={challenge} />
      </div>
      {/* Challenge Description */}
      <div className="prose-invert prose-h3:text-xl mt-6 leading-7">
        <Markdown>{challenge.description}</Markdown>
      </div>
    </div>
  );
}
