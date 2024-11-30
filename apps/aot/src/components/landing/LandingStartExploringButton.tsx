import { Button } from '@repo/ui/components/button';
import Link from 'next/link';

export const LandingStartExploringButton = () => {
  let aotStarted = Date.now() >= new Date(Date.UTC(2024, 11, 1, 5, 0, 0)).getTime();
  aotStarted = true;
  return aotStarted ? <StartExploringButton /> : <div />;
};

export const StartExploringButton = () => {
  return (
    <Button
      asChild
      className="hero-join-button-dark z-10 mx-auto -mb-32 mt-32 w-fit overflow-hidden rounded-xl border-none p-[1px] font-bold shadow-[-2rem_0_2rem_0_#34d39944,2rem_0_2rem_0_#fb718544] transition-all duration-300 hover:shadow-[-6rem_0_2rem_-1.25rem_#34d399,6rem_0_2rem_-1.25rem_#fb7185]"
      variant="outline"
    >
      <Link href="/events/2024">
        <span className="inline-flex h-full w-fit items-center gap-2 rounded-[0.66rem]  bg-gradient-to-r from-emerald-500 to-rose-500 px-4 py-2 text-white transition-all duration-300 dark:rounded-xl dark:from-neutral-900 dark:to-neutral-950 dark:text-white group-hover:dark:bg-black">
          Start the Challenge!
        </span>
      </Link>
    </Button>
  );
};
