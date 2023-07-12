'use client';
import { Calendar, MessageCircle, Share, X } from 'lucide-react';
import Link from 'next/link';
import type { SolutionData } from '~/app/challenge/[id]/solutions/[solutionId]/page';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Markdown } from '~/components/ui/markdown';
import { TypographyLarge } from '~/components/ui/typography/large';
import { toast } from '~/components/ui/use-toast';
import { UserBadge } from '~/components/ui/user-badge';

interface Props {
  solution: SolutionData;
}
export function SolutionDetails({ solution }: Props) {
  const url = window.location.href;
  const handleShareClick = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      toast({
        variant: 'success',
        description: 'Link To Solution Copied!',
      });
    }
  };

  const handleCommentClick = () => {
    console.log('something');
  };

  return (
    <div className="relative flex h-full flex-col">
      <div className="sticky right-0 top-[41px] flex border-b border-zinc-300 bg-background/90 p-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
        <Link href={`/challenge/${solution.challengeId}/solutions`}>
          <X size={20} className="stroke-gray-500 hover:stroke-gray-400" />
        </Link>
      </div>
      <div className="flex-1 px-4 py-3">
        <div className="mb-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={solution.user?.image ?? ''} alt="github profile picture" />
              <AvatarFallback>{solution.user?.name}</AvatarFallback>
            </Avatar>
            <TypographyLarge>{solution.title}</TypographyLarge>
          </div>
          <div className="flex items-center gap-4">
            <UserBadge username={solution.user?.name ?? ''} />
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 stroke-gray-400" />
              <span className="text-xs text-gray-400">{solution.createdAt.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <Markdown>{solution.description}</Markdown>
      </div>
      <div className="sticky bottom-0 -mx-[1px] overflow-hidden rounded-xl border border-zinc-300 border-b-background bg-background/90 shadow-[0_0_3rem_-0.25rem_#0004] backdrop-blur-sm duration-300 dark:border-zinc-700 dark:border-b-muted dark:bg-muted/90 dark:shadow-[0_0_3rem_-0.25rem_#0008]"></div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={handleCommentClick}
          className="group text-gray-500 group-hover:text-gray-400"
        >
          <MessageCircle className="mr-2 h-4 w-4 stroke-gray-500 group-hover:stroke-gray-400" />{' '}
          Comments
        </Button>
        <Button
          variant="ghost"
          onClick={handleShareClick}
          className="group text-gray-500 group-hover:text-gray-400"
        >
          <Share className="mr-2 h-4 w-4 stroke-gray-500 group-hover:stroke-gray-400" /> Share
        </Button>
      </div>
    </div>
  );
}
