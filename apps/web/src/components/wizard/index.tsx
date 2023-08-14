'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from '@repo/auth/react';
import { Form } from '@repo/ui';
import { USER_CODE_START, USER_CODE_START_REGEX } from '../challenge/code-panel/constants';
import type { TsErrors } from '../challenge/code-panel';
import { ChallengeCardEditor } from './ChallengeCardEditor';
import { DescriptionEditor } from './DescriptionEditor';
import { Steps } from './Steps';
import { NextBack } from './NextBack';
import { Summary } from './Summary';
import { TestCasesEditor } from './TestCasesEditor';
import { uploadChallenge } from './create.action';
import DEFAULT_CHALLENGE_TEMPLATE from './default-challenge.md';
import DEFAULT_DESCRIPTION from './default-description.md';

export const enum STEPS {
  ChallengeCard,
  Description,
  TestCases,
  Summary,
}
const testCaseRegex = new RegExp('(?:\n|^)s*(?:Equal|Extends|NotEqual|Expect)<');
const createExploreCardSchema = z.object({
  difficulty: z.enum(['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXTREME']),
  name: z
    .string()
    .min(3, 'The name must be longer than 3 characters')
    .max(30, 'The name must be shorter than 30 characters'),
  shortDescription: z
    .string()
    .min(10, 'The short description must be longer than 10 characters')
    .max(191, 'The short description must be shorter than 191 characters'),
});
const createDescriptionSchema = z.object({
  description: z.string().min(20, 'The description must be longer than 20 characters').max(65536),
});
const createTestCasesSchema = z.object({
  prompt: z
    .string()
    .min(20, 'The test cases must be longer than 20 characters')
    .max(65536)
    .regex(testCaseRegex, 'You need to have test cases in your challenge')
    .regex(
      USER_CODE_START_REGEX,
      `You need to have the line \`${USER_CODE_START}\` to signify the non-editable part`,
    ),
});
export const createChallengeSchema = createExploreCardSchema
  .merge(createDescriptionSchema)
  .merge(createTestCasesSchema);
const steps = [
  { id: '1', name: 'Challenge Card', schema: createExploreCardSchema },
  { id: '2', name: 'Description', schema: createDescriptionSchema },
  { id: '3', name: 'Test Cases', schema: createTestCasesSchema },
  { id: '4', name: 'Summary', schema: z.any() },
];
export type Step = (typeof steps)[0];

export type CreateChallengeSchema = z.infer<typeof createChallengeSchema>;

export type WizardForm = UseFormReturn<CreateChallengeSchema>;

export function Wizard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [rendered, setRendered] = useState(false);
  const [tsErrors, setTsErrors] = useState<TsErrors>([[], [], [], []]);

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
      prompt: DEFAULT_CHALLENGE_TEMPLATE,
    },
  });

  useEffect(() => {
    setRendered(true);
  }, []);

  const handleNextClick = async () => {
    const { success } = steps[step]!.schema.safeParse(form.getValues());
    if (success) {
      // if they are currently on test cases do not let them go to next step
      // until a type error exists
      if (step === STEPS.TestCases) {
        if (!hasTsErrors) return;
      }
      setStep((step) => step + 1);
    } else {
      await form.trigger();
      console.error(success);
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
