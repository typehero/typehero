import { FeatureCard } from '~/components/landing/feature-card';

import FeatureCardChallengeDark from '~/assets/images/feature_card_challenge_dark.png';
import FeatureCardChallengeLight from '~/assets/images/feature_card_challenge_light.png';
import { Balancer } from 'react-wrap-balancer';

const Features = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="container mb-[64px] grid items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-16">
          <div className="flex flex-col gap-3 text-center">
            <div className="mx-auto rounded-full bg-gradient-to-r from-[#31bdc6] to-[#3178c6] p-[1px] brightness-90 contrast-150 dark:brightness-125 dark:contrast-100">
              <div className="rounded-full bg-white/80 px-3 py-1 dark:bg-black/80">
                <span className="bg-gradient-to-r from-[#31bdc6] to-[#3178c6] bg-clip-text text-transparent">
                  <svg
                    className="mr-1 inline-block h-4 w-4 fill-[#31bdc6]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="4 4 48 48"
                  >
                    <path d="m19.2 36.4-4.75-10.45L4 21.2l10.45-4.75L19.2 6l4.75 10.45L34.4 21.2l-10.45 4.75ZM36.4 42l-2.35-5.25-5.25-2.35 5.25-2.4 2.35-5.2 2.4 5.2 5.2 2.4-5.2 2.35Z"></path>
                  </svg>
                  many features, wow
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-bold">
              <Balancer>What&apos;s in TypeHero?</Balancer>
            </h1>
            <p className="text-black/50 dark:text-white/50">
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
