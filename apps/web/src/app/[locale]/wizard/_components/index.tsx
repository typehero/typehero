'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from '@repo/auth/react';
import { Form } from '@repo/ui/components/form';
import type { TsErrors } from '@repo/monaco';
import { ChallengeCardEditor } from './ChallengeCardEditor';
import { DescriptionEditor } from './DescriptionEditor';
import { Steps } from './Steps';
import { NextBack } from './NextBack';
import { Summary } from './Summary';
import { TestCasesEditor } from './TestCasesEditor';
import { uploadChallenge } from './create.action';
import DEFAULT_CHALLENGE_TEMPLATE from './default-challenge.md';
import DEFAULT_TEST_CASES from './default-tests.md';
import DEFAULT_DESCRIPTION from './default-description.md';
import {
  createNoProfanitySchema,
  createNoProfanitySchemaWithValidate,
} from '~/utils/antiProfanityZod';

export const enum STEPS {
  ChallengeCard,
  Description,
  TestCases,
  Summary,
}

const testCaseRegex = new RegExp('(?:\n|^)s*(?:Equal|Extends|NotEqual|Expect)<');
const createExploreCardSchema = z.object({
  difficulty: z.enum(['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME']),
  name: createNoProfanitySchemaWithValidate((zodString) =>
    zodString
      .min(3, 'The name must be longer than 3 characters')
      .max(30, 'The name must be shorter than 30 characters'),
  ),
  shortDescription: createNoProfanitySchemaWithValidate((zodString) =>
    zodString
      .min(10, 'The short description must be longer than 10 characters')
      .max(191, 'The short description must be shorter than 191 characters'),
  ),
});

const createDescriptionSchema = z.object({
  description: createNoProfanitySchemaWithValidate((zodString) =>
    zodString.min(20, 'The description must be longer than 20 characters').max(65536),
  ),
});

const createTestCasesSchema = z.object({
  tests: createNoProfanitySchemaWithValidate((zodString) =>
    zodString
      .min(20, 'The test cases must be longer than 20 characters')
      .max(65536)
      .regex(testCaseRegex, 'You need to have test cases in your challenge'),
  ),
  code: createNoProfanitySchema(),
});
export const createChallengeSchema = createExploreCardSchema
  .merge(createDescriptionSchema)
  .merge(createTestCasesSchema);

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

export type CreateChallengeSchema = z.infer<typeof createChallengeSchema>;

export type WizardForm = UseFormReturn<CreateChallengeSchema>;

export function Wizard() {
  const router = useRouter();
  const { data: session } = useSession();
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
    const { id } = await uploadChallenge(data, isUserACreator);

    router.refresh();

    if (isUserACreator) {
      router.push(`/challenge/${id}`);
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
      />
    </div>
  );
}
