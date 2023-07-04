'use client';

import { Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Admin() {
  const session = useSession();
  return (
    <div>
      <Head>
        <title>Admin</title>
      </Head>
      {session.data?.user.role === 'ADMIN' ? (
        <div className="flex flex-col">{/** Admin Content Go Here */}</div>
      ) : (
        <div
          className="flex w-full flex-col items-center justify-center space-y-2"
          style={{ minHeight: 'calc(100dvh - 112px)' }}
        >
          <Lock className="h-8 w-8 text-red-500" />
          <span className="max-w-[40ch] text-center text-black/50 dark:text-white/50">
            You do not have enough permissions to access the page.
          </span>
        </div>
      )}
    </div>
  );
}
