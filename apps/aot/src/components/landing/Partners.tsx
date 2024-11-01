import FrontendMasters from '../../../public/frontend-masters.svg';
import TypeHeroDark from '../../../public/typehero-dark.svg';
import TypeHero from '../../../public/typehero.svg';
import Image from 'next/image';
import ExtLink from './ExtLink';

export default function Partners() {
  return (
    <div className="relative flex w-36 flex-col text-center md:w-96 md:[mask-image:linear-gradient(to_bottom,red_calc(100%-2rem),transparent)]">
      <div className="font-extralight opacity-70 dark:opacity-30">Partners</div>
      <div className="mt-4 h-[1px] w-full bg-black/40 [mask-image:linear-gradient(to_right,transparent,red,transparent)] dark:bg-white/30" />
      <div className="absolute left-1/2 top-10 w-screen -translate-x-1/2 sm:w-[69vw] md:static md:w-auto md:translate-x-0 md:[mask-image:none]">
        <div className="mx-auto flex w-fit flex-wrap items-center justify-center md:flex-nowrap">
          <a
            href="https://frontendmasters.com/learn/typescript/"
            target="_blank"
            rel="noreferrer"
            className="group relative flex-shrink-0 px-6 pb-3 pt-3 duration-300 hover:bg-black/5 focus:bg-black/5 active:bg-black/10 active:duration-75 md:flex-shrink md:pb-6 dark:hover:bg-white/5 dark:focus:bg-white/5 dark:active:bg-white/10"
          >
            <ExtLink />
            <Image src={FrontendMasters} alt="FrontendMasters" className="h-8 w-fit md:h-12" />
          </a>
          <a
            href="https://typehero.dev/"
            target="_blank"
            rel="noreferrer"
            className="group relative flex-shrink-0 px-6 pb-3 pt-3 duration-300 hover:bg-black/5 focus:bg-black/5 active:bg-black/10 active:duration-75 md:flex-shrink md:pb-6 dark:hover:bg-white/5 dark:focus:bg-white/5 dark:active:bg-white/10"
          >
            <ExtLink />
            <Image
              src={TypeHeroDark}
              alt="TypeHero"
              className="hidden h-8 w-fit md:h-12 dark:block"
            />
            <Image src={TypeHero} alt="TypeHero" className="h-8 w-fit md:h-12 dark:hidden" />
          </a>
        </div>
      </div>
    </div>
  );
}
