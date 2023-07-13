import Head from 'next/head';
import { Footsies } from '~/components/ui/footsies';

export default function Index() {
  return (
    <>
      <Head>
        <title>Typehero</title>
        <meta
          name="description"
          content="Level up your typescript skills with interactive exercises"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <div className="relative mb-[56px] flex min-h-[calc(100dvh-112px)] flex-col items-center justify-center gap-4 overflow-x-hidden overflow-y-visible px-4">
        <div className="absolute left-1/2 top-1/2 -z-10 hidden h-64 w-64 -translate-x-[30%] -translate-y-1/2 rounded-full bg-white/20 blur-3xl dark:block lg:h-96 lg:w-96"></div>
        <div className="absolute right-1/2 top-1/2 -z-10 hidden h-64 w-64 -translate-y-1/2 translate-x-[30%] rounded-full bg-[#3178c6]/20 blur-3xl dark:block lg:h-96 lg:w-96"></div>
        <h1 className="relative bg-gradient-to-r from-[#3178c6] to-black bg-clip-text text-center text-9xl font-black text-transparent dark:to-white">
          Type
          <br />
          Hero
          <div
            id="challengeWrap"
            className="absolute left-1/2 top-1/2 w-[175%] origin-center -translate-x-1/2 -translate-y-1/2 text-left text-xl font-bold text-yellow-500 dark:text-yellow-400"
          >
            <div
              id="challenge"
              className="max-w-fit -translate-x-1/2 -translate-y-1/2"
              style={{ textShadow: '0 0 1rem #eab30869' }}
            >
              💪 Challenge
            </div>
          </div>
          <div
            id="learnWrap"
            className="absolute left-1/2 top-1/2 w-[175%] origin-center -translate-x-1/2 -translate-y-1/2 text-left text-xl font-bold text-pink-600 dark:text-pink-400"
          >
            <div
              id="learn"
              className="max-w-fit -translate-x-1/2 -translate-y-1/2"
              style={{ textShadow: '0 0 1rem #ec489969' }}
            >
              🧠 Learn
            </div>
          </div>
          <div
            id="excelWrap"
            className="absolute left-1/2 top-1/2 w-[175%] origin-center -translate-x-1/2 -translate-y-1/2 text-left text-xl font-bold text-green-600 dark:text-green-400"
          >
            <div
              id="excel"
              className="max-w-fit -translate-x-1/2 -translate-y-1/2"
              style={{ textShadow: '0 0 1rem #22c55e69' }}
            >
              ✅ Excel
            </div>
          </div>
        </h1>
      </div>
      <p className="mx-auto h-[60vh] max-w-[69ch] bg-transparent p-8 text-justify text-lg leading-10 text-neutral-600 dark:text-neutral-400">
        &emsp;Connect and collaborate with a community of TypeScript developers on Type Hero. Engage
        in discussions, create challenges, and share insights with fellow typescript enthusiasts.
        Type Hero has collaborative coding challenges that foster a supportive and inspiring
        environment, where you can learn from others and showcase your expertise.
      </p>
      <Footsies />
    </>
  );
}
