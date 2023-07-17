import Head from 'next/head';
import Community from '~/components/landing/community';
import Features from '~/components/landing/features';
import Hero from '~/components/landing/hero';
import { Footsies } from '~/components/ui/footsies';

export default async function Index() {
  return (
    <>
      <Head>
        <title>Typehero</title>
        <meta
          name="description"
          content="Level up your typescript skills with interactive exercises"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Hero />
      <Features />
      <Community />
      <Footsies />
    </>
  );
}
