'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { uploadWaitlistEntry } from '~/components/landing/waitlist/create.action';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

const waitlistFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  intention: z.string(),
});

export type WaitlistFormSchema = z.infer<typeof waitlistFormSchema>;

export default function WaitlistForm() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const form = useForm<WaitlistFormSchema>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  async function onSubmit(data: WaitlistFormSchema) {
    setSubmitting(true);
    const uploadResult = await uploadWaitlistEntry(data);

    if (uploadResult) {
      setSubmitting(false);
    } else {
      setError(true);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-[380px] flex-col gap-4 py-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="rounded-lg border-zinc-300 bg-neutral-50 dark:border-zinc-700 dark:bg-neutral-950"
                  {...field}
                  id="name"
                  autoComplete="name"
                  placeholder="Your name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="rounded-lg border-zinc-300 bg-neutral-50 dark:border-zinc-700 dark:bg-neutral-950"
                  {...field}
                  id="email"
                  autoComplete="email"
                  placeholder="Your email address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intention"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                <FormControl>
                  <SelectTrigger className="rounded-lg border-zinc-300 bg-neutral-50 text-muted-foreground dark:border-zinc-700 dark:bg-neutral-950">
                    <SelectValue placeholder="Why are you interested in TypeHero?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">I want to solve type challenges</SelectItem>
                  <SelectItem value="builder">I want to build type challenges</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={submitting}
          className="font-boldtransition-shadow group relative w-full overflow-hidden rounded-xl bg-gradient-to-bl from-blue-400 to-emerald-400 px-[2px] py-[2px] duration-200"
        >
          <span className="h-full w-full rounded-[10px] bg-white px-4 py-2 text-center font-bold text-black transition-colors duration-200 group-hover:bg-neutral-100 dark:bg-black dark:text-white group-hover:dark:bg-neutral-900">
            {submitting ? 'Submitting...' : 'Join the waitlist'}
          </span>
        </Button>
      </form>
    </Form>
  );
}
