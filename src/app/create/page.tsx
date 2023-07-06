'use client';

import { ChallengeLayout } from '~/components/challenge/challenge-layout';
import { Textarea } from '~/components/ui/textarea';
import { CodePanel } from '~/components/challenge/editor';
import { useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Markdown } from '~/components/ui/markdown';
import { useCreateChallengeStore } from './create-challenge-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Input } from '~/components/ui/input';
import { useToast } from '~/components/ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { type Difficulty } from '@prisma/client';

export default function CreateChallenge() {
  const createChallengeStore = useCreateChallengeStore();
  const [isPreviewing, setIsPreviewing] = useState({
    description: false,
    shortDescription: false,
    name: false,
  });
  const [description, setDescription] = useState(createChallengeStore.data?.description ?? '');
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    createChallengeStore.data?.difficulty,
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
              className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            >
              Short Description
            </TabsTrigger>
            <TabsTrigger
              value="long-description"
              className="rounded-md rounded-tl-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            >
              Long Description
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="short-description"
            className="mt-0 flex flex-1 flex-col p-4 dark:bg-muted [&[hidden]]:hidden"
          >
            <div className="mb-1 mt-3 flex items-center justify-between pr-1">
              <h1>Name:</h1>

              <Label
                htmlFor="previewTitle"
                className="flex cursor-pointer items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Preview:
                <Checkbox
                  id="previewTitle"
                  className="border-zinc-500"
                  checked={isPreviewing.name}
                  onCheckedChange={(checked) =>
                    setIsPreviewing((rest) => ({ ...rest, name: checked === true }))
                  }
                />
              </Label>
            </div>
            {isPreviewing.name ? (
              <h2 className="px-3 py-2">{name}</h2>
            ) : (
              <Input
                className="resize-none border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
                value={name}
                onChange={(ev) => setName(ev.currentTarget.value)}
              />
            )}

            <h1 className="mb-1 mt-3">Name:</h1>
            <Select onValueChange={(value: Difficulty) => setDifficulty(value)} value={difficulty}>
              <SelectTrigger className="border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                <SelectValue placeholder="Select a Difficulty" />
              </SelectTrigger>
              <SelectContent className="border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900">
                <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                <SelectItem value="EASY">EASY</SelectItem>
                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                <SelectItem value="HARD">HARD</SelectItem>
                <SelectItem value="EXTREME">EXTREME</SelectItem>
              </SelectContent>
            </Select>
            <div className="mb-1 mt-3 flex items-center justify-between pr-1">
              <h1>Short Description:</h1>
              <Label
                htmlFor="preview"
                className="flex cursor-pointer items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Preview:
                <Checkbox
                  id="preview"
                  className="border-zinc-500"
                  checked={isPreviewing.shortDescription}
                  onCheckedChange={(checked) =>
                    setIsPreviewing((rest) => ({ ...rest, shortDescription: checked === true }))
                  }
                />
              </Label>
            </div>
            {isPreviewing.shortDescription ? (
              <div className="prose-invert flex-1 px-3 py-2 text-sm">
                <Markdown>{shortDescription}</Markdown>
              </div>
            ) : (
              <Textarea
                className="flex-1 resize-none border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900"
                value={shortDescription}
                onChange={(ev) => setShortDescription(ev.currentTarget.value)}
              />
            )}
          </TabsContent>
          <TabsContent
            value="long-description"
            className="relative mt-0 flex flex-1 flex-col dark:bg-muted [&[hidden]]:hidden"
          >
            <div className="absolute right-4 top-4 flex items-center justify-end">
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
              <Textarea
                className="flex-1 resize-none border-none bg-zinc-100 dark:bg-zinc-900"
                value={description}
                onChange={(ev) => setDescription(ev.currentTarget.value)}
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
