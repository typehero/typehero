'use client';

import type { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';

export function SignInOutButton({ session }: { session: Session | null }) {
  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={session ? () => void signOut() : () => void signIn()}
    >
      {session ? 'Sign out' : 'Sign in'}
    </button>
  );
}
