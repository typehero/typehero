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
        <div className="absolute left-1/2 top-1/2 -z-10 hidden h-64 w-64 -translate-x-[30%] -translate-y-[69%] rounded-full bg-white/20 blur-3xl dark:block lg:h-96 lg:w-96"></div>
        <div className="absolute right-1/2 top-1/2 -z-10 hidden h-64 w-64 -translate-y-[69%] translate-x-[30%] rounded-full bg-[#3178c6]/20 blur-3xl dark:block lg:h-96 lg:w-96"></div>
        <h1 className="bg-gradient-to-r from-[#3178c6] to-black bg-clip-text text-center text-9xl font-black text-transparent dark:to-white">
          Type
          <br />
          Hero
        </h1>
        <p className="font-bold">💪 Challenge 🧠 Learn 📈 Excel</p>

        <p className="max-w-[40ch] text-center text-neutral-400 dark:text-neutral-600">
          Unlock the power of strong typing and seamless JavaScript integration on our immersive
          learning platform designed for developers of all levels
        </p>
      </div>
      <Footsies />
    </>
  );
}
