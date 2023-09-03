import { Github, Mail, Twitter } from '@repo/ui/icons';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import { Button } from '@repo/ui';
import { HeroIllustration } from './hero-illustration';
import { getScopedI18n } from '~/locales/server';

function TypeHeroLogo() {
  return (
    <svg
      className="h-28 w-28 rounded-3xl sm:h-44 sm:w-44 sm:rounded-[2rem]"
      fill="none"
      viewBox="0 0 164 164"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 29.8182C0 13.3501 13.3501 0 29.8182 0H134.182C150.65 0 164 13.3501 164 29.8182V134.182C164 150.65 150.65 164 134.182 164H29.8182C13.3501 164 0 150.65 0 134.182V29.8182Z"
        fill="#3178C6"
      />
      <path
        clipRule="evenodd"
        d="M71.4351 80.307H91.9394V67.0909H34.7879V80.307H55.1919V139.152H71.4351V80.307Z"
        fill="white"
        fillRule="evenodd"
      />
      <path
        d="M91.9394 139.152V67.0909H106.946V96.9549H129.078V67.0909H144.121V139.152H129.078V109.182H106.946V139.152H91.9394Z"
        fill="white"
      />
    </svg>
  );
}

async function Hero() {
  const t = await getScopedI18n('landing.hero')

  return (
    <section className="-mt-[56px] min-h-[calc(100vh)] overflow-hidden lg:min-h-0 lg:pt-[56px]">
      <div className="container grid min-h-screen items-center justify-center lg:min-h-0 lg:grid-cols-2">
        <div className="flex w-full flex-col items-center justify-center gap-10 lg:items-start">
          <div className="relative flex w-full items-center justify-center gap-4 lg:justify-start">
            <div className="absolute left-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-x-[15%] -translate-y-[50%] rounded-full bg-slate-400/10 blur-3xl dark:block" />
            <div className="absolute right-1/2 top-1/2 -z-10 hidden h-56 w-56 -translate-y-[40%] rounded-full bg-[#3178c6]/20 blur-3xl dark:block" />
            <TypeHeroLogo />
            <h1 className="bg-gradient-to-r from-[#3178c6] to-black bg-clip-text text-6xl font-extrabold text-transparent dark:to-white sm:text-8xl sm:leading-[5.5rem]">
              type
              <br />
              hero
            </h1>
          </div>

          <p className="max-w-[55ch] bg-transparent px-8 text-center font-medium leading-8 text-black/60 dark:text-white/50 lg:px-0 lg:text-left">
            <Balancer>
              {t('description')}
            </Balancer>
          </p>
          <div className="flex flex-col gap-3 md:flex-row">
            <Button
              asChild
              className="hero-join-button group relative mx-auto w-fit overflow-hidden rounded-xl p-[2px] font-bold transition-all duration-300 hover:bg-transparent hover:shadow-[0_0_2rem_-0.5rem_#3178c6] dark:hidden md:mr-0 lg:mr-auto"
            >
              <Link href="/waitlist">
                <span className="inline-flex h-full w-fit items-center gap-1 rounded-[10px] bg-white px-4 py-2 text-[#3178c6] transition-all duration-300">
                  <Mail className="mr-1 h-4 w-4 stroke-[3]" />
                  {t('buttons.waitlist')}
                </span>
              </Link>
            </Button>
            <Button
              asChild
              className="hero-join-button-dark group relative mx-auto hidden w-fit overflow-hidden rounded-xl p-[1px] font-bold transition-all duration-300 dark:block dark:hover:shadow-[0_0_2rem_-0.5rem_#fff8] md:mr-0 lg:mr-auto"
            >
              <Link href="/waitlist">
                <span className="inline-flex h-full w-fit items-center gap-1 rounded-xl px-4 py-2 transition-all duration-300 dark:bg-neutral-900 dark:text-white group-hover:dark:bg-black">
                  <Mail className="mr-1 h-4 w-4 stroke-[3]" />
                  {t('buttons.waitlist')}
                </span>
              </Link>
            </Button>
            <Button
              asChild
              className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
              variant="outline"
            >
              <a
                target="_blank"
                rel="noreferrer"
                className="gap-1 md:inline-flex"
                href="https://github.com/typehero/typehero"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button
              asChild
              className="flex items-center gap-2 rounded-xl border-2 px-4 py-2 dark:text-white"
              variant="outline"
            >
              <a
                target="_blank"
                rel="noreferrer"
                className="gap-1 md:inline-flex"
                href="https://twitter.com/typeheroapp"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </a>
            </Button>
          </div>
        </div>

        <HeroIllustration />
      </div>
    </section>
  );
}
export default Hero;
