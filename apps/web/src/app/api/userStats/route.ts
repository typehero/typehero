import { prisma } from '@repo/db';
import { NextResponse, type NextRequest } from 'next/server';
import { getSolvedChallenges } from '~/app/[locale]/(profile)/[username]/_components/dashboard/_actions';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const username = searchParams.get('username');
  if (!username) {
    return NextResponse.json({ message: 'username query not found' });
  }
  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
      },
    },
  });
  if (!user) {
    return NextResponse.json({ message: 'username not found' });
  }
  const stats = await getSolvedChallenges(username);
  return NextResponse.json(stats);
}
