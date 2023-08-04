'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertCircle, MailCheck } from 'lucide-react';
import { Alert, AlertDescription } from '~/components/ui/alert';

import { uploadWaitlistEntry } from '~/components/landing/waitlist/create.action';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import clsx from 'clsx';

const waitlistFormSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email(),
  intention: z.string(),
});

export type WaitlistFormSchema = z.infer<typeof waitlistFormSchema>;

export default function WaitlistForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const isSubmitting = state === 'submitting';

  const form = useForm<WaitlistFormSchema>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  async function onSubmit(data: WaitlistFormSchema) {
    try {
      setState('submitting');
      await uploadWaitlistEntry(data);
      setState('success');
    } catch (e) {
      setState('error');
    }
  }

  return (
    <div className="w-full py-4 md:w-[350px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className={clsx({
                      'border border-red-600 dark:border-red-400': form.formState.errors.name,
                      'border-zinc-300 bg-neutral-50 dark:border-zinc-700 dark:bg-neutral-950':
                        !form.formState.errors.name,
                    })}
                    {...field}
                    id="name"
                    autoComplete="name"
                    placeholder="Your name"
                  />
                </FormControl>
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
                    className={clsx({
                      'border border-red-600 dark:border-red-400': form.formState.errors.email,
                      'border-zinc-300 bg-neutral-50 dark:border-zinc-700 dark:bg-neutral-950':
                        !form.formState.errors.email,
                    })}
                    {...field}
                    id="email"
                    autoComplete="email"
                    placeholder="Your email address"
                  />
                </FormControl>
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
                    <SelectTrigger
                      className={clsx({
                        'border border-red-600 dark:border-red-400':
                          form.formState.errors.intention,
                        'border-zinc-300 bg-neutral-50 dark:border-zinc-700 dark:bg-neutral-950':
                          !form.formState.errors.intention,
                      })}
                    >
                      <SelectValue placeholder="Why are you interested in TypeHero?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user">I want to solve type challenges</SelectItem>
                    <SelectItem value="builder">I want to build type challenges</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="font-boldtransition-shadow group relative w-full overflow-hidden rounded-xl bg-gradient-to-bl from-blue-400 to-emerald-400 px-[2px] py-[2px] duration-200"
          >
            <span className="h-full w-full rounded-[10px] bg-white px-4 py-2 text-center font-bold text-black transition-colors duration-200 group-hover:bg-neutral-100 dark:bg-black dark:text-white group-hover:dark:bg-neutral-900">
              {isSubmitting ? 'Submitting...' : 'Join the waitlist'}
            </span>
          </Button>
        </form>
      </Form>
      <div className="mt-3">
        {state === 'success' && <AlertSuccess />}
        {state === 'error' && <AlertDestructive />}
      </div>
    </div>
  );
}

export function AlertDestructive() {
  // destructive:
  //   'destructive group border-destructive bg-destructive text-destructive-foreground',
  return (
    <Alert variant="destructive" className="dark:bg-[#230808]">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-left text-black dark:text-white">
        Something went wrong. Please try again.
      </AlertDescription>
    </Alert>
  );
}

export function AlertSuccess() {
  return (
    <Alert variant="success">
      <MailCheck className="h-4 w-4" />
      <AlertDescription className="text-left text-black dark:text-white">
        Thanks for signing up for the waitlist! Consider{' '}
        <a target="_blank" className="underline" href="https://twitter.com/typeheroapp">
          following us on twitter
        </a>{' '}
        for general updates.
      </AlertDescription>
    </Alert>
  );
}
