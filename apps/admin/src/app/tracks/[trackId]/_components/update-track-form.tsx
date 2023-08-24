'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  DialogFooter,
  ForceRenderUntilClient,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@repo/ui';
import Link from 'next/link';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import Select from 'react-select';
import { z } from 'zod';
import { updateTrack } from '../_actions/update-track.action';
import type { ChallengesForTrack, TrackToManage } from '../page';
import { DraggableChallenge } from './draggable-challenge';

const trackChallengeSchema = z.object({
  challengeId: z.number(),
  orderId: z.number(),
  challenge: z.any(),
});

const formSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  visible: z.boolean(),
  trackChallenges: z.array(trackChallengeSchema),
});

export type FormSchema = z.infer<typeof formSchema>;
export interface Props {
  track: TrackToManage;
  challenges: ChallengesForTrack;
}

function transformChallengesForDropdown(challenges: ChallengesForTrack) {
  return challenges.map((challenge) => ({
    label: challenge.name,
    value: challenge.id,
  }));
}

export function UpdateTrackForm({ challenges, track }: Props) {
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: track.title,
      description: track.description,
      visible: track.visible,
      trackChallenges: track.trackChallenges,
    },
  });

  const defaultSelectValues = useMemo(
    () =>
      track.trackChallenges.map((tc) => ({
        label: challenges.find((c) => c.id === tc.challengeId)?.name,
        value: tc.challengeId,
      })),
    [challenges, track.trackChallenges],
  );

  const { fields, move } = useFieldArray({
    control: form.control,
    name: 'trackChallenges',
  });

  const options = transformChallengesForDropdown(challenges);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    move(dragIndex, hoverIndex);
  };

  async function onSubmit(data: FormSchema) {
    try {
      // reset order id to index
      data.trackChallenges = data.trackChallenges.map((tc, index) => ({
        ...tc,
        orderId: index,
      }));

      await updateTrack({ ...data, trackId: track.id });

      toast({
        title: 'Track Updated',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }
  }

  return (
    <ForceRenderUntilClient>
      <div className="container flex flex-col gap-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track Title:</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-xl bg-neutral-200 dark:bg-neutral-800"
                      placeholder="Enter a Track Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track Description</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-xl bg-neutral-200 dark:bg-neutral-800"
                      placeholder="Enter a Track Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border py-4">
                  <FormLabel>Visible</FormLabel>
                  <FormControl>
                    <Checkbox
                      id="visible"
                      checked={field.value}
                      onCheckedChange={field.onChange as (checked: boolean) => void}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Select
              isMulti
              styles={{
                option: () => {
                  return {
                    color: 'black',
                  };
                },
              }}
              options={options}
              defaultValue={defaultSelectValues}
              onChange={(selected) => {
                const trackChallenges = selected.map((challenge, index) => ({
                  challengeId: challenge.value,
                  orderId: index, // we'll update in this submit
                }));
                form.setValue('trackChallenges', trackChallenges);
              }}
            />

            <div className="my-3">
              {fields.map((field, index) => (
                <DraggableChallenge
                  key={field.id}
                  index={index}
                  id={Number(field.id)}
                  text={challenges.find((c) => c.id === field.challengeId)?.name ?? ''}
                  moveChallenge={moveCard}
                />
              ))}
            </div>

            <DialogFooter className="py-3">
              <Link href="/?tab=tracks">
                <Button variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </ForceRenderUntilClient>
  );
}
