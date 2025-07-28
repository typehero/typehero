import { cn } from '@repo/ui/cn';
import { ChevronDown, ChevronUp } from '@repo/ui/icons';
import { DIFFICULTY_COLORS } from '~/constants/difficulties';

interface MobileDropdownProps {
  options: ReadonlyArray<{ readonly label: string; readonly tag: string }>;
  selected: string;
  onSelect: (tag: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function MobileDropdown({ 
  options, 
  selected, 
  onSelect, 
  isOpen, 
  onToggle,
  className 
}: MobileDropdownProps) {
  const selectedOption = options.find(option => option.tag === selected);

  return (
    <div className={cn("px-4 w-full sm:hidden", className)}>
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200',
            'border border-neutral-300 dark:border-neutral-700 rounded-lg',
            'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100',
            'hover:bg-neutral-50 dark:hover:bg-neutral-800'
          )}>
          <span className="text-gray-900 dark:text-white">
            {selectedOption?.label || 'Select Difficulty'}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
            {options.map((option) => {
              const isSelected = selected === option.tag;
              const difficultyColor = DIFFICULTY_COLORS[option.tag as keyof typeof DIFFICULTY_COLORS];
              
              return (
                <button
                  key={option.tag}
                  type="button"
                  onClick={() => onSelect(option.tag)}
                  className={cn(
                    'w-full px-4 py-3 text-left text-sm transition-colors',
                    'hover:bg-gray-50 dark:hover:bg-gray-700',
                    {
                      [`${difficultyColor} bg-opacity-10 dark:bg-opacity-20`]: isSelected,
                      'text-gray-700 dark:text-gray-300': !isSelected,
                    }
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}