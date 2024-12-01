import { CheckCircle } from '@repo/ui/icons';

interface ExploreChallengesProgressionProps {
  completed: number;
  total: number;
}

const SOLVED = 'Solved';

export function ExploreChallengesProgression({
  completed,
  total,
}: ExploreChallengesProgressionProps) {
  return (
    <div className="flex items-center gap-1">
      {completed === total && (
        <CheckCircle className="stroke-green-600 dark:stroke-green-300" size={18} />
      )}
      <span className="text-muted-foreground text-sm">
        {completed}/{total} {SOLVED}
      </span>
    </div>
  );
}
