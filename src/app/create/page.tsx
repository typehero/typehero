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
            className="mt-0 flex flex-1 flex-col gap-3 p-4 dark:bg-muted [&[hidden]]:hidden"
          >
            <h1>Name:</h1>
            {isPreviewing.name ? (
              <h2 className="px-3 py-2">{name}</h2>
            ) : (
              <Input
                className="resize-none dark:border-white"
                value={name}
                onChange={(ev) => setName(ev.currentTarget.value)}
              />
            )}
            <div className="flex items-center justify-end space-x-2">
              <Label
                htmlFor="preview"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Preview:
              </Label>
              <Checkbox
                id="preview"
                checked={isPreviewing.name}
                onCheckedChange={(checked) =>
                  setIsPreviewing((rest) => ({ ...rest, name: checked === true }))
                }
              />
            </div>
            <h1>Name:</h1>
            <Select onValueChange={(value: Difficulty) => setDifficulty(value)} value={difficulty}>
              <SelectTrigger className="dark:border-white">
                <SelectValue placeholder="Select a Difficulty" />
              </SelectTrigger>
              <SelectContent className="dark:border-white">
                <SelectItem value="BEGINNER">BEGINNER</SelectItem>
                <SelectItem value="EASY">EASY</SelectItem>
                <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                <SelectItem value="HARD">HARD</SelectItem>
                <SelectItem value="EXTREME">EXTREME</SelectItem>
              </SelectContent>
            </Select>
            <h1>Short Description:</h1>
            {isPreviewing.shortDescription ? (
              <div className="prose-invert flex-1 text-sm">
                <Markdown>{shortDescription}</Markdown>
              </div>
            ) : (
              <Textarea
                className="flex-1 resize-none dark:border-white"
                value={shortDescription}
                onChange={(ev) => setShortDescription(ev.currentTarget.value)}
              />
            )}
            <div className="flex items-center justify-end space-x-2">
              <Label
                htmlFor="preview"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Preview:
              </Label>
              <Checkbox
                id="preview"
                checked={isPreviewing.shortDescription}
                onCheckedChange={(checked) =>
                  setIsPreviewing((rest) => ({ ...rest, shortDescription: checked === true }))
                }
              />
            </div>
          </TabsContent>
          <TabsContent
            value="long-description"
            className="mt-0 flex flex-1 flex-col gap-3 p-4 dark:bg-muted [&[hidden]]:hidden"
          >
            {isPreviewing.description ? (
              <div className="prose-invert flex-1 leading-8 prose-h3:text-xl">
                <Markdown>{description}</Markdown>
              </div>
            ) : (
              <Textarea
                className="flex-1 resize-none dark:border-white"
                value={description}
                onChange={(ev) => setDescription(ev.currentTarget.value)}
              />
            )}
            <div className="flex items-center justify-end space-x-2">
              <Label
                htmlFor="preview"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Preview:
              </Label>
              <Checkbox
                id="preview"
                checked={isPreviewing.description}
                onCheckedChange={(checked) =>
                  setIsPreviewing((rest) => ({ ...rest, description: checked === true }))
                }
              />
            </div>
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
