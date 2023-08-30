'use client'; // Error components must be Client Components

import { Button, Text } from '@repo/ui';
import Link from 'next/link';

export default function Error() {
  return (
    <div className="container flex h-full flex-col items-center justify-center">
      <Text className="mb-6" intent="h2">
        Welp! We couldn&apos;t find the challenge you were looking for. :3
      </Text>
      <Link href="/explore">
        <Button>Explore Challenges</Button>
      </Link>
    </div>
  );
}
