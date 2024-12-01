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
    <div className="relative flex w-36 flex-col pb-20 text-center">
      <div className="font-extralight opacity-70 dark:opacity-30">Partners</div>
      {/* divider */}
      <div className="mt-4 h-[1px] w-full bg-black/40 [mask-image:linear-gradient(to_right,transparent,red,transparent)] dark:bg-white/30" />
      {/* scroll-wrap for mobile carousel */}
      <div className="absolute left-1/2 top-[calc(2.5rem+1px)] w-screen max-w-[600px] -translate-x-1/2 [mask-image:linear-gradient(to_right,transparent,red,transparent)] md:w-screen md:[mask-image:none]">
        <div className="hidden flex-nowrap items-center justify-center md:flex">
          {partners.map((partner) => {
            return <PartnerLink key={`partners-${partner.name}`} partner={partner} />;
          })}
        </div>
        <div className="infinite-scroll-x flex flex-nowrap items-center md:hidden">
          {[...partners, ...partners].map((partner, i) => {
            console.log(`infinite-partners-${partner.name}-${i}`);
            return <PartnerLink key={`infinite-partners-${partner.name}-${i}`} partner={partner} />;
          })}
        </div>
      </div>
    </div>
  );
}
