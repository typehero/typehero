import Image, { type StaticImageData } from 'next/image';
import ExtLink from './ExtLink';

interface PartnerLinkProps {
  partner: {
    name: string;
    url: string;
    logo: StaticImageData;
    darkLogo?: StaticImageData;
  };
}

export default function PartnerLink({ partner }: PartnerLinkProps) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-16 w-32 items-center justify-center rounded-lg bg-white/5 p-2 transition-all duration-300 [mask-image:linear-gradient(to_bottom,red_calc(100%-2rem),transparent)] hover:bg-black/5 md:flex-shrink dark:bg-black/5 dark:hover:bg-white/5 dark:focus:bg-white/5 dark:active:bg-white/10"
    >
      <ExtLink />
      {partner.darkLogo ? (
        <>
          <Image src={partner.darkLogo} alt="TypeHero" className="hidden h-8 w-fit dark:block" />
          <Image src={partner.logo} alt="TypeHero" className="h-8 w-fit md:h-8 dark:hidden" />
        </>
      ) : (
        <Image src={partner.logo} alt="FrontendMasters" className="h-8 w-fit md:h-8" />
      )}
    </a>
  );
}
