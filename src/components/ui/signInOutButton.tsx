'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export function SignInOutButton() {
  const { data: session, status } = useSession();

  console.log({ session });
  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={status === 'authenticated' ? () => void signOut() : () => void signIn()}
    >
      {status === 'authenticated' ? 'Sign out' : 'Sign in'}
    </button>
  );
}
