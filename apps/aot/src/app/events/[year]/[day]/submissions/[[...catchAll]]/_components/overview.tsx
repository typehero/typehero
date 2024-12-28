import { Button } from '@repo/ui/components/button';
import { Markdown } from '@repo/ui/components/markdown';
import { Bluesky, CheckCircle2, Trophy, Twitter, X, XCircle } from '@repo/ui/icons';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getRelativeTimeStrict } from '~/utils/relativeTime';
import { getChallengeSubmissionById } from '../getChallengeSubmissions';

interface SubmissionOverviewProps {
  submissionId: string;
  userId: string;
}
const codifyForMarkdown = (code: string) => {
  return `\`\`\`ts
${code}`;
};

export function SubmissionOverview({ submissionId, userId }: SubmissionOverviewProps) {
  const { year, day } = useParams();
  const { data: submission } = useQuery({
    queryKey: [`submission`, submissionId, 'userId', userId],
    queryFn: () => getChallengeSubmissionById(submissionId, userId),
  });

  const code = codifyForMarkdown(submission?.code.trimStart() ?? '');

  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `I've completed ${submission?.challenge.name} - Advent of TypeScript ${year}`,
  )}&url=https://adventofts.com/events/${year}/${day}&hashtags=AdventOfTypescript`;

  const skeet = `https://bsky.app/intent/compose?text=${encodeURIComponent(
    `I've completed ${submission?.challenge.name} - Advent of TypeScript ${year} https://adventofts.com/events/${year}/${day}`,
  )}`;

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
        <Link href={`/events/${year}/${day}/submissions`}>
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
        </div>
        <div className="mb-3 px-3">
          <Markdown>{code}</Markdown>
        </div>
        <div className="mb-3 flex gap-2 px-3">
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
          <Button
            asChild
            className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
            variant="outline"
          >
            <a target="_blank" rel="noreferrer" className="gap-1 md:inline-flex" href={skeet}>
              <Bluesky className="h-4 w-4" />
              Share on Bluesky
            </a>
          </Button>
          <Button
            asChild
            className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
            variant="outline"
          >
            <Link href={`/events/${year}/leaderboard/${day}`} className="gap-1 md:inline-flex">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </Link>
          </Button>
          <Button asChild variant="outline" className="fancy-border-gradient relative border-none">
            <Link href={`/events/${year}`}>Back to Advent of TypeScript</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
