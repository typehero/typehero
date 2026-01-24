import { Footsies } from '~/components/footsies';
import { ChallengeExplorerServer } from './challenge-explorer-server';

export const dynamic = 'force-dynamic';

export function Challenges() {
  return (
    <>
      <div className="flex flex-col py-8">
        <div className="container px-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Explore Challenges
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Explore the challenges. Embrace the opportunity to grow, learn, and showcase your
              <br className="hidden sm:block" />
              programming abilities. We hope you find the perfect challenge!
            </p>
          </div>
        </div>
        {/* <div className="container flex items-center justify-center">
          <BootPromo />
        </div> */}
        <div className="px-4 py-8">
          <ChallengeExplorerServer />
        </div>
      </div>
      <Footsies />
    </>
  );
}
