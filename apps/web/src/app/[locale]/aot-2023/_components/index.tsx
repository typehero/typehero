import { notFound } from 'next/navigation';
import { getAllFlags } from '~/utils/feature-flags';
import { CardGrid } from './card-grid';
import Image from 'next/image';

export async function AotLandingPage() {
  const featureFlags = await getAllFlags();
  if (!featureFlags.enableHolidayEvent) return notFound();

  return (
    <div className="flex flex-col gap-5 pb-8 md:gap-10 md:py-5">
      <div className="container">
        <h1 className="mb-10 text-center text-4xl font-bold tracking-tighter text-black dark:text-white sm:text-8xl">
          <span>Advent</span> of <span className="text-red-600">TypeScript</span>
        </h1>
        {/* <div className="flex items-center justify-center gap-10"> */}
        {/*   <Image src="/aot/deers.png" alt="Deers" height={150} width={130} /> */}
        {/*   <p className="text-xl font-semibold tracking-tight">asdasdasd</p> */}
        {/* </div> */}
      </div>
      <CardGrid />
    </div>
  );
}
