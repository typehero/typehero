import { getServerSession } from 'next-auth';
import Head from 'next/head';
import { SignInOutButton } from '~/components/ui/sign-in-out-button';
import { authOptions } from '~/server/auth';

export default async function Index() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <Head>
        <title>Type Hero</title>
        <meta
          name="description"
          content="Level up your typescript skills with interactive exercises"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {session && <span>Logged in as {session.user?.name}</span>}
        </p>
      </div>
      <SignInOutButton session={session} />
    </>
  );
}
