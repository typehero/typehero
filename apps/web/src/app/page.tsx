import type { Metadata } from 'next';
import { Footsies } from '~/components/ui/footsies';
import Community from './_components/community/community';
import Features from './_components/features';
import Hero from './_components/hero';
import { WaitlistBanner } from './_components/waitlist-banner';

export const metadata: Metadata = {
  title: 'Typehero',
  description:
    'Connect, collaborate, and grow with a community of TypeScript developers. Elevate your skills through interactive coding challenges, discussions, and knowledge sharing',
};

export default async function Index() {
  return (
    <>
      <Hero />
      <Features />
      <Community />
      <WaitlistBanner />
      <Footsies />
    </>
  );
}
