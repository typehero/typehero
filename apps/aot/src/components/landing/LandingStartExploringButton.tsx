import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

export const LandingStartExploringButton = () => {
  const aotStarted = Date.now() >= new Date(Date.UTC(2024, 11, 1, 5, 0, 0)).getTime();
  return aotStarted ? <StartExploringButton /> : <div />;
};

export const StartExploringButton = () => {
  return (
    <Button
      asChild
      className="hero-join-button-dark hidden w-fit overflow-hidden rounded-xl p-[1px] font-bold transition-all duration-300 dark:block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8]"
      variant="outline"
    >
      <Link href="/events/2024">
        <span className="inline-flex h-full w-fit items-center gap-2 rounded-xl px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
          Start the Challenge!
        </span>
      </Link>
    </Button>
  );
};
