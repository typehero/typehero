'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { toast } from '@repo/ui/components/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { validateToken } from './_actions';

const formSchema = z.object({
  code: z.string().min(10),
});

export type FormSchema = z.infer<typeof formSchema>;

export function ClaimForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
    },
  });

  async function onSubmit(data: FormSchema) {
    try {
      await validateToken(data.code);
      toast({
        title: 'Token accepted!',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex gap-5">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="w-64">
              <FormControl>
                <Input
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
