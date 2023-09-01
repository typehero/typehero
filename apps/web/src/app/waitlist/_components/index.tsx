import { Balancer } from 'react-wrap-balancer';
import styles from './waitlist.module.css';
import { WaitlistForm } from './waitlist-form';

export function Waitlist() {
  return (
    <main className="relative min-h-[calc(100vh-56px)] sm:px-16 md:px-0">
      <div className={`${styles.waitlistBackground} fixed left-0 top-0 -z-10 h-full w-full`} />
      {/* NOTE: pls dont chang percentages, it's cursed */}
      <div
        className={`${styles.mybg} fixed -bottom-[64px] left-1/2 -z-10 h-[69%] w-[150%] -translate-x-1/2 opacity-20 sm:opacity-30`}
      />
      <div className="container grid h-full place-items-center">
        <div className="mx-auto flex max-w-[700px] flex-col items-center justify-center gap-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-950 dark:text-neutral-50 md:text-5xl">
            <Balancer>
              Join the waitlist to be part of the{' '}
              <span className="bg-gradient-to-r from-[#3178c6] to-black bg-clip-text font-black text-transparent dark:from-blue-400 dark:to-emerald-400">
                TypeHero
              </span>{' '}
              community
            </Balancer>
          </h1>
          <p className="leading-8 text-black/50 dark:text-white/50">
            <Balancer>
              By signing up to the waitlist you will be among the first to know when we launch and
              getting early access
            </Balancer>
          </p>
          <WaitlistForm />
        </div>
      </div>
    </main>
  );
}
