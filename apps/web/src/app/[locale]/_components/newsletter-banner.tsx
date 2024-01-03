import Link from 'next/link';
import { clsx } from 'clsx';
import { Mail } from '@repo/ui/icons';
import { Balancer } from 'react-wrap-balancer';
import styles from './newsletter.module.css';
import { Button } from '@repo/ui/components/button';
import { getScopedI18n } from '~/locales/server';

export async function NewsletterBanner() {
  const t = await getScopedI18n('landing.newsletter');

  return (
    <section className={clsx(styles.backdrop, 'relative overflow-hidden')}>
      <div className="container relative grid grid-cols-1 items-center justify-center py-[64px] md:grid-cols-2">
        <div className="flex flex-col gap-8 px-8 pb-8 pt-48 sm:px-16 sm:pt-20 md:px-0 md:pb-0 md:pt-16">
          <h1 className="max-w-[13ch] text-4xl font-bold md:max-w-none">
            <Balancer>{t('title')}</Balancer>
          </h1>
          <p className="leading-8 text-black/60 dark:text-white/50">
            <Balancer>{t('description')}</Balancer>
          </p>
        </div>
        <Button
          asChild
          className="group relative mx-8 w-fit overflow-hidden rounded-xl bg-gradient-to-bl from-indigo-400 via-blue-400 to-emerald-400 p-[2px] font-bold transition-all duration-300 hover:rounded-2xl active:rounded-xl active:duration-150 sm:mx-16 md:mx-auto md:mr-0 md:mt-16 md:-translate-x-[25%] md:scale-[1.5] md:hover:scale-[1.6] md:active:scale-[1.5] lg:mr-auto lg:translate-x-0"
        >
          <Link href="/newsletter">
            <span className="inline-flex h-full w-fit items-center gap-1 rounded-[10px] bg-white/90 px-4 py-2 text-black transition-all duration-300 group-hover:rounded-2xl group-hover:bg-white/0 group-hover:text-white dark:bg-black/80 dark:text-white group-hover:dark:bg-black/0 dark:group-hover:text-black">
              <Mail className="mr-1 h-4 w-4 stroke-[3]" />
              {t('subscribe')}
            </span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
