import { prisma } from '~/server/db';
import { redirect } from 'next/navigation';
import Text from '~/components/ui/typography/typography';
import Link from 'next/link';
import { Markdown } from '~/components/ui/markdown';
import Editor from '~/components/ui/editor';
import { UserBadge } from '~/components/ui/user-badge';
import { AlertCircle, ThumbsUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import ReportActions from './actions';
import { getChallenge } from '~/components/admin/admin.actions';

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
  // Grab the items.
  const {
    author,
    challenge,
    derogatory,
    id,
    moderatorId,
    moderator,
    createdAt,
    updatedAt,
    unclear,
    text,
    status,
  } = await getChallenge(idNum);

  return (
    <div className="container  ">
      <div className="sticky top-0 z-50 flex items-center justify-between bg-background/80">
        <Text intent="h1" color="primary">
          Challenge Report
        </Text>
        <ReportActions
          reportId={id}
          moderatorId={moderatorId}
          moderator={moderator}
          challenge={challenge}
        />
      </div>

      <Text intent="h2" className="mt-6">
        Report information
      </Text>

      {moderator && (
        <Alert className="mt-4" variant="destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-[1.25rem]" />
            <AlertTitle>Action already taken</AlertTitle>
          </div>

          <AlertDescription>
            Moderator @{moderator.name} took action on this case already.
          </AlertDescription>
        </Alert>
      )}

      <Text className="mt-4" intent="leading">
        Reporter{' '}
        <Link className="text-gray-400 hover:underline" href={`/@${author.name}`}>
          @{author.name}
        </Link>{' '}
        says that this challenge:{' '}
      </Text>

      <ul className="list-disc pl-8">
        {derogatory && <li>Is derogatory</li>}
        {unclear && <li>Is unclear</li>}
        {!(derogatory || unclear) && <li>Has some other issue (see comments below)</li>}
      </ul>

      <section className="my-4">
        <Text weight="semi">Other comments by reporter</Text>
        <div className="mt-4 rounded-lg bg-zinc-200 p-4 text-gray-800 dark:bg-zinc-800 dark:text-white">
          <Markdown>{text || '__No additional comments given__'}</Markdown>
        </div>
      </section>

      <Text intent="h2" className="mt-6">
        Challenge information
      </Text>

      <section className="mt-6 flex flex-wrap gap-4 md:flex-nowrap">
        <div className="w-full rounded-lg p-4 dark:bg-muted/90 md:w-1/2">
          <Text intent="h3">{challenge.name}</Text>
          <Text className="mt-2">
            Created at:{' '}
            {challenge.createdAt.toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'medium',
            })}
          </Text>
          <Text intent="body">
            Last updated on:{' '}
            {challenge.updatedAt.toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'medium',
            })}
          </Text>
          <UserBadge username={challenge.user.name || 'No author found'} />
          <div className="my-2 flex gap-4">
            <ThumbsUp /> {challenge.vote.length}
          </div>
          <Markdown className="mt-4">{challenge.description}</Markdown>
        </div>
        <div className="w-full md:w-1/2">
          <Editor value={challenge.prompt} />
        </div>
      </section>
    </div>
  );
};

export default Report;
