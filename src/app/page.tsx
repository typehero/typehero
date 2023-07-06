'use client';

import Head from 'next/head';
import { useRef, useEffect } from 'react';
import { Footsies } from '~/components/ui/footsies';

export default function Index() {
  // cursor blob
  const blobRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const blob = document.getElementById('cursorthing') as HTMLDivElement;
    blobRef.current = blob;
    window.addEventListener('mousemove', moveBlob);
    function moveBlob(e: MouseEvent) {
      blob.style.translate = `${e.clientX - blob.clientWidth / 2}px ${
        e.clientY - blob.clientHeight / 2
      }px`;
    }

    return () => {
      window.removeEventListener('mousemove', moveBlob);
    };
  }, []);

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
        className="relative mb-[56px] flex flex-col items-center justify-center gap-4 overflow-x-hidden overflow-y-visible px-4"
        style={{ minHeight: 'calc(100dvh - 112px)' }}
      >
        <div
          id="leftBall"
          className="absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-[30%] -translate-y-[69%] rounded-full bg-black/0 blur-3xl dark:bg-white/20 lg:h-96 lg:w-96"
        ></div>
        <div
          id="riteBall"
          className="absolute right-1/2 top-1/2 -z-10 h-64 w-64 -translate-y-[69%] translate-x-[30%] rounded-full bg-[#3178c6]/0 blur-3xl dark:bg-[#3178c6]/20 lg:h-96 lg:w-96"
        ></div>
        <div
          id="cursorthing"
          className="pointer-events-none fixed left-0 top-0 z-10 h-20 w-20 rounded-full border border-neutral-400 duration-75 ease-out dark:border-neutral-700"
        />
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
