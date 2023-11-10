import Image from 'next/image';
import { Button } from '@repo/ui/components/button';
import { getRandomChallenge } from '~/utils/server/get-random-challenge';
import { getScopedI18n } from '~/locales/server';

export default async function NotFound() {
  const t = await getScopedI18n('404');

  const randomChallengeSlug = await getRandomChallenge();

  return (
    <>
      <div className="relative -mt-[56px] flex h-screen flex-col items-center justify-center gap-8 overflow-hidden">
        <Image
          className="animate-amogfly absolute left-0 -z-10 mx-auto opacity-80"
          alt="Early Access"
          src="/Red.webp"
          height="99"
          width="75"
        />
        <Image
          className="th-amogfly absolute left-0 -z-10 mx-auto opacity-80"
          alt="Early Access"
          src="/typehero.png"
          height="99"
          width="99"
        />
        <div className="stars absolute -left-full -z-50 mt-[56px] h-screen w-[200%]" />
        <div className="stars absolute -left-full -z-40 mt-[56px] h-1/2 w-[400%] scale-[2]" />
        <div className="stars absolute -left-full -z-30 mt-[56px] h-1/3 w-[600%] scale-[3]" />
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 font-mono text-4xl font-bold leading-tight opacity-60 md:text-9xl">
            404
          </h1>
          <p className="px-6 text-center font-mono text-base md:px-0 md:text-xl">
            {/* Looks Like You Took a Wrong Turn at the Interface. <br className="hidden md:inline" />
          Let's Get You Back on Track */}
            {t('message')}
          </p>
        </div>
        {randomChallengeSlug !== null ? (
          <div className="flex flex-col gap-4">
            <a href="/explore">
              <Button className="w-56" variant="default" size="lg">
                Go to explore
              </Button>
            </a>
            <a href={`/challenge/${randomChallengeSlug}`}>
              <Button
                variant="outline"
                size="lg"
                className="fancy-border-gradient bg-background relative mx-auto flex w-56 gap-4 border-none"
              >
                I'm feeling lucky
              </Button>
            </a>
          </div>
        ) : (
          <div>
            <a href="/">
              <Button variant="default" size="lg">
                Go to home
              </Button>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
