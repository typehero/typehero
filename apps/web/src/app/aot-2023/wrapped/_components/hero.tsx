import Image from 'next/image';

export function Hero() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      <Image
        src="/aot/hero-background.svg"
        layout="fill"
        objectFit="cover"
        alt="background with shapes"
        className="z-0 opacity-40"
      />
      <h1 className="z-10 text-center font-bold text-4xl tracking-tighter md:mb-5 md:text-8xl">
        Advent of <span className="text-red-600">Typescript</span>
      </h1>
      <div className="relative flex">
        <Image
          src="/aot/wrapped.png"
          width={150}
          height={150}
          alt=""
          className="-left-[150px] -scale-x-100 absolute transform"
        />
        <p className="z-10 font-bold text-4xl text-green-600 tracking-tighter md:text-8xl">
          Wrapped
        </p>
      </div>
    </div>
  );
}
