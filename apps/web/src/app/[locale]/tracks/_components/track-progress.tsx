import { Progress } from '@repo/ui/components/progress';

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
      <Progress
        className="h-[8px] bg-neutral-300 dark:bg-neutral-800"
        value={(completedChallenges / totalChallenges) * 100}
      />
    </div>
  );
}
