'use client';

import { ChallengeLayout } from '~/components/challenge/challenge-layout';
import { useCreateChallengeStore } from '../create-challenge-store';
import { useRouter } from 'next/navigation';
import { CodePanel } from '~/components/challenge/editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Markdown } from '~/components/ui/markdown';
import ExploreCard from '~/components/explore/explore-card';
import { Button } from '~/components/ui/button';
import { uploadChallenge } from '../create.action';
import { useState } from 'react';

export default function PreviewCreatedChallenge() {
  const createChallengeStore = useCreateChallengeStore();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (createChallengeStore.data === undefined) {
    if (!isRedirecting) {
      router.replace('/create');
    }

    // TODO: show some ui when isRedirecting
    return;
  }

  async function publishChallenge() {
    console.log(createChallengeStore.data);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { id } = await uploadChallenge(createChallengeStore.data!);

    // TODO: add guard in case the upload fails
    createChallengeStore.clear();

    router.push(`/challenge/${id}`);

    setIsRedirecting(true);
  }

  return (
    <ChallengeLayout
      left={
        <Tabs
          defaultValue="card"
          className="flex h-full w-full flex-col border-zinc-300 dark:border-zinc-700"
        >
          <TabsList className="sticky top-0 z-10 grid h-auto w-full grid-cols-2 rounded-none border-b border-zinc-300 bg-background/90 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
            <TabsTrigger
              value="card"
              className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            >
              Card
            </TabsTrigger>
            <TabsTrigger
              value="description"
              className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            >
              Description
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="description"
            className="mt-0 flex flex-1 flex-col gap-3 p-4 dark:bg-muted [&[hidden]]:hidden"
          >
            <div className="prose-invert flex-1 leading-8 prose-h3:text-xl">
              <Markdown>{createChallengeStore.data.description}</Markdown>
            </div>
          </TabsContent>
          <TabsContent
            value="card"
            className="mt-0 flex flex-1 flex-col gap-3 p-4 dark:bg-background [&[hidden]]:hidden"
          >
            <ExploreCard
              challenge={{
                ...createChallengeStore.data,
                _count: {
                  vote: 420,
                  comment: 0,
                },
                updatedAt: new Date(),
                difficulty: createChallengeStore.data.difficulty,
              }}
            />
          </TabsContent>
        </Tabs>
      }
      right={
        <CodePanel
          mode="check-created"
          prompt={createChallengeStore.data.prompt}
          onSubmit={publishChallenge}
          submitText="Publish"
          extraButton={
            <Button
              size="sm"
              className="cursor-pointer whitespace-nowrap bg-red-600 duration-300 hover:bg-red-500 dark:bg-red-400 dark:hover:bg-red-300"
              onClick={() => router.push('/create/')}
            >
              Continue Editing
            </Button>
          }
        />
      }
    />
  );
}
