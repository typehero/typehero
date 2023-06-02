'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export function SignInOutButton() {
  const session = useSession();
  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={session ? () => void signOut() : () => void signIn()}
    >
      {session ? 'Sign out' : 'Sign in'}
    </button>
  );
}
