interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export function ProgressBar({ completed, total, className }: ProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className={`w-full px-4 ${className || ''}`}>
      <div className="flex w-full flex-col">
        <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-muted-foreground text-sm">Progress</span>
          <span className="text-muted-foreground text-sm">
            {completed} / {total} solved
          </span>
        </div>
        <div className="h-[8px] w-full rounded-full bg-neutral-300 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300 dark:bg-green-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
