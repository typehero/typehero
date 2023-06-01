import { type NextPage } from 'next';

import { signIn, signOut, useSession } from 'next-auth/react';

import Head from 'next/head';
import { CodePanel } from '~/components/ui/editor';
import { TypographyH1 } from '~/components/ui/h1';
import { Navigation } from '~/components/ui/navigation';
import { api } from '~/utils/api';

const Home: NextPage = () => {
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
        <AuthShowcase />
        <CodePanel />
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? 'Sign out' : 'Sign in'}
      </button>
    </div>
  );
};
