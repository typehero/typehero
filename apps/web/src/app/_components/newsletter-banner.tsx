import { Button } from '@repo/ui/components/button';
import { Mail } from '@repo/ui/icons';
import { clsx } from 'clsx';
import Link from 'next/link';
import { Balancer } from 'react-wrap-balancer';
import styles from './newsletter.module.css';

export async function NewsletterBanner() {
  return (
    <section className={clsx(styles.backdrop, 'relative overflow-hidden')}>
      <div className="container relative grid grid-cols-1 items-center justify-center py-[64px] md:grid-cols-2">
        <div className="flex flex-col gap-8 px-8 pt-48 pb-8 sm:px-16 sm:pt-20 md:px-0 md:pt-16 md:pb-0">
          <h1 className="max-w-[13ch] font-bold text-4xl md:max-w-none">
            <Balancer>Stay Informed</Balancer>
          </h1>
          <p className="text-black/60 leading-8 dark:text-white/50">
            <Balancer>
              Interested in the future of the platform? Be the first to get updates on content, new
              features, and more!
            </Balancer>
          </p>
        </div>
        <Button
          asChild
          className="group md:-translate-x-[25%] relative mx-8 w-fit overflow-hidden rounded-xl bg-gradient-to-bl from-indigo-400 via-blue-400 to-emerald-400 p-[2px] font-bold transition-all duration-300 hover:rounded-2xl active:rounded-xl active:duration-150 sm:mx-16 md:mx-auto md:mt-16 md:mr-0 md:scale-[1.5] md:active:scale-[1.5] md:hover:scale-[1.6] lg:mr-auto lg:translate-x-0"
        >
          <Link href="/newsletter">
            <span className="inline-flex h-full w-fit items-center gap-1 rounded-[10px] bg-white/90 px-4 py-2 text-black transition-all duration-300 group-hover:rounded-2xl group-hover:bg-white/0 group-hover:text-white dark:bg-black/80 dark:text-white group-hover:dark:bg-black/0 dark:group-hover:text-black">
              <Mail className="mr-1 h-4 w-4 stroke-[3]" />
              Subscribe to our newsletter
            </span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
