import { NextResponse } from 'next/server';
import { prisma } from '@repo/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const submission = await prisma.submission.findFirst({
    where: {
      id: Number(params.id),
    },
  });

  return NextResponse.json(submission);
}
