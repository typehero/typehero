import { Progress } from '@repo/ui';

interface TrackProgressProps {
  totalChallenges: number;
  completedChallenges: number;
}

export function TrackProgress({ completedChallenges, totalChallenges }: TrackProgressProps) {
  return (
    <div className="flex w-full flex-col">
      <div className="mb-2 flex flex-row items-center justify-between">
        <span className="text-muted-foreground text-sm">Progress</span>
        <span className="text-muted-foreground text-sm">
          {completedChallenges}/{totalChallenges}
        </span>
      </div>
      <Progress value={(completedChallenges / totalChallenges) * 100} />
    </div>
  );
}
