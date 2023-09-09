import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createTrack } from './tracks.actions';
import { useToast } from '@repo/ui/components/use-toast';
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DialogFooter } from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';

const formSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  visible: z.boolean(),
});

export type FormSchema = z.infer<typeof formSchema>;

interface Props {
  toggle: (value: boolean) => void;
}
export function AddTrackForm({ toggle }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      visible: false,
    },
  });

  async function onSubmit(data: FormSchema) {
    try {
      await createTrack(data);
      queryClient.invalidateQueries(['tracks']);
      toggle(false);
      toast({
        title: 'Track Added',
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
          render={() => (
            <FormItem>
              <div className="mt-3 flex items-center gap-2">
                <Checkbox
                  id="visible"
                  {...form.register('visible')}
                  onCheckedChange={(e) => form.setValue('visible', e as boolean)}
                />
                <label htmlFor="visible">Visible</label>
              </div>
            </FormItem>
          )}
        />
        <DialogFooter className="py-3">
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
