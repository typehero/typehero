'use client';
import { signOut } from '@repo/auth/react';
import { Button } from '@repo/ui/components/button';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export function SignOutLink({ className }: { className?: string }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };
  return (
    <Button
      className={clsx(
        'h-8 justify-start bg-opacity-50 text-red-500 hover:bg-red-500/20 hover:text-red-500 [&:not(:disabled)]:px-2',
        className,
      )}
      onClick={handleSignOut}
      variant="ghost"
    >
      <span className="ml-3 text-red-500 md:ml-0">Log out</span>
    </Button>
  );
}
