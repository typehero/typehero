import { cn } from '@repo/ui/cn';
import { DIFFICULTY_COLORS } from '~/constants/difficulties';

interface DifficultyTabsProps {
  difficulties: ReadonlyArray<{ readonly label: string; readonly tag: string }>;
  selectedTab: string;
  onTabChange: (tag: string) => void;
  className?: string;
}

export function DifficultyTabs({ 
  difficulties, 
  selectedTab, 
  onTabChange,
  className 
}: DifficultyTabsProps) {
  return (
    <div className={cn("hidden sm:block px-4 w-full", className)}>
      <div className="flex flex-wrap w-full gap-2 border-neutral-200 dark:border-neutral-800">
        {difficulties.map((difficulty) => {
          const isSelected = selectedTab === difficulty.tag;
          const difficultyColor = DIFFICULTY_COLORS[difficulty.tag as keyof typeof DIFFICULTY_COLORS];
          
          return (
            <button
              key={difficulty.tag}
              type="button"
              onClick={() => onTabChange(difficulty.tag)}
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-all duration-200',
                'border-b-2 border-transparent rounded-t-lg',
                'hover:text-neutral-900 dark:hover:text-neutral-100',
                {
                  [`border-current ${difficultyColor} bg-opacity-10 dark:bg-opacity-20`]: isSelected,
                  'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800': !isSelected,
                }
              )}
            >
              {difficulty.label}
              {isSelected && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200"
                  style={{ 
                    backgroundColor: `var(--${difficulty.tag.toLowerCase()}-color, currentColor)` 
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}