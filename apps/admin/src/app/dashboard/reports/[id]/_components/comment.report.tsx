import { Markdown } from '@repo/ui/components/markdown';
import { ExternalLink } from '@repo/ui/icons';
import Link from 'next/link';
import type { ReportWithInfo } from '../_actions';

export function CommentReport({ report }: { report: NonNullable<ReportWithInfo> }) {
  if (report.type !== 'COMMENT' || report.commentId === null || !report.comment) return null;
  const rootId = report.comment.rootChallengeId ?? report.comment.rootSolutionId ?? -1;

  return (
    <div>
      <header>
        Commented on{' '}
        <Link
          className="inline-flex items-baseline gap-2 rounded-full bg-zinc-800 px-2 py-1 text-blue-600 dark:text-blue-400"
          href={`/${report.comment.rootType.toLowerCase()}/${
            report.comment.rootChallengeId || report.comment.rootSolutionId
          }`}
        >
          <div className="bg-primary-foreground mr-2 inline-block rounded-full px-2 text-white">
            {report.comment.rootType}
          </div>
          {report.comment.rootType === 'CHALLENGE'
            ? report.comment.rootChallenge?.name
            : report.comment.rootSolution?.title}
          <ExternalLink size={16} />
        </Link>
      </header>
      <section className="mt-4 rounded-lg bg-zinc-800 p-4">
        <header className="flex gap-4">
          <div className="font-semibold">@{report.comment.user.name}</div>
          <div>
            {report.comment.createdAt.toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'medium',
            })}
          </div>
        </header>
        <Markdown>{report.comment.text}</Markdown>
        <footer className="text-zinc-400">{report.comment._count.replies} Replies</footer>
      </section>
    </div>
  );
}
