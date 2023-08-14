'use client';

import { Calendar, Flag, Share, X } from '@repo/ui/icons';
import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  TypographyLarge,
  toast,
  UserBadge,
  ActionMenu,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@repo/ui';
import { Comments } from '../comments';
import { Markdown } from '~/components/ui/markdown';
import { ReportDialog } from '~/components/report';
import type { ChallengeSolution } from '~/app/challenge/[id]/solutions/[solutionId]/page';

interface Props {
  solution: ChallengeSolution;
}
export function SolutionDetails({ solution }: Props) {
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
        <div className="bg-background/90 dark:bg-muted/90 sticky right-0 top-0 flex w-full border-b border-zinc-300 p-2 backdrop-blur-sm dark:border-zinc-700">
          <Link href={`/challenge/${solution.challengeId}/solutions`}>
            <X className="stroke-gray-500 hover:stroke-gray-400" size={20} />
          </Link>
        </div>
        <div className="custom-scrollable-element flex-1 overflow-y-auto px-4 py-3">
          <div className="mb-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage alt="github profile picture" src={solution.user?.image ?? ''} />
                  <AvatarFallback>{solution.user?.name}</AvatarFallback>
                </Avatar>
                <TypographyLarge>{solution.title}</TypographyLarge>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="group p-0 text-gray-500 group-hover:text-gray-400"
                      onClick={handleShareClick}
                      variant="ghost"
                    >
                      <Share className="mr-2 h-4 w-4 stroke-gray-500 group-hover:stroke-gray-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share challenge</p>
                  </TooltipContent>
                </Tooltip>
                <ReportDialog reportType="SOLUTION" solutionId={solution.id!}>
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
            <div className="flex items-center gap-4">
              <UserBadge username={solution.user?.name ?? ''} linkComponent={Link} />
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 stroke-gray-400" />
                <span className="text-xs text-gray-400">
                  {solution.createdAt?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <Markdown>{solution.description || ''}</Markdown>
        </div>
      </div>
      <Comments rootId={solution.id!} type="SOLUTION" />
    </div>
  );
}
