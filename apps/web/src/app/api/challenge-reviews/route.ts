import { NextResponse } from 'next/server';
import { prisma } from '@repo/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) ?? 1;
  const size = Number(searchParams.get('size')) ?? 10;

  const [count, data] = await getChallenges(page, size);
  const pageCount = Math.ceil(count / size);

  return NextResponse.json([pageCount, data]);
}

export type ChallengeReviewData = Awaited<ReturnType<typeof getChallenges>>;
async function getChallenges(page: number, size: number) {
  return prisma.$transaction([
    prisma.challenge.count({
      where: {
        status: 'PENDING',
      },
    }),
    prisma.challenge.findMany({
      skip: page * size,
      take: size,
      where: {
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);
}
