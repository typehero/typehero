import { Button } from '@repo/ui/components/button';
import { STEPS } from '.';

interface NextBackProps {
  current: number;
  onChange: (index: number) => void;
  onNext: () => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export function NextBack({ current, onChange, onNext, onSubmit, isSubmitting }: NextBackProps) {
  return (
    <div className={`flex justify-center gap-3 ${current === STEPS.Summary && ''}`}>
      {current > STEPS.ChallengeCard && (
        <Button
          className="rounded-full bg-neutral-200 duration-300 active:scale-95 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          onClick={() => onChange(current - 1)}
          variant="ghost"
          disabled={isSubmitting}
        >
          Back
        </Button>
      )}
      {current === STEPS.Summary ? (
        <Button
          className="w-[79px] rounded-full transition-all duration-300 ease-out hover:px-16 active:scale-95"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          Submit
        </Button>
      ) : (
        <Button
          className="w-[79px] rounded-full transition-all duration-300 ease-out active:scale-95"
          onClick={onNext}
          disabled={isSubmitting}
        >
          Next
        </Button>
      )}
    </div>
  );
}
