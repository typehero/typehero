import { Button } from '@repo/ui/components/button';
import { Markdown } from '@repo/ui/components/markdown';
import { CheckCircle2, Plus, Share, Twitter, X, XCircle } from '@repo/ui/icons';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { getRelativeTimeStrict } from '~/utils/relativeTime';
import { getChallengeSubmissionById } from '../getChallengeSubmissions';
import { Suggestions } from './suggestions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { ShareUrl } from '~/components/share-url';
import { BootPromo } from '~/app/_components/boot-promo';

interface SubmissionOverviewProps {
  submissionId: string;
  userId: string;
}
const codifyForMarkdown = (code: string) => {
  return `\`\`\`ts
${code}`;
};

export function SubmissionOverview({ submissionId, userId }: SubmissionOverviewProps) {
  const { slug } = useParams();
  const searchParams = useSearchParams();

  const showSuggestions = searchParams.get('success') === 'true';
  const { data: submission } = useQuery({
    queryKey: [`submission`, submissionId, 'userId', userId],
    queryFn: () => getChallengeSubmissionById(submissionId, userId),
  });

  const code = codifyForMarkdown(submission?.code.trimStart() ?? '');

  const track = searchParams.get('slug');

  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `I've completed ${submission?.challenge.name} on TypeHero!`,
  )}&url=https://typehero.dev/challenge/${slug}`;

  if (!submission) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500 dark:text-zinc-400">
        <p>Submission does not exist</p>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 flex h-[40px] items-center justify-between  border-b border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-[#1e1e1e]">
        <Link href={`/challenge/${slug}/submissions`}>
          <X className="stroke-gray-500 hover:stroke-gray-400" size={20} />
        </Link>
      </div>
      <div className="custom-scrollable-element h-fit overflow-y-scroll p-2">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <div
              className={`flex items-center gap-1 px-3 py-1 text-xl ${
                submission.isSuccessful
                  ? ' text-emerald-600  dark:text-emerald-400 '
                  : ' text-rose-600  dark:text-rose-400 '
              }`}
            >
              {submission.isSuccessful ? (
                <CheckCircle2 size={22} className="mb-0.5" />
              ) : (
                <XCircle size={22} className="mb-0.5" />
              )}
              {submission.isSuccessful ? 'Accepted' : 'Rejected'}
            </div>
            <div className="px-3 text-sm text-neutral-500">
              Submitted {getRelativeTimeStrict(submission.createdAt)}
            </div>
          </div>
          <div>
            <Link
              className="bg-primary flex h-8 items-center gap-1 rounded-lg py-2 pl-2 pr-3 text-sm text-white"
              href={`/challenge/${slug}/solutions`}
            >
              <Plus size={16} /> Share your Solution
            </Link>
          </div>
        </div>
        {showSuggestions ? (
          <div className="flex w-full items-start">
            <Suggestions track={track} challengeId={submission.challengeId} />
          </div>
        ) : null}
        <div className="mb-3 px-3">
          <Markdown>{code}</Markdown>
        </div>
        <div className="mb-9 flex gap-2 px-3">
          <Dialog>
            <DialogTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
                    variant="outline"
                  >
                    <Share className="h-4 w-4" />
                    Share Code on Playground
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Challenge with Code</p>
                </TooltipContent>
              </Tooltip>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share</DialogTitle>
              </DialogHeader>
              <div className="pt-4">
                <ShareUrl
                  isChallenge
                  code={submission.code}
                  desciprtion="Click Copy to Share code on Playground."
                />
              </div>
            </DialogContent>
          </Dialog>
          <Button
            asChild
            className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
            variant="outline"
          >
            <a target="_blank" rel="noreferrer" className="gap-1 md:inline-flex" href={tweet}>
              <Twitter className="h-4 w-4" />
              Share on Twitter
            </a>
          </Button>
        </div>
        <div>
          <BootPromo />
        </div>
      </div>
    </>
  );
}
