import { zodResolver } from '@hookform/resolvers/zod';
import MDEditor from '@uiw/react-md-editor';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useToast } from '~/components/ui/use-toast';
import { postSolution } from './post-solution.action';
import type { Challenge } from '..';
import { useSession } from 'next-auth/react';

const getDefaultMarkdown = (solution: string) => `
## Thoughts
<!-- Any thoughts you might like to share about the problem(within TOS of course). -->

## Approach
<!-- Provide some details on how you approached this challenge. -->


## Code
\`\`\`ts
${solution}
\`\`\`
`;

const formSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

interface Props {
  challenge: NonNullable<Challenge>;
  setOpen: (v: boolean) => void;
}

export function SolutionEditor({ setOpen, challenge }: Props) {
  const session = useSession();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: getDefaultMarkdown(challenge.Solution[0]?.code ?? ''),
    },
  });
  const { toast } = useToast();

  const onSubmit = async (data: FormSchema) => {
    try {
      await postSolution({
        challengeId: challenge.id,
        description: data.content,
        title: data.title,
        userId: session?.data?.user?.id as string,
      });
      toast({
        variant: 'success',
        title: 'Your solution has been posted!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong. Please try again.',
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form className="flex h-full flex-col gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Enter a title for your solution." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              // @ts-ignore
              <MDEditor height="100%" value={field.value} onChange={field.onChange} />
            )}
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Post</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
