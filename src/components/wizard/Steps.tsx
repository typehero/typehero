import { Check } from 'lucide-react';
import { STEPS, type Step } from '.';
import { Button } from '../ui/button';

interface Props<T extends Step> {
  current: number;
  steps: T[];
  onChange: (index: number) => void;
  onNext: () => void;
  onSubmit: () => Promise<void>;
}

export function Steps<T extends Step>({ steps, current, onChange, onNext, onSubmit }: Props<T>) {
  return (
    <nav className="items-center justify-between md:flex" aria-label="Progress">
      <ol
        role="list"
        className="mb-3 divide-y rounded-xl border border-zinc-300  dark:border-zinc-700 md:flex md:w-10/12 md:divide-y-0"
      >
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {current > stepIdx ? (
              <a
                href={'#'}
                className="group flex w-full items-center"
                onClick={() => onChange(stepIdx)}
              >
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-300 text-white dark:bg-green-800">
                    <Check className="stroke-black dark:stroke-white" size={20} />
                  </span>
                  <span className="ml-4 text-sm font-medium">{step.name}</span>
                </span>
              </a>
            ) : current === stepIdx ? (
              <span className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                <span className="flex h-10  w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-zinc-300 dark:border-zinc-700">
                  <span>{step.id}</span>
                </span>
                <span className="ml-4 text-sm font-medium">{step.name}</span>
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
                    className="h-full w-full text-zinc-300 dark:text-zinc-700"
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
      <div className="flex justify-end gap-3">
        <>
          {current > STEPS.ChallengeCard && (
            <Button variant="ghost" onClick={() => onChange(current - 1)}>
              Back
            </Button>
          )}
          {current === STEPS.Summary ? (
            <Button className="w-[79px]" onClick={onSubmit}>
              Submit
            </Button>
          ) : (
            <Button onClick={onNext} className="w-[79px]">
              Next
            </Button>
          )}
        </>
      </div>
    </nav>
  );
}
