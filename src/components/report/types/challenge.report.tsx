import { ThumbsUp } from 'lucide-react';
import { type ReportWithInfo } from '~/app/admin/report/[id]/report.action';
import { getChallenge } from '~/components/admin/admin.actions';
import { CodeEditor } from '~/components/ui/code-editor';

import { Markdown } from '~/components/ui/markdown';
import Text from '~/components/ui/typography/typography';
import { UserBadge } from '~/components/ui/user-badge';
export interface ChallengeReportProps {
  report: NonNullable<ReportWithInfo>;
}
export default async function ChallengeReport({ report }: ChallengeReportProps) {
  if (!report.challenge || !report.challengeId) return null;
  const challengeInfo = await getChallenge(report.challengeId);
  return (
    <section className="mt-6 flex flex-grow flex-col gap-4 overflow-auto md:flex-nowrap">
      <div className="w-full rounded-lg p-4 dark:bg-muted/90">
        <Text intent="h3">{report.challenge.name}</Text>
        <Text className="mt-2">
          Created at:{' '}
          {report.challenge.createdAt.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'medium',
          })}
        </Text>
        <Text intent="body">
          Last updated on:{' '}
          {report.challenge.updatedAt.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'medium',
          })}
        </Text>
        <UserBadge username={report.challenge.user.name || 'No author found'} />
        <div className="my-2 flex gap-4">
          <ThumbsUp /> {challengeInfo._count.vote}
        </div>
        <Markdown className="mt-4">{report.challenge.description}</Markdown>
      </div>
      <CodeEditor value={report.challenge.prompt} height={'50vh'} />
    </section>
  );
}
