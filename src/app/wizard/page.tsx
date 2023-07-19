'use client';

import { useState } from 'react';
import { Steps } from './Steps';
import { Button } from '~/components/ui/button';

const steps = [
  { id: '1', name: 'Welcome' },
  { id: '2', name: 'Subscription' },
  // NOTE: Right now, we don't have creators set their payout wallet as part of
  // onboarding, because it creates friction between their onboarding. This
  // is instead performed after the fact in their creator dashboard.
  // { id: '3', name: 'Payouts' },
  { id: '3', name: 'Tax Information' },
];
export function Wizard() {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((step) => step + 1);

  return (
    <>
      <Steps steps={steps} current={step} onChange={(step, idx) => setStep(idx)} />;
      <Button onClick={nextStep}>Next</Button>
    </>
  );
}
