'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { ChallengeCardEditor } from './ChallengeCardEditor';
import { Steps } from './Steps';
import { TestCasesEditor } from './TestCasesEditor';
import DEFAULT_DESCRIPTION from './default-description.md';
import DEFAULT_CHALLENGE_TEMPLATE from './default-challenge.md';
import { DescriptionEditor } from './DescriptionEditor';

const steps = [
  { id: '1', name: 'Challenge Card' },
  { id: '2', name: 'Description' },
  { id: '3', name: 'Test Cases' },
];

const createChallengeSchema = z.object({
  title: z
    .string()
    .min(3, 'The name must be longer than 3 characters')
    .max(30, 'The name must be shorter than 30 characters'),
  prompt: z.string().max(65536),
  difficulty: z.enum(['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME']),
  description: z.string().min(20, 'The description must be longer than 20 characters').max(65536),
  shortDescription: z
    .string()
    .min(10, 'The short description must be longer than 10 characters')
    .max(191, 'The short description must be shorter than 191 characters'),
});
export type CreateChallengeSchema = z.infer<typeof createChallengeSchema>;

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [rendered, setRendered] = useState(false);
  const form = useForm<CreateChallengeSchema>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      difficulty: 'BEGINNER',
      description: DEFAULT_DESCRIPTION,
      prompt: DEFAULT_CHALLENGE_TEMPLATE,
    },
  });

  useEffect(() => {
    setRendered(true);
  }, []);

  const nextStep = () => setStep((step) => step + 1);

  function onSubmit(data: CreateChallengeSchema) {
    console.log({ data });
  }

  return (
    <div className="container">
      <Steps steps={steps} current={step} onChange={(step, idx) => setStep(idx)} />
      {rendered && (
        <Form {...form}>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 0 && <ChallengeCardEditor form={form} />}
            {step === 1 && <DescriptionEditor form={form} />}
            {step === 2 && <TestCasesEditor />}
            <div className="flex justify-end">
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
