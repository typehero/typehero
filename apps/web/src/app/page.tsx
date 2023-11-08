import { Footsies } from '~/components/footsies';
import { Community } from './_components/community/community';
import { Features } from './_components/features';
import { Hero } from './_components/hero';
import { WaitlistBanner } from './_components/waitlist-banner';

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
