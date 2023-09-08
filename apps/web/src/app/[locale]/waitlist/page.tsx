import type { Metadata } from 'next';
import { getStaticParams } from '~/locales/server';

export const metadata: Metadata = {
  title: 'Waitlist | TypeHero',
  description: 'Join the waitlist for TypeHero and be the first to know when we launch!',
};

export function generateStaticParams() {
  return getStaticParams();
}

export { Waitlist as default } from './_components';
