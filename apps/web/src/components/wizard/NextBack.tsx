import { STEPS, type Step } from '.';
import { Button } from '../ui/button';

interface Props<T extends Step> {
  current: number;
  onChange: (index: number) => void;
  onNext: () => void;
  onSubmit: () => Promise<void>;
}

export function NextBack<T extends Step>({ current, onChange, onNext, onSubmit }: Props<T>) {
  return (
    <div className={`flex justify-center gap-3 ${current === STEPS.Summary && ''}`}>
      <>
        {current > STEPS.ChallengeCard && (
          <Button
            className="rounded-full bg-neutral-200 duration-300 active:scale-95 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            variant="ghost"
            onClick={() => onChange(current - 1)}
          >
            Back
          </Button>
        )}
        {current === STEPS.Summary ? (
          <Button
            className="w-[79px] rounded-full bg-emerald-500 transition-all duration-300 ease-out hover:bg-emerald-400 hover:px-16 active:scale-95"
            onClick={onSubmit}
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="w-[79px] rounded-full transition-all duration-300 ease-out hover:pl-8 active:scale-95"
          >
            Next
          </Button>
        )}
      </>
    </div>
  );
}
