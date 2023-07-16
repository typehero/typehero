import Head from 'next/head';
import { Footsies } from '~/components/ui/footsies';

export default async function Index() {
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
      <div className="mb-[56px] flex min-h-[calc(100dvh-112px)] flex-col items-center justify-center gap-24 overflow-x-hidden overflow-y-visible px-8 py-24">
        <h1 className="relative bg-gradient-to-r from-[#3178c6] to-black bg-clip-text text-center text-8xl font-black text-transparent dark:to-white md:text-9xl">
          <div className="absolute left-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-x-[30%] -translate-y-1/2 rounded-full bg-white/20 blur-2xl dark:block lg:h-96 lg:w-96 lg:blur-3xl"></div>
          <div className="absolute right-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-y-1/2 translate-x-[30%] rounded-full bg-[#3178c6]/20 blur-2xl dark:block lg:h-96 lg:w-96 lg:blur-3xl"></div>
          Type
          <br />
          Hero
        </h1>
        <p className="mx-auto max-w-[67ch] bg-transparent text-lg leading-9 text-neutral-600 dark:text-neutral-500">
          &emsp;Connect and collaborate with a community of TypeScript developers on Type Hero.
          Engage in discussions, create challenges, and share insights with fellow typescript
          enthusiasts. Type Hero has collaborative coding challenges that foster a supportive and
          inspiring environment, where you can learn from others and showcase your expertise.
        </p>
      </div>
      <Footsies />
    </>
  );
}
