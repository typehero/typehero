'use client';

import { useSession } from '@repo/auth/react';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import Confetti from 'react-confetti';

export default function Content() {
  const session = useSession();

  const thankYouMessage = session?.user?.name
    ? `Thank you ${session.user.name} for you donation!`
    : `Thank you for your support!`;

  return (
    <>
      <div className="container flex h-full flex-col items-center justify-center p-4">
        <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {thankYouMessage}
        </h1>
        <div className="flex flex-col gap-4">
          <Link href="/explore">
            <Button className="w-56" variant="default" size="lg">
              Go to explore
            </Button>
          </Link>
        </div>
      </div>
      <Confetti />
    </>
  );
}
