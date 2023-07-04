import { Lock } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Head from 'next/head';
import { authOptions } from '~/server/auth';

async function Admin() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Head>
        <title>Admin</title>
      </Head>
      {session?.user.role.includes('ADMIN') ? (
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

export default Admin;
