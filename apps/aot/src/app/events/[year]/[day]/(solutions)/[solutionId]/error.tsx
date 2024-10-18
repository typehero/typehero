'use client'; // Error components must be Client Components

import { Text } from '@repo/ui/components/typography/typography';

export default function Error() {
  return (
    <div className="container flex h-full flex-col items-center justify-center">
      <Text className="mb-6" intent="h2">
        Uh oh! We couldn&apos;t find the solution you were looking for.
      </Text>
    </div>
  );
}
