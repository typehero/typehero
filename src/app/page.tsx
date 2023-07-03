import Head from 'next/head';

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
      <div
        className="relative -mx-4 flex flex-col items-center justify-center gap-4 overflow-hidden px-4"
        style={{ minHeight: 'calc(100dvh - 112px)' }}
      >
        <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-[30%] -translate-y-[80%] rounded-full bg-[#3178c6] blur-3xl dark:bg-[#3178c6]/40"></div>
        <div className="absolute right-1/2 top-1/2 -z-10 h-96 w-96 -translate-y-[80%] translate-x-[30%] rounded-full bg-[#3178c6]/20 blur-3xl dark:bg-[#3178c6]/20"></div>
        <h1 className="bg-gradient-to-r from-[#3178c6] to-white bg-clip-text text-center text-9xl font-black tracking-tighter text-transparent dark:to-white ">
          Type
          <br />
          Hero
        </h1>
        <p className="font-bold">Challenge. Learn. Excel.</p>

        <p className="max-w-[40ch] text-center text-black/50 dark:text-white/50">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis ullam quia vitae culpa
          illum libero dignissimos, voluptas eius molestiae ipsum!
        </p>
      </div>
    </>
  );
}
