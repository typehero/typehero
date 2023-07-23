'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '~/components/ui/form';
import { USER_CODE_START, USER_CODE_START_REGEX } from '../challenge/code-panel/constants';
import { ChallengeCardEditor } from './ChallengeCardEditor';
import { DescriptionEditor } from './DescriptionEditor';
import { Steps } from './Steps';
import { Summary } from './Summary';
import { TestCasesEditor } from './TestCasesEditor';
import { uploadChallenge } from './create.action';
import DEFAULT_CHALLENGE_TEMPLATE from './default-challenge.md';
import DEFAULT_DESCRIPTION from './default-description.md';

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
const createChallengeSchema = createExploreCardSchema
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
  const [step, setStep] = useState(0);
  const [rendered, setRendered] = useState(false);
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
      setStep((step) => step + 1);
    } else {
      await form.trigger();
      console.error(success);
    }
  };

  async function onSubmit(data: CreateChallengeSchema) {
    console.log({ data });
    const { id } = await uploadChallenge(data);

    router.push(`/challenge/${id}`);
  }

  return (
    <div className="container h-full pb-6">
      <div className="flex h-full flex-col">
        {rendered && (
          <Form {...form}>
            <form className="flex-1" onSubmit={form.handleSubmit(onSubmit)}>
              <Steps
                steps={steps}
                current={step}
                onChange={(idx) => setStep(idx)}
                onNext={handleNextClick}
              />
              {step === 0 && <ChallengeCardEditor form={form} />}
              {step === 1 && <DescriptionEditor form={form} />}
              {step === 2 && <TestCasesEditor form={form} />}
              {step === 3 && <Summary />}
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
