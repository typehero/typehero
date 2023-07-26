import { FeatureCard } from '~/components/landing/feature-card';

import FeatureCardChallengeDark from '~/assets/images/feature_card_challenge_dark.png';
import FeatureCardChallengeLight from '~/assets/images/feature_card_challenge_light.png';
import FeatureCardPlaceholder from '~/assets/images/feature_card_placeholder.png';

const Features = () => {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-t from-neutral-400/10 to-transparent">
      <div className="container mb-[128px] grid items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-16">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-4xl font-bold">What&apos;s in TypeHero?</h1>
            <p className="text-lg text-zinc-400">All you need to become a TypeScript menace</p>
          </div>
          <div className="relative grid w-full gap-8 lg:grid-cols-2">
            <FeatureCard
              title="Learn & Excel"
              description="Create new challenges with a built-in challenge editor and choose accepted solutions"
              image={{
                dark: FeatureCardChallengeDark as unknown as string,
                light: FeatureCardChallengeLight as unknown as string,
                placeholder: FeatureCardPlaceholder as unknown as string,
                alt: 'Something',
                style: {
                  top: '30%',
                  left: '35px',
                  width: '110%',
                  maxWidth: 'unset',
                },
              }}
            />

            <FeatureCard
              title="Learn & Excel"
              description="Create new challenges with a built-in challenge editor and choose accepted solutions"
              image={{
                dark: FeatureCardChallengeDark as unknown as string,
                light: FeatureCardChallengeLight as unknown as string,
                placeholder: FeatureCardPlaceholder as unknown as string,
                alt: 'Something',
                style: {
                  top: '30%',
                  left: '35px',
                  width: '110%',
                  maxWidth: 'unset',
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;
