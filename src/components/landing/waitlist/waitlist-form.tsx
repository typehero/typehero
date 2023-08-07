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
    <div className="w-full md:w-[350px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className={clsx({
                      'rounded-b-none rounded-t-xl border border-b-0 border-red-600 bg-white/50 backdrop-blur-md dark:border-red-400 dark:bg-neutral-950/50':
                        form.formState.errors.name,
                      'rounded-b-none rounded-t-xl border-b-0 border-black/30 bg-white/20 backdrop-blur-md dark:border-white/30 dark:bg-neutral-950/20':
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
                      'rounded-none border border-red-600 bg-white/50 backdrop-blur-md dark:border-red-400 dark:bg-neutral-950/50':
                        form.formState.errors.email,
                      'rounded-none border-black/30 bg-white/20 backdrop-blur-md dark:border-white/30 dark:bg-neutral-950/20':
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
                        'rounded-b-xl rounded-t-none border border-t-0 border-red-600 bg-white/50 backdrop-blur-md dark:border-red-400 dark:bg-neutral-950/50':
                          form.formState.errors.intention,
                        'rounded-b-xl rounded-t-none border-t-0 border-black/30 bg-white/20 backdrop-blur-md dark:border-white/30 dark:bg-neutral-950/20':
                          !form.formState.errors.intention,
                      })}
                    >
                      <SelectValue placeholder="Why are you interested in TypeHero?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl bg-white/50 backdrop-blur-md dark:bg-black/50">
                    <SelectItem className="cursor-pointer rounded-lg brightness-200" value="user">
                      I want to solve type challenges
                    </SelectItem>
                    <SelectItem
                      className="cursor-pointer rounded-lg brightness-200"
                      value="builder"
                    >
                      I want to build type challenges
                    </SelectItem>
                    <SelectItem className="cursor-pointer rounded-lg brightness-200" value="both">
                      Both
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="wl-form-button group relative mt-6 w-full overflow-hidden rounded-xl px-[2px] py-[2px] font-bold transition-shadow duration-300 hover:shadow-[0_0.5rem_2rem_-0.75rem_#3178c6] dark:hover:shadow-[0_0.5rem_2rem_-0.75rem_#5198f6]"
          >
            <span className="h-full w-full rounded-[10px] bg-white px-4 py-2 text-center font-bold text-black transition-colors duration-300 group-hover:bg-blue-100 dark:bg-black dark:text-white group-hover:dark:bg-cyan-950">
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
