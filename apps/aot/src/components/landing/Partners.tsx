import FrontendMasters from '../../../public/frontend-masters.svg';
import TypeHeroDark from '../../../public/typehero-dark.svg';
import TypeHero from '../../../public/typehero.svg';
import Sentry from '../../../public/sentry.svg';
import PartnerLink from './PartnerLink';
import Image from 'next/image';

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
        <div className="mt-6">
          <div className="absolute left-1/2 flex w-screen -translate-x-1/2 items-center justify-center overflow-x-hidden px-5">
            {partners.map((partner) => (
              <PartnerLink key={partner.name} partner={partner} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
