import type { Metadata } from 'next';
import { Footsies } from '~/components/ui/footsies';
import { Community } from './_components/community/community';
import { Features } from './_components/features';
import { Hero } from './_components/hero';
import { WaitlistBanner } from './_components/waitlist-banner';
import { getStaticParams } from '~/locales/server';
import { setStaticParamsLocale } from 'next-international/server';

export const metadata: Metadata = {
  title: 'TypeHero',
  description:
    'Connect, collaborate, and grow with a community of TypeScript developers. Elevate your skills through interactive coding challenges, discussions, and knowledge sharing',
};

export function generateStaticParams() {
  return getStaticParams();
}

export default async function Index({ params: { locale } }: { params: { locale: string } }) {
  setStaticParamsLocale(locale);

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
