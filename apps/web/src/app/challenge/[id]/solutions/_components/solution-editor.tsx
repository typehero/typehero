import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from '@repo/auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  useToast,
} from '@repo/ui';
import { postSolution } from './post-solution.action';
import { RichMarkdownEditor } from '~/components/ui/rich-markdown-editor';
import type { ChallengeSolutionsRouteData } from '~/app/challenge/[id]/solutions/page';

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
  challenge: ChallengeSolutionsRouteData;
  dismiss: () => void;
}

export function SolutionEditor({ dismiss, challenge }: Props) {
  const session = useSession();
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: getDefaultMarkdown(challenge.submission[0]?.code ?? ''),
    },
  });
  const { toast } = useToast();

  const onSubmit = async (data: FormSchema) => {
    try {
      await postSolution({
        challengeId: challenge.id,
        description: data.content ?? '',
        title: data.title ?? '',
        userId: session.data?.user.id!,
      });

      toast({
        variant: 'success',
        title: 'Your solution has been posted!',
      });

      // refresh the router so we see latest data
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong. Please try again.',
      });
    } finally {
      dismiss();
    }
  };

  const { theme } = useTheme();
  theme === 'dark'
    ? document.documentElement.setAttribute('data-color-mode', 'dark')
    : document.documentElement.setAttribute('data-color-mode', 'light');

  return (
    <Form {...form}>
      <form className="relative flex h-full flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-background/90 dark:bg-muted/90 sticky right-0 top-0 z-10 flex w-full items-center justify-between gap-2 border-b border-zinc-300 bg-opacity-20 p-1 pr-2 backdrop-blur-sm dark:border-zinc-700">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="rounded-xl border-zinc-300 bg-zinc-100 focus-visible:ring-0 dark:border-zinc-700 dark:bg-zinc-900"
                      {...field}
                      placeholder="Enter a title for your solution."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="h-8 rounded-lg bg-white px-3 py-2 text-black hover:bg-zinc-200 focus-visible:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:focus-visible:bg-zinc-700"
            onClick={dismiss}
            type="button"
          >
            Cancel
          </Button>
          <Button className="h-8 rounded-lg px-3 py-2" type="submit">
            Post
          </Button>
        </div>
        <div className="flex-1">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <RichMarkdownEditor
                allowImageUpload
                value={field.value}
                // non-split-screen by default
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </form>
    </Form>
  );
}
