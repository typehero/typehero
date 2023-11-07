import { Button } from '@repo/ui/components/button';
import { Markdown } from '@repo/ui/components/markdown';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { toast } from '@repo/ui/components/use-toast';
import { CheckCircle2, Copy, X, XCircle } from '@repo/ui/icons';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getRelativeTime } from '~/utils/relativeTime';
import { getChallengeSubmissionById } from '../getChallengeSubmissions';
import { useParams, useSearchParams } from 'next/navigation';
import { Suggestions } from './suggestions';

interface Props {
  submissionId: string;
}
const codifyForMarkdown = (code: string) => {
  return `\`\`\`ts
${code}`;
};

export function SubmissionOverview({ submissionId }: Props) {
  const { slug } = useParams();
  const searchParams = useSearchParams();

  const showSuggestions = searchParams.get('success') === 'true';
  const { data: submission } = useQuery({
    queryKey: [`submission`, submissionId],
    queryFn: () => getChallengeSubmissionById(submissionId),
  });

  const code = codifyForMarkdown(submission?.code.trimStart() ?? '');

  const track = searchParams.get('slug');

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
      <div className="sticky top-0 flex h-[40px] items-center justify-between  border-b border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
        <Link href={`/challenge/${slug}/submissions`}>
          <X className="stroke-gray-500 hover:stroke-gray-400" size={20} />
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={copyToClipboard} variant="ghost">
              <Copy className="stroke-gray-500 hover:stroke-gray-400" size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="custom-scrollable-element h-fit overflow-y-scroll p-2">
        <div className="mb-5">
          <div
            className={`flex items-center gap-1 py-1 ${
              submission.isSuccessful
                ? ' text-emerald-600  dark:text-emerald-400 '
                : ' text-rose-600  dark:text-rose-400 '
            }`}
          >
            {submission.isSuccessful ? (
              <CheckCircle2 size={17} className="mb-0.5" />
            ) : (
              <XCircle size={17} className="mb-0.5" />
            )}
            {submission.isSuccessful ? 'Accepted' : 'Rejected'}
          </div>
          <div className="text-sm text-neutral-500">
            Submitted {getRelativeTime(submission.createdAt)}
          </div>
        </div>
        {showSuggestions ? (
          <div className="flex w-full items-start justify-center">
            <Suggestions track={track} challengeId={submission.challengeId} />
          </div>
        ) : null}
        <Markdown>{code}</Markdown>
      </div>
    </>
  );
}
