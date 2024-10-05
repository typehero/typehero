'use server';

import type {AdventChallenges} from "~/app/(profile)/[username]/_components/dashboard/_domain_actions";
import {prisma} from "@repo/db";

export async function AdventRetrieveData(userId: string) {
  const advent: AdventChallenges = await prisma.track.findFirst({
    where: {
      slug: 'advent-of-typescript-2023',
    },
    include: {
      trackChallenges: {
        orderBy: {
          orderId: 'asc',
        },
        include: {
          challenge: {
            include: {
              submission: {
                where: {
                  userId,
                },
              },
            },
          },
        },
      },
      enrolledUsers: {
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });
  return advent;
}

export async function DifficultyRetrieveData(userId: string) {
  return await prisma.$queryRaw`SELECT Difficulty, COUNT(Id) as TotalCompleted FROM (SELECT DISTINCT Difficulty, Challenge.Id FROM Submission JOIN Challenge ON Submission.challengeId = Challenge.Id WHERE Submission.userId = ${userId} AND IsSuccessful = 1) unique_query GROUP BY Difficulty `;
}
