import Head from 'next/head';
import { Provider as BalancerProvider } from 'react-wrap-balancer';
import Hero from '~/components/landing/hero';
import Features from '~/components/landing/features';
import Community from '~/components/landing/community';
import Waitlist from '~/components/landing/waitlist';
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
      <BalancerProvider>
        <Hero />
        <Features />
        <Community />
        <Waitlist />
        <Footsies />
      </BalancerProvider>
    </>
  );
}
