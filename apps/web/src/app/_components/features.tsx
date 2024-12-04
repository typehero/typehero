import { Balancer } from 'react-wrap-balancer';
import clsx from 'clsx';
import Image from 'next/image';
import DogeSmile from '~/assets/images/doge.webp';
import FeatureCardChallengeDark1 from '~/assets/images/feature_card_challenge_dark1.png';
import FeatureCardChallengeDark2 from '~/assets/images/feature_card_challenge_dark2.png';
import FeatureCardChallengeLight1 from '~/assets/images/feature_card_challenge_light1.png';
import FeatureCardChallengeLight2 from '~/assets/images/feature_card_challenge_light2.png';
import Step1Dark1 from '~/assets/images/step1dark1.png';
import Step1Dark2 from '~/assets/images/step1dark2.png';
import Step1Light1 from '~/assets/images/step1light1.png';
import Step1Light2 from '~/assets/images/step1light2.png';
import Step2Light1 from '~/assets/images/step2light1.png';
import Step2Light2 from '~/assets/images/step2light2.png';
import Step2Dark1 from '~/assets/images/step2dark1.png';
import Step2Dark2 from '~/assets/images/step2dark2.png';
import Step3Light from '~/assets/images/step3light.png';
import Step3Dark from '~/assets/images/step3dark.png';
import {
  ImageCard,
  CollaborativeEnvironmentCard,
  ChallengeCreationCard,
  CuratedTracksCard,
} from './feature-card';

