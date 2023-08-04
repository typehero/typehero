import { clsx } from 'clsx';
import { Balancer } from 'react-wrap-balancer';

import WaitlistForm from '~/components/landing/waitlist/waitlist-form';
import styles from '~/components/landing/waitlist/waitlist.module.css';

export default function WaitlistPage() {
  return (
    <main>
      <div className="absolute left-0 top-0 -z-10 h-full w-full">
        <div className={clsx(styles.waitlistBackground)} />
      </div>
      <div className="container h-full pt-16">
        <div className="mx-auto flex max-w-[700px] flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-3xl font-bold text-neutral-950 dark:text-neutral-50 md:text-5xl">
            <Balancer>
              Join the waitlist and be part of the{' '}
              <span className="bg-gradient-to-r from-[#3178c6] to-black bg-clip-text font-black text-transparent dark:to-white">
                TypeHero
              </span>{' '}
              community
            </Balancer>
          </h1>
          <p className="leading-loose text-zinc-600 dark:text-zinc-300">
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
