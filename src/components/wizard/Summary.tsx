import { WizardForm } from '.';
import { Button } from '../ui/button';

interface Props {
  goBack(): void;
}
export function Summary({ goBack }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-5 text-center text-5xl font-bold text-gray-900 dark:text-gray-100">
        Thanks for creating a challenge! Submit it to the community for review.
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={goBack}>
          Review
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </div>
  );
}
