'use server';

import { getServerSession } from 'next-auth';
import { CommentReportSchemaType } from '~/components/challenge/comments/comment';
import { authOptions } from '~/server/auth';
import { prisma } from '~/server/db';

export async function addChallengeComment(challengeId: number, text: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) return 'unauthorized';
  if (text.length === 0) return 'text_is_empty';

  return await prisma.challengeComment.create({
    data: {
      challengeId,
      text,
      userId: session.user.id,
    },
  });
}

export async function reportChallengeComment(
  formValues: CommentReportSchemaType,
  commentId: number,
) {
  const session = await getServerSession(authOptions);
  const { bullying, hate_speech, spam, text, threat } = formValues;

  // 1. Checks
  if (!session?.user.id) return 'unauthorized';

  // 2. If report already exist's return.
  const report = await prisma.commentReport.findFirst({
    where: {
      challengeCommentId: commentId,
    },
  });
  if (report) return 'already_exists';

  // 3. Create new report.
  return await prisma.commentReport.create({
    data: {
      authorId: session.user.id,
      bullying: bullying,
      hateSpeech: hate_speech,
      spam: spam,
      threats: threat,
      text: text,
      challengeCommentId: commentId,
    },
  });
}
