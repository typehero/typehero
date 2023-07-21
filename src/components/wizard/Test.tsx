'use client';

import { useState } from 'react';
import { Steps } from './Steps';
import { Button } from '~/components/ui/button';
import { ChallengeCardEditor } from './ChallengeCardEditor';
import { DescriptionEditor } from './DescriptionEditor';
import { TestCasesEditor } from './TestCasesEditor';
import { z } from 'zod';
import { Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

export function Wizard() {
  const [step, setStep] = useState(0);
  const form = useForm<CreateChallengeSchema>({
    resolver: zodResolver(createChallengeSchema),
  });

  const nextStep = () => setStep((step) => step + 1);

  function onSubmit(data: CreateChallengeSchema) {
    console.log({ data });
  }

  return (
    <div className="container">
      <Steps steps={steps} current={step} onChange={(step, idx) => setStep(idx)} />
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {step === 1 && <DescriptionEditor />}
            {step === 2 && <TestCasesEditor />}
            <Button onClick={nextStep}>Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
