'use server';

// import { Comment } from '~/app/challenge/_components/comments/comment';
import { Text } from '@repo/ui/components/typography/typography';
import { Markdown } from '@repo/ui/components/markdown';
import { Expandable } from '@repo/ui/components/expandable';
import { getReportedUserInformation, type ReportWithInfo } from '../../report.action';

interface UserReportProps {
  report: NonNullable<ReportWithInfo>;
}

export async function UserReport({ report }: UserReportProps) {
  if (!report.userId) return null;
  const userInfo = await getReportedUserInformation(report.userId);
  const commentRootId = report.comment?.rootChallengeId ?? report.comment?.rootSolutionId ?? -1;

  return (
    <div>
      <Text intent="h3">
        Most Recent Comments <small>(10)</small>
      </Text>

      <div className="mt-4 flex flex-col gap-4">
        {userInfo?.comment
          ? userInfo.comment.map((comment) => (
              <div
                className="rounded border border-zinc-700 bg-zinc-800 p-2"
                key={`comment-${comment.id}`}
              >
                {/*
                <Comment
                  comment={comment}
                  readonly
                  rootId={commentRootId}
                  type={comment.rootType}
                />
              */}
                <pre>{JSON.stringify(comment, null, 2)}</pre>
              </div>
            ))
          : null}

        {userInfo?.comment.length === 0 ? (
          <div className="mb-6 flex justify-center">No comments on record</div>
        ) : null}
      </div>

      <Text className="mt-4" intent="h3">
        Most Recent challenges <small>(5)</small>{' '}
      </Text>

      <div className="mt-4 flex flex-col gap-4">
        {userInfo?.challenge.length === 0 ? (
          <div className="text-center">No recent challenges.</div>
        ) : null}
        {userInfo?.challenge.map((ch, i) => (
          <Expandable
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
            key={`challenge-${ch.id}`}
            open={i === 0}
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

      <Text className="my-4" intent="h3">
        Most recent solutions <small>(5)</small>
      </Text>

      {userInfo?.sharedSolution ? (
        <div className="flex flex-col gap-4">
          {userInfo.sharedSolution.map((f) => (
            <div
              className="text:primary-foreground rounded-xl border bg-zinc-800 p-4"
              key={`solution-${f.id}`}
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
      ) : null}

      {userInfo?.sharedSolution.length === 0 && <div className="mb-6">No solutions on record</div>}
    </div>
  );
}
