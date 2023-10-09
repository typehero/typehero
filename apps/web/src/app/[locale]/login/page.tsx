import { prisma } from '@repo/db';
import { redirect } from 'next/navigation';

export default async function Index({ params: { token } }: { params: { token: string } }) {
  const validToken = await validateToken(token);
  if (!validToken) {
    return redirect('/');
  }

  return <div>asdasd</div>;
}

async function validateToken(token: string) {
  return prisma.betaTokens.findUnique({ where: { token, isClaimed: true } });
}
