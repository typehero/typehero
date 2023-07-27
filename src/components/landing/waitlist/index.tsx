import Link from 'next/link';
import { clsx } from 'clsx';
import { Mail } from 'lucide-react';
import { Balancer } from 'react-wrap-balancer';

import { Button } from '~/components/ui/button';
import styles from '~/components/landing/waitlist/waitlist.module.css';

const Waitlist = () => {
  return (
    <section className={clsx(styles.backdrop, 'relative overflow-hidden')}>
      <div className="container relative grid grid-cols-1 items-center justify-center md:grid-cols-2">
        <div className="flex flex-col gap-8 pt-48 pb-16 md:py-16">
          <h1 className="text-4xl font-bold">
            <Balancer>Early birds get the perks</Balancer>
          </h1>
          <p className="leading-loose text-zinc-600 dark:text-zinc-400">
            <Balancer>
              We’re currently working hard to make TypeHero the perfect place for TypeScript
              enthusiasts and learners. If you believe TypeHero can help you become a better
              TypeScript developer in the future, consider joining our waitlist.
            </Balancer>
          </p>

          <Button
            className="font-boldtransition-shadow group relative w-fit overflow-hidden rounded-xl bg-gradient-to-bl from-blue-400 to-emerald-400 px-[2px] py-[2px] duration-200 hover:shadow-2xl"
            asChild
          >
            <Link href="/waitlist">
              <span className="inline-flex h-full w-fit items-center gap-1 rounded-[10px] bg-white px-4 py-2 font-bold text-black transition-colors duration-200 group-hover:bg-neutral-100 dark:bg-black dark:text-white group-hover:dark:bg-neutral-900">
                <Mail className="h-4 w-4" />
                Join the Waitlist
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Waitlist;
