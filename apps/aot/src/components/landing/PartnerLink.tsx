import ExtLink from '~/components/landing/ExtLink';
import Image, { type StaticImageData } from 'next/image';

interface PartnerLinkProps {
  partner: {
    name: string;
    url: string;
    logo: string;
    darkLogo?: StaticImageData;
  };
}

export default function PartnerLink({ partner }: PartnerLinkProps) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-16 w-32 items-center justify-center rounded-lg bg-white/5 p-2 transition-all duration-300 hover:scale-105 hover:bg-white/10 dark:bg-black/5 dark:hover:bg-black/10"
    >
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
