'use client';
import { signOut } from '@repo/auth/react';
import { Button } from '@repo/ui/components/button';
import { useRouter } from 'next/navigation';

export function SignOutLink() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };
  return (
    <Button
      className="h-8 w-full justify-start rounded-b-lg rounded-t-sm bg-opacity-50 px-2 text-red-500 hover:bg-red-500/20 hover:text-red-500"
      onClick={handleSignOut}
      variant="ghost"
    >
      <span className="text-red-500">Log out</span>
    </Button>
  );
}
