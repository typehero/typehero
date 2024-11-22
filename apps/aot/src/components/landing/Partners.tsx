import FrontendMasters from '../../../public/frontend-masters.svg';
import TypeHeroDark from '../../../public/typehero-dark.svg';
import TypeHero from '../../../public/typehero.svg';
import Sentry from '../../../public/sentry.svg';
import PartnerLink from './PartnerLink';

const partners = [
  {
    name: 'Sentry',
    url: 'https://sentry.io/',
    logo: Sentry,
  },
  {
    name: 'TypeHero',
    url: 'https://typehero.dev/',
    logo: TypeHero,
    darkLogo: TypeHeroDark,
  },
  {
    name: 'FrontendMasters',
    url: 'https://frontendmasters.com/learn/typescript/',
    logo: FrontendMasters,
  },
];

export default function Partners() {
  return (
    <div className="relative flex w-36 flex-col text-center md:w-full">
      <div className="w-full">
        <div className="font-extralight opacity-70 dark:opacity-30">Partners</div>
        {/* divider */}
        <div className="mt-4 h-[1px] w-full bg-black/40 [mask-image:linear-gradient(to_right,transparent,red,transparent)] dark:bg-white/30" />
        {/* scroll-wrap for mobile carousel */}
        <div className="relative mt-6 overflow-hidden">
          <div className="flex w-full items-center justify-start overflow-x-auto scroll-smooth md:justify-center md:overflow-x-visible">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex-shrink-0 px-2 transition-transform duration-300 ease-in-out hover:scale-105"
              >
                <PartnerLink partner={partner} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
