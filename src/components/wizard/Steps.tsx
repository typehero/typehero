import { Check } from 'lucide-react';
import { type Step } from '.';

interface Props<T extends Step> {
  current: number;
  steps: T[];
  onChange: (index: number) => void;
}

export function Steps<T extends Step>({ steps, current, onChange }: Props<T>) {
  return (
    <nav className="flex justify-center px-4 lg:-mt-[56px]" aria-label="Progress">
      <ol
        role="list"
        className="flex w-full flex-wrap items-start justify-start gap-2 divide-y sm:justify-center md:w-10/12 md:divide-y-0"
      >
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={`relative rounded-full ${
              current > stepIdx ? 'bg-emerald-500/20' : 'bg-gray-500/10'
            } py-1 pl-[0.4rem] pr-3 md:flex`}
          >
            {current > stepIdx ? (
              <a
                href={'#'}
                className="group flex w-full items-center"
                onClick={() => onChange(stepIdx)}
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white dark:bg-emerald-400">
                    <Check
                      className="h-3 w-3 stroke-white stroke-[3] dark:stroke-black"
                      size={20}
                    />
                  </span>
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-500">
                    {step.name}
                  </span>
                </span>
              </a>
            ) : current === stepIdx ? (
              <span className="flex items-center gap-2 text-sm font-medium" aria-current="step">
                <span className="flex h-5 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-500/30 p-2 dark:bg-gray-500/50">
                  <span className="text-xs">{step.id}</span>
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </span>
            ) : (
              <span className="group flex items-center">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full">
                    <span className="text-xs text-gray-500">{step.id}</span>
                  </span>
                  <span className="text-sm font-medium text-gray-500 ">{step.name}</span>
                </span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
