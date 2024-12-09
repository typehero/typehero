import { Footsies } from '~/components/footsies';
import { Community } from './_components/community/community';
import { Features } from './_components/features';
import { Hero } from './_components/hero';
import { NewsletterBanner } from './_components/newsletter-banner';

export default function Index() {
  return (
    <>
      <Hero />
      <Features />
      <Community />
      <NewsletterBanner />
      <Footsies />
    </>
  );
}
