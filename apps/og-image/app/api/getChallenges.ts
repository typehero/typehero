import { prisma } from '@repo/db';
import { getServerAuthSession } from '@repo/auth/server';

export default async () =>{
    const session = await getServerAuthSession();
    
    if(!session) return null

    const userId = session.user.id
    const challenges = await getCompletedChallenges(userId)

    return challenges.length
}

async function getCompletedChallenges(userId: string) {
    const challenges = await prisma.challenge.findMany({
      where: {
        submission: {
          some: {
            userId,
            isSuccessful: true,
          },
        },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        submission: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            createdAt: true,
          },
        },
      },
    });
  
    return challenges
  }