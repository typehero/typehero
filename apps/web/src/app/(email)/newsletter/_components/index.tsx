import { Balancer } from 'react-wrap-balancer';
import { NewsletterForm } from './newsletter-form';
import styles from './newsletter.module.css';

export function Newsletter({ params: { locale } }: { params: { locale: string } }) {
  return (
    <main className="relative min-h-[calc(100vh-56px)] sm:px-16 md:px-0">
      <div className={`${styles.newsletterBackground} -z-10 fixed top-0 left-0 h-full w-full`} />
      {/* NOTE: pls dont chang percentages, it's cursed */}
      <div
        className={`${styles.mybg} -bottom-[64px] -z-10 -translate-x-1/2 fixed left-1/2 h-[69%] w-[150%] opacity-20 sm:opacity-30`}
      />
      <div className="container grid h-full place-items-center">
        <div className="mx-auto flex max-w-[700px] flex-col items-center justify-center gap-8 text-center">
          <h1 className="font-bold text-3xl text-neutral-950 md:text-5xl dark:text-neutral-50">
            <Balancer>
              Subscribe to be part of the{' '}
              <span className="bg-gradient-to-r from-[#3178c6] to-black bg-clip-text font-black text-transparent dark:from-blue-400 dark:to-emerald-400">
                TypeHero
              </span>{' '}
              community
            </Balancer>
          </h1>
          <p className="text-black/50 leading-8 dark:text-white/50">
            <Balancer>
              Interested in the future of the platform? Be the first to get updates on content, new
              features, and more!
            </Balancer>
          </p>
          <NewsletterForm />
        </div>
      </div>
    </main>
  );
}
