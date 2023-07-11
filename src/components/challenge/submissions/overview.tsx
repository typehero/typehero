import { Copy, X } from 'lucide-react';
import Link from 'next/link';

import type { ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { Button } from '~/components/ui/button';
import { Markdown } from '~/components/ui/markdown';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { toast } from '~/components/ui/use-toast';
import { getRelativeTime } from '~/utils/relativeTime';

interface Props {
  challenge: ChallengeRouteData;
  submissionId: string;
}
const codifyForMarkdown = (code: string) => {
  return `\`\`\`ts
${code} \`\`\``;
};
export function SubmissionOverview({ challenge, submissionId }: Props) {
  const submission = challenge.solution?.find((submission) => submission.id === +submissionId);
  const code = codifyForMarkdown(submission?.code.trimStart() ?? '');

  const copyToClipboard = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(submission?.code ?? '').catch(console.error);
      toast({
        variant: 'success',
        description: 'Copied!',
      });
    }
  };

  if (!submission) return null;

  return (
    <>
      <div className="sticky top-0 flex h-[40px] items-center justify-between border-b border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
        <Link href={`/challenge/${challenge.id}/submissions`}>
          <X size={20} className="stroke-gray-500 hover:stroke-gray-400" />
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={copyToClipboard}>
                <Copy size={20} className="stroke-gray-500 hover:stroke-gray-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="p-2">
        <div className="mb-5">
          <div
            className={`inline-block rounded-xl px-4 py-1 ${
              submission.isSuccessful
                ? 'bg-emerald-600/10 text-emerald-600  dark:bg-emerald-400/10 dark:text-emerald-400 '
                : 'bg-rose-600/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400 '
            }`}
          >
            {submission?.isSuccessful ? 'Accepted' : 'Rejected'}
          </div>
          <div className="text-sm text-neutral-500">{getRelativeTime(submission.createdAt)}</div>
        </div>
        <Markdown>{code}</Markdown>
      </div>
    </>
  );
}
