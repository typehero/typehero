'use client';

import { ChallengeLayout } from '~/components/challenge/challenge-layout';
import { CodePanel } from '~/components/challenge/editor';
import { useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Markdown } from '~/components/ui/markdown';
import { useCreateChallengeStore } from './create-challenge-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useToast } from '~/components/ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { useRouter } from 'next/navigation';
import DEFAULT_DESCRIPTION from './default-description.md';
import DEFAULT_CHALLENGE_TEMPLATE from './default-challenge.md';

import { type Difficulty } from '@prisma/client';
import ExploreCardInputs from '~/components/create/explore-card-inputs';

import { useTheme } from 'next-themes';
import { RichMarkdownEditor } from '~/components/ui/rich-markdown-editor';
import { createChallengeValidator } from './create-validator';

export default function CreateChallenge() {
  const createChallengeStore = useCreateChallengeStore();
  const [isPreviewing, setIsPreviewing] = useState({
    description: false,
  });
  const [description, setDescription] = useState(
    createChallengeStore.data?.description ?? DEFAULT_DESCRIPTION,
  );
  const [difficulty, setDifficulty] = useState<Difficulty | 'BEGINNER'>(
    createChallengeStore.data?.difficulty || 'BEGINNER',
  );
  const [shortDescription, setShortDescription] = useState(
    createChallengeStore.data?.shortDescription ?? '',
  );
  const [name, setName] = useState(createChallengeStore.data?.name ?? '');

  const router = useRouter();

  const { toast } = useToast();

  function onSubmit(prompt: string) {
    const parseResult = createChallengeValidator.safeParse({
      name,
      description,
      shortDescription,
      difficulty,
      prompt,
    });

    if (!parseResult.success) {
      for (const error of parseResult.error.errors) {
        toast({
          title: error.message,
          variant: 'destructive',
          action: <ToastAction altText="dismiss">Dismiss</ToastAction>,
        });
      }

      return;
    }

    createChallengeStore.setData(parseResult.data);

    router.push('/create/preview');
  }

  const { theme } = useTheme();
  theme == 'dark'
    ? document.documentElement.setAttribute('data-color-mode', 'dark')
    : document.documentElement.setAttribute('data-color-mode', 'light');

  return (
    <ChallengeLayout
      left={
        <Tabs
          defaultValue="card-editor"
          className="flex h-full w-full flex-col border-zinc-300 dark:border-zinc-700"
        >
          <TabsList className="sticky top-0 z-10 grid h-auto w-full grid-cols-2 rounded-none border-b border-zinc-300 bg-background/90 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
            <TabsTrigger
              value="card-editor"
              className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            >
              Card Editor
            </TabsTrigger>
            <TabsTrigger
              value="challenge-description"
              className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            >
              Challenge Description
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="card-editor"
            className="mt-0 flex flex-1 flex-col p-4 dark:bg-muted [&[hidden]]:hidden"
          >
            <ExploreCardInputs
              name={name}
              setName={setName}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              shortDescription={shortDescription}
              setShortDescription={setShortDescription}
            />
          </TabsContent>
          <TabsContent
            value="challenge-description"
            className="relative mt-0 flex flex-1 flex-col dark:bg-muted [&[hidden]]:hidden"
          >
            <div className="absolute bottom-4 right-4 z-10 flex items-center justify-end">
              <Label
                htmlFor="previewLong"
                className="flex cursor-pointer gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Preview:
                <Checkbox
                  id="previewLong"
                  className="border-zinc-500"
                  checked={isPreviewing.description}
                  onCheckedChange={(checked) =>
                    setIsPreviewing((rest) => ({ ...rest, description: checked === true }))
                  }
                />
              </Label>
            </div>
            {isPreviewing.description ? (
              <div className="prose-invert flex-1 px-3 py-1 leading-8 prose-h3:text-xl">
                <Markdown>{description}</Markdown>
              </div>
            ) : (
              <RichMarkdownEditor onChange={(val) => setDescription(val)} value={description} />
            )}
          </TabsContent>
        </Tabs>
      }
      right={
        <CodePanel
          mode="create"
          onSubmit={onSubmit}
          submitText="Preview"
          prompt={createChallengeStore.data?.prompt ?? DEFAULT_CHALLENGE_TEMPLATE}
        />
      }
    />
  );
}
