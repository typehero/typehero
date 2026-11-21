'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import type { z } from 'zod';
import { useSession } from '@repo/auth/react';
import { Form } from '@repo/ui/components/form';
import type { TsErrors } from '@repo/monaco';
import { ChallengeCardEditor } from './ChallengeCardEditor';
import { DescriptionEditor } from './DescriptionEditor';
import { Steps } from './Steps';
import { NextBack } from './NextBack';
import { Summary } from './Summary';
import { TestCasesEditor } from './TestCasesEditor';
import { useMutation } from '@tanstack/react-query';
import { TRPCClientError } from '@trpc/client';
import { toast } from '@repo/ui/components/use-toast';
import { useTRPC } from '~/trpc/react';
import DEFAULT_CHALLENGE_TEMPLATE from './default-challenge.md';
import DEFAULT_TEST_CASES from './default-tests.md';
import DEFAULT_DESCRIPTION from './default-description.md';
import {
  createChallengeSchema,
  createDescriptionSchema,
  createExploreCardSchema,
  createTestCasesSchema,
  type CreateChallengeSchema,
} from './schema';

export const enum STEPS {
  ChallengeCard,
  Description,
  TestCases,
  Summary,
}

const steps: Step[] = [
  { id: '1', name: 'Challenge Card', schema: createExploreCardSchema },
  { id: '2', name: 'Description', schema: createDescriptionSchema },
  { id: '3', name: 'Test Cases', schema: createTestCasesSchema },
  { id: '4', name: 'Summary' },
];

export interface Step {
  id: string;
  name: string;
  schema?: z.ZodSchema;
}

export type { CreateChallengeSchema };

export type WizardForm = UseFormReturn<CreateChallengeSchema>;

export function Wizard() {
  const router = useRouter();
  const { data: session } = useSession();
  const trpc = useTRPC();
  const createChallenge = useMutation(trpc.challenge.create.mutationOptions());
  const [step, setStep] = useState(0);
  const [rendered, setRendered] = useState(false);
  const [tsErrors, setTsErrors] = useState<TsErrors>([[], [], []]);

  const isUserACreator = useMemo(
    () => session?.user?.role.includes('CREATOR') ?? false,
    [session?.user?.role],
  );

  const hasTsErrors = useMemo(() => tsErrors.some((e) => e.length), [tsErrors]);
  const form = useForm<CreateChallengeSchema>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      name: '',
      difficulty: 'BEGINNER',
      description: DEFAULT_DESCRIPTION,
      tests: DEFAULT_TEST_CASES,
      code: DEFAULT_CHALLENGE_TEMPLATE,
    },
  });

  useEffect(() => {
    setRendered(true);

    const handleBeforeUnload: EventListenerOrEventListenerObject = (event) => {
      event.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      event.returnValue = false;
    };

    window.addEventListener('beforeunload', handleBeforeUnload, { capture: true });

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleNextClick = async () => {
    const schema = steps[step]!.schema;
    const success = schema ? schema.safeParse(form.getValues()).success : true;

    if (success) {
      // if they are currently on test cases do not let them go to next step
      // until a type error exists
      if (step === STEPS.TestCases) {
        if (!hasTsErrors) return;
      }
      setStep((step) => step + 1);
    } else {
      await form.trigger();
    }
  };

  async function onSubmit(data: CreateChallengeSchema) {
    let challenge;
    try {
      challenge = await createChallenge.mutateAsync(data);
    } catch (error) {
      const code = error instanceof TRPCClientError ? error.data?.code : undefined;
      toast({
        title: 'Could not submit your challenge',
        variant: 'destructive',
        description:
          code === 'CONFLICT'
            ? 'A challenge with this name already exists. Try a different name.'
            : code === 'UNAUTHORIZED'
              ? 'You need to be logged in to submit a challenge.'
              : 'Something went wrong. Please try again.',
      });
      return;
    }

    router.refresh();

    if (challenge.status === 'ACTIVE') {
      router.push(`/challenge/${challenge.slug}`);
    } else {
      router.push(`/explore`);
    }
  }

  return (
    <div className="flex h-full flex-col gap-4 pb-4 pt-4 lg:gap-6 lg:pb-8">
      {/* we cant nest this in the form because it causes the editor to resize inifinitely hence the onSubmit(wtf..) */}
      <Steps current={step} onChange={(idx) => setStep(idx)} steps={steps} />
      {rendered ? (
        <Form {...form}>
          <form
            className={`container ${
              (step === STEPS.Description || step === STEPS.TestCases) && 'h-full'
            }`}
          >
            {step === STEPS.ChallengeCard && <ChallengeCardEditor form={form} />}
            {step === STEPS.Description && <DescriptionEditor form={form} />}
            {step === STEPS.TestCases && (
              <TestCasesEditor form={form} hasTsErrors={hasTsErrors} setTsErrors={setTsErrors} />
            )}
            {step === 3 && <Summary isUserACreator={isUserACreator} />}
          </form>
        </Form>
      ) : null}
      <NextBack
        current={step}
        onChange={(idx) => setStep(idx)}
        onNext={handleNextClick}
        onSubmit={form.handleSubmit(onSubmit)}
        isSubmitting={form.formState.isSubmitting}
      />
    </div>
  );
}
