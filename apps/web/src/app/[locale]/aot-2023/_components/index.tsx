import { notFound } from 'next/navigation';
import { getAllFlags } from '~/utils/feature-flags';
import { CardGrid } from './card-grid';

export async function AotLandingPage() {
  const featureFlags = await getAllFlags();
  if (!featureFlags.enableHolidayEvent) return notFound();

  return (
    <div className="flex flex-col gap-5 pb-8 md:gap-10 md:py-5">
      <div className="container">
        {/* <p className="max-w-[69ch] text-lg leading-7 text-neutral-600 dark:text-white/50 sm:px-8 md:px-0"> */}
        {/*   Amidst the{' '} */}
        {/*   <span className="font-semibold text-red-600 dark:text-red-400"> */}
        {/*     12 Days of TypeScript */}
        {/*   </span> */}
        {/*   , my coding workshop turned into a festive frenzy! Bugs were jingled away, interfaces */}
        {/*   decked with digital tinsel, and puzzling challenges twinkled like digital ornaments! Every */}
        {/*   win felt like unwrapping a virtual gift, turning those Twelve Days into a tech */}
        {/*   wonderland—a merry, coding celebration of joy and cheer! */}
        {/* </p> */}
      </div>
      <CardGrid />
    </div>
  );
}
