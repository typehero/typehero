'use server';

import { type ReportWithInfo } from '~/app/admin/report/[id]/report.action';
import Comment from '~/components/challenge/comments/comment';
import { Expandable } from '~/components/ui/expandable';
import { Markdown } from '~/components/ui/markdown';
import Text from '~/components/ui/typography/typography';
import { getReportedUserInformation } from '../report.action';

interface UserReportProps {
  report: NonNullable<ReportWithInfo>;
}

export default async function UserReportUi({ report }: UserReportProps) {
  if (!report.userId) return null;
  const userInfo = await getReportedUserInformation(report.userId);
  return (
    <div>
      <Text intent="h3">
        Most Recent Comments <small>(10)</small>
      </Text>

      <div className="mt-4 flex flex-col gap-4">
        {userInfo.comment &&
          userInfo.comment.map((m) => (
            <div key={`comment-${m.id}`} className="rounded border border-zinc-700 bg-zinc-800 p-2">
              <Comment readonly comment={m} />
            </div>
          ))}

        {userInfo.comment && userInfo.comment.length === 0 && (
          <div className="mb-6 flex justify-center">No comments on record</div>
        )}
      </div>

      <Text intent="h3" className="mt-4">
        Most Recent challenges <small>(5)</small>{' '}
      </Text>

      <div className="mt-4 flex flex-col gap-4">
        {userInfo.challenge && userInfo.challenge.length === 0 && (
          <div className="text-center">No recent challenges.</div>
        )}
        {userInfo.challenge &&
          userInfo.challenge.map((ch, i) => (
            <Expandable
              open={i === 0}
              key={`challenge-${ch.id}`}
              className="rounded-xl border border-slate-600 p-3"
              header={
                <header className="flex w-full flex-col items-baseline justify-between gap-4 md:flex-row">
                  <Text intent="h2">{ch.name}</Text>
                  <div className="flex flex-wrap gap-2 text-xs md:flex-nowrap">
                    <div className="rounded-full bg-slate-300 px-3 py-1 text-gray-800">
                      <span className="font-semibold">Created at: </span>
                      {ch.createdAt.toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                    <div className="rounded-full bg-slate-300 px-3 py-1 text-gray-800">
                      <span className="font-semibold">Updated at: </span>
                      {ch.updatedAt.toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </div>
                  </div>
                </header>
              }
            >
              <div className="mt-4 rounded-lg bg-zinc-800 p-4" key={`challenge-${ch.id}`}>
                <section className="mb-4 border-b border-slate-500 pb-4">
                  <div className="font-semibold">Short description</div>
                  <Markdown>{ch.shortDescription}</Markdown>
                </section>
                <Markdown>{ch.description}</Markdown>
              </div>
            </Expandable>
          ))}
      </div>

      <Text intent="h3" className="my-4">
        Most recent solutions <small>(5)</small>
      </Text>

      {userInfo.sharedSolution && (
        <div className="flex flex-col gap-4">
          {userInfo.sharedSolution.map((f) => (
            <div
              key={`solution-${f.id}`}
              className="text:primary-foreground rounded-xl border bg-zinc-800 p-4"
            >
              <header className="flex justify-between">
                <Text intent="h2" weight="bold">
                  {f.title}
                </Text>
                <div>
                  {f.createdAt.toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                  })}
                </div>
              </header>
              <section>
                <Markdown>{f.description}</Markdown>
              </section>
            </div>
          ))}
        </div>
      )}

      {userInfo?.sharedSolution?.length === 0 && <div className="mb-6">No solutions on record</div>}
    </div>
  );
}
