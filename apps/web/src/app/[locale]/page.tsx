import { setStaticParamsLocale } from 'next-international/server';
import { Footsies } from '~/components/footsies';
import { Community } from './_components/community/community';
import { Features } from './_components/features';
import { Hero } from './_components/hero';
import { WaitlistBanner } from './_components/waitlist-banner';
import { getStaticParams } from '~/locales/server';

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