export function Features() {
  return (
    <section className="relative overflow-hidden" id="features">
      <div className="mx-auto mb-[64px] grid max-w-[1400px] items-center justify-center px-4 sm:px-24 md:px-4 lg:px-24">
        <div className="flex flex-col items-center justify-center gap-16">
          <div className="mt-1 flex flex-col gap-3 px-4 text-center sm:px-0">
            <a
              className="mx-auto hidden rounded-full bg-gradient-to-r from-[#31bdc6] to-[#3178c6] p-[1px] brightness-90 contrast-150 focus:outline-none focus:ring-blue-600 focus-visible:ring-2 sm:block dark:brightness-125 dark:contrast-100"
              href="#features"
            >
              <div className="group relative overflow-hidden rounded-full bg-white/80 px-3 py-1 duration-300 hover:pr-9 dark:bg-black/80">
                <span className="select-none bg-gradient-to-r from-[#31bdc6] to-[#3178c6] bg-clip-text text-transparent">
                  <svg
                    className="mr-1 inline-block h-4 w-4 fill-[#31bdc6]"
                    viewBox="4 4 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m19.2 36.4-4.75-10.45L4 21.2l10.45-4.75L19.2 6l4.75 10.45L34.4 21.2l-10.45 4.75ZM36.4 42l-2.35-5.25-5.25-2.35 5.25-2.4 2.35-5.2 2.4 5.2 5.2 2.4-5.2 2.35Z" />
                  </svg>
                  many features, wow{' '}
                  <Image
                    className="absolute -bottom-1 right-1 translate-y-7 duration-300 group-hover:translate-y-0"
                    alt="doge smile"
                    height="28"
                    width="28"
                    src={DogeSmile}
                  />
                </span>
              </div>
            </a>
            <h1 className="text-4xl font-bold">
              <Balancer>What's in TypeHero?</Balancer>
            </h1>
            <p className="text-black/60 dark:text-white/50">
              <Balancer>All you need to become a TypeScript menace</Balancer>
            </p>
          </div>
          <div className="relative z-10 grid w-full gap-4 md:grid-cols-2 lg:gap-8 [&>*:nth-child(3)]:hidden md:[&>*:nth-child(3)]:block">
            <ImageCard
              imgClass1={clsx(
                'pointer-events-none transition-transform duration-500 bg-neutral-50/30 dark:bg-neutral-800/30',
                'scale-[150%] sm:scale-100 md:scale-100 max-md:rounded-sm rounded-xl top-[69%] left-[69px] md:top-auto w-[42%] sm:top-[50%] md:-bottom-[1%] xl:-bottom-[11%] sm:left-[40px] md:w-[69%]',
                'md:group-hover:translate-x-2 md:group-hover:scale-95',
              )}
              imgClass2={clsx(
                'pointer-events-none transition-transform duration-500 bg-neutral-50/50 dark:bg-zinc-800/60 backdrop-blur-sm translate-x-0',
                'scale-[190%] sm:scale-[120%] md:scale-100 rounded-2xl max-md:rounded-md left-[50%] sm:top-[49%] top-[69%] md:top-auto w-[50%] sm:left-[39%] md:-bottom-[2%] xl:-bottom-[12%] md:w-[77%]',
                'md:group-hover:scale-105 md:group-hover:-translate-x-2',
              )}
              description="Engage in TypeScript challenges to strengthen your grasp of the type system and advanced features"
              bgClass="md:bg-gradient-to-br"
              image={{
                dark1: FeatureCardChallengeDark2,
                dark2: FeatureCardChallengeDark1,
                light1: FeatureCardChallengeLight2,
                light2: FeatureCardChallengeLight1,
                alt: 'Something',
              }}
              title="Type Challenges"
            />
            <CollaborativeEnvironmentCard
              description="Developers can share solutions and engage in discussions through commenting"
              bgClass="md:bg-gradient-to-bl"
              title="Collaborative Environment"
            />
            <ChallengeCreationCard
              step1img1Class={clsx(
                'pointer-events-none w-[50%] border border-zinc-300/50 transition-all duration-500 dark:border-zinc-700/50',
                'max-md:scale-[160%] max-md:rounded-xl rounded-2xl left-[25%] top-[57%] md:left-[35px] md:top-[41%]',
                'md:group-hover:translate-y-2',
              )}
              step1img2Class={clsx(
                'pointer-events-none w-[60%] border border-zinc-300/50 dark:border-zinc-700/50 transition-all duration-500 overflow-hidden',
                'max-md:scale-[160%] rounded-xl max-md:rounded-lg left-[69%] top-[53%] md:top-[41%] md:left-[calc(50%+35px+1rem)]',
                'md:group-hover:-translate-y-6',
              )}
              step2img1Class={clsx(
                'pointer-events-none w-[50%] rounded-t-xl overflow-hidden border border-zinc-300 transition-all duration-500 dark:border-zinc-700',
                'max-md:scale-[160%] left-[25%] top-[69%] md:left-[35px] md:top-[30%]',
                'md:group-hover:translate-y-2',
              )}
              step2img2Class={clsx(
                'pointer-events-none w-[110%] rounded-t-xl border border-zinc-300 dark:border-zinc-700 transition-all duration-500 rounded-xl overflow-hidden group-hover:-translate-y-6',
                'max-md:scale-[140%] left-[70%] top-[53%] md:top-[30%] md:left-[calc(50%+35px+1rem)]',
                'md:group-hover:-translate-y-6',
              )}
              step3imgClass={clsx(
                'pointer-events-none w-[90%] border border-zinc-300 dark:border-zinc-700 rounded-t-2xl transition-all duration-500 overflow-hidden',
                'left-[5%] top-[50%] md:top-[30%] md:left-1/2 md:left-[35px]',
              )}
              description="Craft your own coding challenges to share with the TypeHero community"
              bgClass="md:bg-gradient-to-tr"
              image={{
                step1dark1: Step1Dark1,
                step1dark2: Step1Dark2,
                step1light1: Step1Light1,
                step1light2: Step1Light2,
                step2dark1: Step2Dark1,
                step2dark2: Step2Dark2,
                step2light1: Step2Light1,
                step2light2: Step2Light2,
                step3dark: Step3Dark,
                step3light: Step3Light,
                alt: 'Something',
              }}
              title="Challenge Creation"
            />
            <CuratedTracksCard
              description="Tracks are curated challenges, spanning various topics and difficulty levels, to advance your TypeScript skills."
              bgClass="md:bg-gradient-to-tl"
              title="Learning Tracks"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
