interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export function ProgressBar({ completed, total, className }: ProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className={`px-4 w-full ${className || ''}`}>
      <div className="flex w-full flex-col">
        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="text-muted-foreground text-sm">Progress</span>
          <span className="text-muted-foreground text-sm">
            {completed} / {total} solved
          </span>
        </div>
        <div className="h-[8px] w-full rounded-full bg-neutral-300 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-green-500 dark:bg-green-700 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}