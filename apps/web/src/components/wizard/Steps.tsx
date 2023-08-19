import { Check } from '@repo/ui/icons';
import clsx from 'clsx';
import { type Step } from '.';

interface Props<T extends Step> {
  current: number;
  steps: T[];
  onChange: (index: number) => void;
}

export function Steps<T extends Step>({ steps, current, onChange }: Props<T>) {
  return (
    <nav aria-label="Progress" className="flex justify-center px-4 lg:-mt-[56px]">
      <ol
        className="flex w-full flex-wrap items-start justify-start gap-2 divide-y sm:justify-center md:w-10/12 md:divide-y-0"
        role="list"
      >
        {steps.map((step, stepIdx) => {
          const isCompleted = current > stepIdx;
          const isCurrent = current === stepIdx;
          const isFuture = !isCompleted && !isCurrent;
          return (
            // z-50 makes it sit above navbar.tsx for pointer-events to work since the <nav> container is -mt-[56px]
            <li
              className={clsx(
                'relative z-50 rounded-full py-1 pl-[0.4rem] pr-3 transition-all duration-300 ease-in-out md:flex',
                isCompleted ? 'bg-emerald-500/20' : 'bg-gray-500/10',
              )}
              key={step.name}
            >
              <a
                className={clsx(
                  'group flex w-full items-center',
                  (isFuture || isCurrent) && 'pointer-events-none',
                )}
                href="#"
                onClick={() => onChange(stepIdx)}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className={clsx(
                      'flex flex-shrink-0 items-center justify-center rounded-full duration-300',
                      isCompleted && 'h-4 w-4 bg-emerald-700 text-white dark:bg-emerald-400',
                      isCurrent && 'h-5 w-8 bg-gray-500/30 p-2 dark:bg-gray-500/50',
                      isFuture && 'h-5 w-5 bg-gray-500/10 p-2 dark:bg-gray-500/20',
                    )}
                  >
                    {isCompleted ? (
                      <Check
                        className="h-3 w-3 stroke-white stroke-[3] dark:stroke-black"
                        size={20}
                      />
                    ) : (
                      <span className={clsx('text-xs', !isCurrent && 'text-gray-500')}>
                        {stepIdx + 1}
                      </span>
                    )}
                  </span>
                  <span
                    className={clsx(
                      'text-sm font-medium duration-300',
                      isCompleted && 'text-emerald-700 dark:text-emerald-500',
                      isFuture && 'text-gray-500',
                    )}
                  >
                    {step.name}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
