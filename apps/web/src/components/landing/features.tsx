'use client';

import { Balancer } from 'react-wrap-balancer';
import clsx from 'clsx';
import {
  ImageCard,
  CollaborativeEnvironmentCard,
  CuratedTracksCard,
} from '~/components/landing/feature-card';
import FeatureCardChallengeDark1 from '~/assets/images/feature_card_challenge_dark1.png';
import FeatureCardChallengeDark2 from '~/assets/images/feature_card_challenge_dark2.png';
import FeatureCardChallengeLight1 from '~/assets/images/feature_card_challenge_light1.png';
import FeatureCardChallengeLight2 from '~/assets/images/feature_card_challenge_light2.png';
import FeatureCardCreateLight1 from '~/assets/images/feature_card_create_light1.png';
import FeatureCardCreateLight2 from '~/assets/images/feature_card_create_light2.png';
import FeatureCardCreateDark1 from '~/assets/images/feature_card_create_dark1.png';
import FeatureCardCreateDark2 from '~/assets/images/feature_card_create_dark2.png';
import { useIsMobile } from '~/utils/useIsMobile';

function Features() {
  const isMobile = useIsMobile();
  return (
    <section className="relative overflow-hidden" id="features">
      <div className="container mb-[64px] grid items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-16">
          <div className="flex flex-col gap-3 text-center">
            <a
              className="mx-auto hidden rounded-full bg-gradient-to-r from-[#31bdc6] to-[#3178c6] p-[1px] brightness-90 contrast-150 focus:bg-slate-200 focus:outline-none focus-visible:outline-none dark:brightness-125 dark:contrast-100 sm:block"
              href="#features"
            >
              <div className="rounded-full bg-white/80 px-3 py-1 dark:bg-black/80">
                <span className="bg-gradient-to-r from-[#31bdc6] to-[#3178c6] bg-clip-text text-transparent">
                  <svg
                    className="mr-1 inline-block h-4 w-4 fill-[#31bdc6]"
                    viewBox="4 4 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m19.2 36.4-4.75-10.45L4 21.2l10.45-4.75L19.2 6l4.75 10.45L34.4 21.2l-10.45 4.75ZM36.4 42l-2.35-5.25-5.25-2.35 5.25-2.4 2.35-5.2 2.4 5.2 5.2 2.4-5.2 2.35Z" />
                  </svg>
                  many features, wow
                </span>
              </div>
            </a>
            <h1 className="text-4xl font-bold">
              <Balancer>What&apos;s in TypeHero?</Balancer>
            </h1>
            <p className="text-black/50 dark:text-white/50">
              <Balancer>All you need to become a TypeScript menace</Balancer>
            </p>
          </div>
          <div className="relative z-10 grid w-full gap-8 lg:grid-cols-2">
            <ImageCard
              imgClass1={clsx(
                'pointer-events-noned transition-transform duration-500',
                'max-sm:scale-[240%] bottom-[5%] left-[30%] w-[42%] md:-bottom-[11%] md:left-[35px] lg:w-[69%]',
                !isMobile && 'group-hover:translate-x-2 group-hover:scale-95',
              )}
              imgClass2={clsx(
                'pointer-events-none transition-transform duration-500 backdrop-blur-md rounded-xl overflow-hidden',
                'max-sm:scale-[280%] left-[80%] -bottom-[1%] w-[50%] md:left-[39%] md:-bottom-[12%] lg:w-[77%]',
                !isMobile && 'group-hover:scale-105 group-hover:-translate-x-2',
              )}
              description="Engage in TypeScript challenges to strengthen your grasp of the type system and advanced features"
              bgClass="lg:bg-gradient-to-br"
              image={{
                dark1: FeatureCardChallengeDark1,
                dark2: FeatureCardChallengeDark2,
                light1: FeatureCardChallengeLight1,
                light2: FeatureCardChallengeLight2,
                alt: 'Something',
              }}
              title="Type Challenges"
            />

            <CollaborativeEnvironmentCard
              description="Developers can share solutions and engage in discussions through commenting"
              bgClass="lg:bg-gradient-to-bl"
              title="Collaborative Environment"
            />

            <ImageCard
              imgClass1={clsx(
                'pointer-events-none w-[50%] rounded-t-xl border border-zinc-300 opacity-80 transition-transform duration-500 dark:border-zinc-700',
                'max-md:scale-[160%] left-[15%] top-[57%] md:left-[35px] md:top-[30%]',
                !isMobile && 'group-hover:translate-y-2',
              )}
              imgClass2={clsx(
                'pointer-events-none w-[150%] rounded-t-xl border border-zinc-300 dark:border-zinc-700 ransition-transform duration-500 opacity-80 backdrop-blur-md rounded-xl overflow-hidden',
                'max-md:scale-[140%] left-[70%] top-[53%] md:top-[30%] md:left-[calc(50%+35px+1rem)]',
                !isMobile && 'group-hover:-translate-y-6',
              )}
              description="Craft your own coding challenges to share with the Typehero community"
              bgClass="lg:bg-gradient-to-tr"
              image={{
                dark1: FeatureCardCreateDark1,
                dark2: FeatureCardCreateDark2,
                light1: FeatureCardCreateLight1,
                light2: FeatureCardCreateLight2,
                alt: 'Something',
              }}
              title="Challenge Creation"
            />

            <CuratedTracksCard
              description="Tracks features curated TypeScript challenges, spanning various topics and difficulty levels, to advance your TypeScript skills."
              bgClass="lg:bg-gradient-to-tl"
              title="Curated Tracks"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default Features;
