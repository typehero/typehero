async function getTop100SubmissionsByChallengeIds(challengeIds: number[]) {
  // I tried setting up TypedSQL from Prisma: https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql
  // But it was getting stuck trying to load schema.prisma for some reason
  // Would love some help so we can get inferred typing for this!

  return ''; // query to return top 100 of each day so far
}

export default function OverallLeaderboard() {
  return <>Coming soon!!</>;
}
