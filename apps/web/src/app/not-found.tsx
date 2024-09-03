import { Button } from '@repo/ui/components/button';
import Image from 'next/image';
import { getRandomChallenge } from '~/utils/server/get-random-challenge';

export const dynamic = 'force-dynamic';

export default async function NotFound() {
  const randomChallengeSlug = await getRandomChallenge();

  return (
    <>
      <div className="-mt-[56px] pointer-events-none relative flex h-screen flex-col items-center justify-center gap-8 overflow-hidden [&>*]:pointer-events-auto">
        <Image
          className="-z-10 absolute left-0 mx-auto animate-amogfly opacity-80"
          alt="Early Access"
          src="/Red.webp"
          height="99"
          width="75"
        />
        <Image
          className="th-amogfly -z-10 absolute left-0 mx-auto opacity-80"
          alt="Early Access"
          src="/typehero.png"
          height="99"
          width="99"
        />
        <div className="stars -left-full -z-50 absolute mt-[56px] h-screen w-[200%]" />
        <div className="stars -left-full -z-40 absolute mt-[56px] h-1/2 w-[400%] scale-[2]" />
        <div className="stars -left-full -z-30 absolute mt-[56px] h-1/3 w-[600%] scale-[3]" />
        <div className="flex flex-col items-center justify-center">
          <h1 className="mb-4 font-bold font-mono text-4xl leading-tight opacity-60 md:text-9xl">
            404
          </h1>
          <p className="px-6 text-center font-mono text-base md:px-0 md:text-xl">
            Page not found, sus
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
                className="fancy-border-gradient relative mx-auto flex w-56 gap-4 border-none bg-background"
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
