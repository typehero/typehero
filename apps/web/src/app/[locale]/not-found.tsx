import { Button } from '@repo/ui/components/button';
import { BackgroundGrid } from './_components/hero-illustration';
import { getRandomChallenge } from '~/utils/server/get-random-challenge';

export default async function NotFound() {
  const randomChallengeSlug = await getRandomChallenge();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <div className="absolute inset-10 -z-30  overflow-hidden rounded-full opacity-70 lg:hidden">
        <BackgroundGrid />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-mono text-9xl font-bold leading-tight md:text-[12rem]">404</h1>
        <p className=" px-6 text-center font-mono text-base md:px-0 md:text-xl">
          Looks Like You Took a Wrong Turn at the Interface. <br className="hidden md:inline" />
          Let's Get You Back on Track
        </p>
      </div>
      {randomChallengeSlug !== null ? (
        <div className="flex gap-4 ">
          <a href="/explore">
            <Button variant="default" size="lg">
              Go to explore
            </Button>
          </a>
          <a href={`/challenge/${randomChallengeSlug}`}>
            <Button
              variant="outline"
              size="lg"
              className="fancy-border-gradient hover:bg-background relative mx-auto flex gap-4 border-none"
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
  );
}
