import Image from 'next/image';

export function UserSummary() {
  return (
    <div className="h-screen w-full bg-red-600 text-white">
      <div className="flex h-full">
        <div className="hidden h-full w-full items-center justify-center border-r border-r-white/50 md:flex">
          <Image src="/aot/santa_flying.png" width={200} height={200} alt="" className="" />
        </div>
        <div className="relative h-full w-full p-6">
          <div className="absolute left-6 top-6 text-4xl font-semibold tracking-tighter md:text-5xl">
            General Metrics
          </div>
          <div className="flex h-full flex-col gap-7 pt-36 md:justify-center md:pt-0">
            <Image
              src="/aot/santa_flying.png"
              width={100}
              height={100}
              alt=""
              className="md:hidden"
            />
            <div className="flex items-center gap-5">
              <div className="text-2xl font-bold md:text-6xl">13K</div>
              <div className="text-xl md:text-2xl">Accounts Created</div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-2xl font-bold md:text-6xl">100K</div>
              <div className="text-xl md:text-2xl">Visited the AOT page</div>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-2xl font-bold md:text-6xl">250K</div>
              <div className="text-xl md:text-2xl">Total Submissions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
