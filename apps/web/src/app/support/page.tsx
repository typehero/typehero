import type { Metadata } from 'next';
import CheckoutForm from './_components/checkout-form';

export const metadata: Metadata = {
  title: 'Donate with hosted Checkout | Next.js + TypeScript Example',
};

export default function DonatePage(): JSX.Element {
  return <CheckoutForm />;
}
