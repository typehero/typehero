import { getServerSession } from 'next-auth';
import Head from 'next/head';
import { redirect } from 'next/navigation';
import { CodePanel } from '~/components/ui/editor';
import { TypographyH1 } from '~/components/ui/h1';
import { Navigation } from '~/components/ui/navigation';
import { SignInOutButton } from '~/components/ui/signInOutButton';
import { authOptions } from '~/server/auth';

export default async function Index() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/api/auth/signin');
  }
  return (
    <>
      <Head>
        <title>Type Hero</title>
        <meta
          name="description"
          content="Level up your typescript skills with interactive exercises"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <header>
        <TypographyH1>TypeHero</TypographyH1>
      </header>
      <main>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
        </div>
        <SignInOutButton />
        <CodePanel />
      </main>
    </>
  );
}
