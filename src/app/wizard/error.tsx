'use client'; // Error components must be Client Components

import { Button } from '~/components/ui/button';
import Text from '~/components/ui/typography/typography';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="container flex h-full flex-col items-center justify-center">
      <Text intent="h2" className="mb-6">
        Something went wrong!
      </Text>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
