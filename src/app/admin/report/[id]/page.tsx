import { AlertCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { Markdown } from '~/components/ui/markdown';
import Text from '~/components/ui/typography/typography';
import ReportActions from './actions';
import ChallengeReport from '~/components/report/types/challenge.report';
import CommentReport from '~/components/report/types/comment.report';
import UserReportUi from '~/components/report/types/user.report';
import SolutionReport from '~/components/report/types/solution.report';
import { getReport, type ReportWithInfo } from './report.action';
export interface Props {
  params: {
    id: string;
  };
}

const Report = async function (props: Props) {
  const idNum = Number(props.params.id);
  // Double check that we have a number, redirect out if we don't
  if (isNaN(idNum)) {
    return redirect('/admin');
  }

  const report = await getReport(idNum);

  if (!report) return redirect('/admin');

  let title = '';

  switch (report.type) {
    case 'USER':
      title = 'User Report';
      break;
    case 'CHALLENGE':
      title = 'Challenge Report';
      break;
    case 'COMMENT':
      title = 'Comment Report';
      break;
    case 'SOLUTION':
      title = 'Solution Report';
      break;
  }

  const ReportEl = (report: NonNullable<ReportWithInfo>) => {
    switch (report.type) {
      case 'CHALLENGE':
        return <ChallengeReport report={report} />;
      case 'COMMENT':
        return <CommentReport report={report} />;
      case 'SOLUTION':
        return <SolutionReport report={report} />;
      case 'USER':
        return <UserReportUi report={report} />;
    }
  };

  return (
    <div className="container  ">
      <Link href="/admin" className="inline-flex gap-2">
        {' '}
        <ChevronLeft /> <span>Back to reports</span>
      </Link>
      <div className="sticky top-0 z-50 flex items-center justify-between bg-background/80">
        <Text intent="h1" color="primary">
          {title}
        </Text>
        <ReportActions report={report} />
      </div>

      {report?.moderator && (
        <Alert className="mt-4" variant="destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-[1.25rem]" />
            <AlertTitle>Action already taken</AlertTitle>
          </div>

          <AlertDescription>
            Moderator @{report?.moderator.name} took action on this case already.
          </AlertDescription>
        </Alert>
      )}

      <div className="wrapper mt-4 flex flex-col gap-4 md:flex-row">
        <section className="order-2 flex-grow md:order-1">{ReportEl(report)}</section>
        <aside className="order-1 flex-shrink-0 md:order-2 md:w-1/3 lg:w-[30%]">
          <Text intent="h2" className="mt-6">
            Information
          </Text>

          <Text className="mt-4" intent="leading">
            Reporter{' '}
            <Link className="text-gray-400 hover:underline" href={`/@${report?.reporter.name}`}>
              @{report?.reporter.name}
            </Link>{' '}
            says that this challenge includes:{' '}
          </Text>

          <ul className="list-disc pl-8">
            {report.issues.map((issue) => (
              <li key={`issue-${issue.id}`}>{issue.type}</li>
            ))}
          </ul>

          <section className="my-4">
            <Text weight="semi">Other comments by reporter</Text>
            <div className="mt-4 rounded-lg bg-zinc-200 p-4 text-gray-800 dark:bg-zinc-800 dark:text-white">
              <Markdown>{report?.text || '_No additional comments given_'}</Markdown>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Report;
