import { FeatureCard } from '~/components/landing/feature-card';

import FeatureCardChallengeDark from '~/assets/images/feature_card_challenge_dark.png';
import FeatureCardChallengeLight from '~/assets/images/feature_card_challenge_light.png';
import { Balancer } from 'react-wrap-balancer';

const Features = () => {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-t from-neutral-400/10 to-transparent">
      <div className="container mb-[128px] grid items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-16">
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-4xl font-bold">
              <Balancer>What&apos;s in TypeHero?</Balancer>
            </h1>
            <p className="text-lg text-zinc-400">
              <Balancer>All you need to become a TypeScript menace</Balancer>
            </p>
          </div>
          <div className="relative grid w-full gap-8 lg:grid-cols-2">
            <FeatureCard
              title="Learn & Excel"
              description="Create new challenges with a built-in challenge editor and choose accepted solutions"
              className="left-[35px] top-[35%] w-[150%] transition-transform duration-300 group-hover:scale-105 sm:left-[35px] sm:top-[30%] sm:w-[110%]"
              image={{
                dark: FeatureCardChallengeDark,
                light: FeatureCardChallengeLight,
                alt: 'Something',
              }}
            />

            <FeatureCard
              title="Learn & Excel"
              description="Create new challenges with a built-in challenge editor and choose accepted solutions"
              className="left-[35px] top-[35%] w-[150%] transition-transform duration-300 group-hover:scale-105 sm:left-[35px] sm:top-[30%] sm:w-[110%]"
              image={{
                dark: FeatureCardChallengeDark,
                light: FeatureCardChallengeLight,
                alt: 'Something',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default Features;
