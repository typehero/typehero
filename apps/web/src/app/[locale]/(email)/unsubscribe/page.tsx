'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/button';
import { DialogFooter } from '@repo/ui/components/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { useToast } from '@repo/ui/components/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { removeFromWaitlist } from './_actions';

const formSchema = z.object({
  email: z.string().email(),
});

export type FormSchema = z.infer<typeof formSchema>;
export default function UnsubscribePage(props: { searchParams: { email?: string } }) {
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: props.searchParams.email ?? '',
    },
  });

  async function onSubmit(data: FormSchema) {
    try {
      await removeFromWaitlist(data.email);
      toast({
        title: 'Successfully Unsubscribed',
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
      });
    }
  }

  return (
    <div className="container">
      <h1 className="text-3xl font-bold">Unsubscribe</h1>
      <div className="max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
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

            <DialogFooter className="py-3">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </div>
  );
}
