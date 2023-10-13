'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { toast } from '@repo/ui/components/use-toast';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';
import { validateToken } from './_actions';
import { claimFormSchema } from './_schema';

export type FormSchema = z.infer<typeof claimFormSchema>;
export function ClaimForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      code: '',
    },
  });

  async function onSubmit(data: FormSchema) {
    try {
      await validateToken(data);
      toast({
        title: 'Token accepted!',
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Invalid token',
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex gap-5">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="w-64">
              <FormControl>
                <Input
                  maxLength={10}
                  className="rounded-xl bg-neutral-200 dark:bg-neutral-800"
                  placeholder="Enter Early Access token"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
