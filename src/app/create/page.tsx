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

import { type Difficulty } from '@prisma/client';
import ExploreCardInputs from '../../components/create/explore-card-inputs';

import { useTheme } from 'next-themes';

import MDEditor from '@uiw/react-md-editor';

export default function CreateChallenge() {
  const createChallengeStore = useCreateChallengeStore();
  const [isPreviewing, setIsPreviewing] = useState({
    description: false,
  });
  const [description, setDescription] = useState(createChallengeStore.data?.description ?? '');
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
    if (name.length < 3) {
      return void toast({
        variant: 'destructive',
        title: 'The title length should be longer than 3 character',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    if (shortDescription.length < 10) {
      return void toast({
        variant: 'destructive',
        title: 'The short description should be longer than 10 character',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    if (description.length < 20) {
      return void toast({
        variant: 'destructive',
        title: 'The description should be longer than 20 character',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    if (difficulty === undefined) {
      return void toast({
        variant: 'destructive',
        title: 'Please select a difficulty',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    createChallengeStore.setData({
      name,
      description,
      shortDescription,
      difficulty,
      prompt,
    });

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
          defaultValue="short-description"
          className="flex h-full w-full flex-col border-zinc-300 dark:border-zinc-700"
        >
          <TabsList className="sticky top-0 z-10 grid h-auto w-full grid-cols-2 rounded-none border-b border-zinc-300 bg-background/90 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
            <TabsTrigger
              value="short-description"
              className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            >
              Short Description
            </TabsTrigger>
            <TabsTrigger
              value="long-description"
              className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            >
              Long Description
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="short-description"
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
            value="long-description"
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
              <MDEditor
                height="100%"
                className="flex-1"
                value={description}
                // non-split-screen by default
                preview="edit"
                // removes resize handle on bottom right
                visibleDragbar={false}
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                onChange={(ev) => setDescription(ev)}
                // TODO: customize toolbar GH #131
                // components={{
                //   toolbar: (command, disabled, executeCommand) => {
                //     if (command.keyCommand === 'code') {
                //       return (
                //         <button
                //           aria-label="Insert code"
                //           disabled={disabled}
                //           onClick={(evn) => {
                //             evn.stopPropagation();
                //             executeCommand(command, command.groupName);
                //           }}
                //         >
                //           Code
                //         </button>
                //       );
                //     }
                //   },
                // }}
              />
            )}
          </TabsContent>
        </Tabs>
      }
      right={
        <CodePanel
          mode="create"
          onSubmit={onSubmit}
          submitText="Preview"
          prompt={createChallengeStore.data?.prompt}
        />
      }
    />
  );
}
