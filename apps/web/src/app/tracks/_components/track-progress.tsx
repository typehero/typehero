import { Progress } from '@repo/ui/components/progress';

interface TrackProgressProps {
  totalChallenges: number;
  completedChallenges: number;
}

export function TrackProgress({ completedChallenges, totalChallenges }: TrackProgressProps) {
  const challengeStatus = completedChallenges < totalChallenges ? 'Progress' : 'Completed';
  const challengeIndicatorColor =
    challengeStatus === 'Completed' ? 'bg-green-500 dark:bg-green-700' : undefined;
  return (
    <div className="flex w-full flex-col">
      <div className="mb-2 flex flex-row items-center justify-between">
        <span className="text-muted-foreground text-sm">{challengeStatus}</span>
        <span className="text-muted-foreground text-sm">
          {completedChallenges}/{totalChallenges}
        </span>
      </div>
      <Progress
        className="h-[8px] bg-neutral-300 dark:bg-neutral-800"
        value={(completedChallenges / totalChallenges) * 100}
        indicatorClassName={challengeIndicatorColor}
      />
    </div>
  );
}
