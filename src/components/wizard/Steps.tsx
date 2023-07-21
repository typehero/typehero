import { Check } from 'lucide-react';

interface Step {
  id: string;
  name: string;
  href?: string;
}

interface Props<T extends Step> {
  current: number;
  steps: T[];
  onChange?: (step: T, index: number) => void;
}

export function Steps<T extends Step>({ steps, current, onChange }: Props<T>) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="divide-y rounded-xl border md:flex md:divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {current > stepIdx ? (
              <a
                href={step.href ?? '#'}
                className="group flex w-full items-center"
                onClick={() => onChange?.(step, stepIdx)}
              >
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="bg-brand-600 group-hover:bg-brand-800 dark:bg-brand-500 dark:group-hover:bg-brand-400 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white">
                    <Check size={20} />
                  </span>
                  <span className="ml-4 text-sm font-medium">{step.name}</span>
                </span>
              </a>
            ) : current === stepIdx ? (
              <span className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                <span className="border-brand-600 dark:border-brand-300 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2">
                  <span className="text-brand-600 dark:text-brand-300">{step.id}</span>
                </span>
                <span className="text-brand-600 dark:text-brand-300 ml-4 text-sm font-medium">
                  {step.name}
                </span>
              </span>
            ) : (
              <span className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2">
                    <span className="text-gray-500">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500 ">{step.name}</span>
                </span>
              </span>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div
                  className="absolute right-0 top-0 hidden h-full w-5 md:block"
                  aria-hidden="true"
                >
                  <svg
                    className="h-full w-full text-gray-300 dark:text-gray-700"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
