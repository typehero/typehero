import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/card';
import { DifficultyBadge } from '@repo/ui/components/difficulty-badge';
import { Progress } from '@repo/ui/components/progress';
import { getSolvedChallenges } from './_actions';

export const DIFFICULTIES = ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME'] as const;

interface ChallengesProgressProps {
  userId: string;
}

export async function ChallengesProgress({ userId }: ChallengesProgressProps) {
  const { challenges, percentage, totalChallenges, totalSolved } =
    await getSolvedChallenges(userId);
  return (
    <Card className="flex-grow">
      <CardHeader>
        <CardTitle>Challenges</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-grow flex-col gap-2 text-xl">
          {DIFFICULTIES.map((difficulty) => (
            <div key={difficulty} className="flex items-center gap-4 md:gap-6">
              <DifficultyBadge
                className="w-full max-w-[80px] justify-center"
                difficulty={difficulty}
              />
              <Progress
                indicatorClassName={`bg-opacity-75 ${getProgressBarColor(difficulty)}`}
                className="h-1"
                value={(challenges[difficulty].solved / challenges[difficulty].total) * 100}
              />
              <div className="w-16 text-center md:w-20">
                {challenges[difficulty].solved}
                <span className="text-muted-foreground text-sm">
                  /{challenges[difficulty].total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground text-sm">
          Solved: <span className="text-foreground text-xl">{totalSolved}</span>/{totalChallenges} (
          {percentage}%)
        </div>
      </CardFooter>
    </Card>
  );
}

const getProgressBarColor = (difficulty: string) => {
  switch (difficulty) {
    case 'BEGINNER':
      return 'dark:bg-blue-300 bg-blue-700';
    case 'EASY':
      return 'dark:bg-green-300 bg-green-700';
    case 'MEDIUM':
      return 'dark:bg-yellow-300 bg-yellow-700';
    case 'HARD':
      return 'dark:bg-red-300 bg-red-700';
    case 'EXTREME':
      return 'dark:bg-purple-300 bg-purple-700';
    default:
      return '';
  }
};
