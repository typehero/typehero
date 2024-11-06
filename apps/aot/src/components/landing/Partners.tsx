import FrontendMasters from '../../../public/frontend-masters.svg';
import TypeHeroDark from '../../../public/typehero-dark.svg';
import TypeHero from '../../../public/typehero.svg';
import Image from 'next/image';
import ExtLink from './ExtLink';

const partners = [
  {
    name: 'FrontendMasters',
    url: 'https://frontendmasters.com/learn/typescript/',
    logo: FrontendMasters,
  },
  {
    name: 'TypeHero',
    url: 'https://typehero.dev/',
    logo: TypeHero,
    darkLogo: TypeHeroDark,
  },
];

export default function Partners() {
  return (
    <div className="relative flex w-36 flex-col text-center md:w-96 md:[mask-image:linear-gradient(to_bottom,red_calc(100%-2rem),transparent)]">
      <div className="font-extralight opacity-70 dark:opacity-30">Partners</div>
      {/* divider */}
      <div className="mt-4 h-[1px] w-full bg-black/40 [mask-image:linear-gradient(to_right,transparent,red,transparent)] dark:bg-white/30" />
      {/* scroll-wrap for mobile carousel */}
      <div className="absolute left-1/2 top-10 w-screen -translate-x-1/2 sm:w-[69vw] md:static md:w-auto md:translate-x-0 md:[mask-image:none]">
        <div className="mx-auto flex w-fit flex-wrap items-center justify-center md:flex-nowrap">
          {partners.map((partner) => {
            return (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noreferrer"
                className="group relative flex-shrink-0 px-6 pb-3 pt-3 duration-300 hover:bg-black/5 focus:bg-black/5 active:bg-black/10 active:duration-75 md:flex-shrink md:pb-6 dark:hover:bg-white/5 dark:focus:bg-white/5 dark:active:bg-white/10"
              >
                <ExtLink />
                {partner.darkLogo ? (
                  <>
                    <Image
                      src={partner.darkLogo}
                      alt="TypeHero"
                      className="hidden h-8 w-fit md:h-12 dark:block"
                    />
                    <Image
                      src={partner.logo}
                      alt="TypeHero"
                      className="h-8 w-fit md:h-12 dark:hidden"
                    />
                  </>
                ) : (
                  <Image src={partner.logo} alt="FrontendMasters" className="h-8 w-fit md:h-12" />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
