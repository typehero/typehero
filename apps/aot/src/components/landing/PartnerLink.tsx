import ExtLink from './ExtLink';
import Image, { type StaticImageData } from 'next/image';

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
      key={partner.name}
      href={partner.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex-shrink-0 px-6 pb-3 pt-6 duration-300 hover:bg-black/5 focus:bg-black/5 active:bg-black/10 active:duration-75 md:flex-shrink md:pb-6 md:[mask-image:linear-gradient(to_bottom,red_calc(100%-2rem),transparent)] dark:hover:bg-white/5 dark:focus:bg-white/5 dark:active:bg-white/10"
    >
      <ExtLink />
      {partner.darkLogo ? (
        <>
          <Image
            src={partner.darkLogo}
            alt="TypeHero"
            className="hidden h-8 w-fit md:h-8 dark:block"
          />
          <Image src={partner.logo} alt="TypeHero" className="h-8 w-fit md:h-8 dark:hidden" />
        </>
      ) : (
        <Image src={partner.logo} alt="FrontendMasters" className="h-8 w-fit md:h-8" />
      )}
    </a>
  );
}
