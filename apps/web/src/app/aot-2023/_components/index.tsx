import { Button } from '@repo/ui/components/button';
import { Github } from '@repo/ui/icons';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllFlags } from '~/utils/feature-flags';
import { CountdownTimer } from '../../_components/countdown-timer';
import { About } from './about';
import { CardGrid } from './card-grid';
import { Suspense } from 'react';
import { AOTCardSkeleton } from './aot-card-skeleton';

export async function AotLandingPage() {
  const featureFlags = await getAllFlags();
  if (!featureFlags.enableHolidayEvent) return notFound();

  return (
    <Suspense fallback={<AOTCardSkeleton />}>
      <div className="flex flex-col gap-5 pb-8 md:gap-10 md:py-5">
        <div className="container">
          <div className="relative mx-auto w-fit text-center">
            <div className="absolute left-0 top-0 -z-10 hidden h-full w-full transform-gpu bg-gradient-to-r from-red-500 via-red-600 to-green-500 opacity-70 blur-3xl sm:opacity-40 dark:block" />
            <h1 className="mb-10 mt-16 text-4xl font-bold tracking-tighter text-black sm:text-8xl dark:text-white">
              <span>Advent</span> of <span className="text-red-600">TypeScript</span>
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center gap-5">
            <CountdownTimer />
            <div className="flex w-full flex-col items-center justify-center gap-2 md:w-auto md:flex-row md:gap-5">
              <Link
                href="/aot-2023/wrapped"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white duration-300 md:mx-auto md:w-auto"
              >
                See the results!
              </Link>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://chat.typehero.dev"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-3 py-2 text-sm font-bold text-white duration-300 md:mx-auto md:w-auto dark:bg-[#5865F2]"
              >
                <svg
                  className="h-4 w-4 fill-current group-hover:rotate-[360deg]"
                  role="img"
                  style={{ transition: 'color 0s, transform 0.3s' }}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Discord</title>
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
                Join the Discord
              </a>
              <About className="w-full md:w-auto" />
              <Button
                asChild
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-2 md:w-auto dark:text-white"
                variant="outline"
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  className="gap-1 md:inline-flex"
                  href="https://github.com/typehero/typehero"
                >
                  <Github className="h-4 w-4" />
                  Star us on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
        <CardGrid />
      </div>
    </Suspense>
  );
}
