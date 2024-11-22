import FrontendMasters from '../../../public/frontend-masters.svg';
import TypeHeroDark from '../../../public/typehero-dark.svg';
import TypeHero from '../../../public/typehero.svg';
import Sentry from '../../../public/sentry.svg';
import PartnerLink from './PartnerLink';

const partners = [
  {
    name: 'FrontendMasters',
    url: 'https://frontendmasters.com/learn/typescript/',
    logo: FrontendMasters,
  },
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
];

export default function Partners() {
  return (
    <div className="relative flex w-36 flex-col text-center">
      <div className="font-extralight opacity-70 dark:opacity-30">Partners</div>
      {/* divider */}
      <div className="mt-4 h-[1px] w-full bg-black/40 [mask-image:linear-gradient(to_right,transparent,red,transparent)] dark:bg-white/30" />
      {/* scroll-wrap for mobile carousel */}
      <div className="absolute left-1/2 top-[calc(2.5rem+1px)] w-screen -translate-x-1/2">
        <div className="mx-auto flex w-fit flex-nowrap items-center justify-center md:flex-nowrap">
          {partners.map((partner) => {
            return <PartnerLink key={partner.name} partner={partner} />;
          })}
        </div>
      </div>
    </div>
  );
}
