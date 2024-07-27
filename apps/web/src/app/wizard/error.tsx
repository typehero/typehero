'use client'; // Error components must be Client Components

import { Text } from '@repo/ui/components/typography/typography';
import { Button } from '@repo/ui/components/button';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="container flex h-full flex-col items-center justify-center">
      <Text className="mb-6" intent="h2">
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
