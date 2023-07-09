import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useToast } from '~/components/ui/use-toast';
import { postSolution } from './post-solution.action';
import { type ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import MDEditor, { commands, type ICommand, EditorContext } from '@uiw/react-md-editor';

const PreviewToggle = () => {
  console.warn(commands);
  const { preview, dispatch } = useContext(EditorContext);
  const click = () => {
    dispatch?.({
      preview: preview === 'edit' ? 'preview' : 'edit',
    });
  };
  if (preview === 'edit') {
    return (
      // TODO: styles don't work for some reason
      <button
        className="mr-2 w-10 px-2 font-bold"
        style={{
          width: '4rem !important',
          padding: '0.25rem 1rem !important',
          fontWeight: 'bold !important',
        }}
        type="button"
        onClick={click}
      >
        Preview
      </button>
    );
  }
  return (
    // TODO: styles don't work for some reason
    <button
      className="mr-2 w-10 px-2 font-bold"
      style={{
        width: '4rem !important',
        padding: '0.25rem 1rem !important',
        fontWeight: 'bold !important',
      }}
      type="button"
      onClick={click}
    >
      Edit
    </button>
  );
};

const codePreview: ICommand = {
  name: 'preview',
  keyCommand: 'preview',
  value: 'preview',
  icon: <PreviewToggle />,
};

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
  challenge: ChallengeRouteData;
  setOpen: (v: boolean) => void;
}

export function SolutionEditor({ setOpen, challenge }: Props) {
  const session = useSession();
  const router = useRouter();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: getDefaultMarkdown(challenge.solution[0]?.code ?? ''),
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

      // refresh the router so we see latest data
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong. Please try again.',
      });
    } finally {
      setOpen(false);
    }
  };

  const { theme } = useTheme();
  theme == 'dark'
    ? document.documentElement.setAttribute('data-color-mode', 'dark')
    : document.documentElement.setAttribute('data-color-mode', 'light');

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form className="flex h-full flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="sticky right-0 top-[41px] z-10 flex items-center justify-between gap-2 border-b border-zinc-300 bg-background/90 bg-opacity-20 p-1 pr-2 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="rounded-xl border-zinc-300 bg-zinc-100 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-900"
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
            className="h-8 rounded-lg bg-white px-3 py-2 text-black hover:bg-zinc-200 focus-visible:bg-zinc-200 focus-visible:ring-offset-0 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:focus-visible:bg-zinc-700"
            type="button"
            onClick={() => setOpen(false)}
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
              // @ts-ignore
              <MDEditor
                height="100%"
                value={field.value}
                // non-split-screen by default
                preview="edit"
                // TODO: might be a better way to select certain buttons insetad of re-rendering to <></>
                // commands={[commands.codeEdit, commands.codePreview]}
                // removes resize handle on bottom right
                visibleDragbar={false}
                extraCommands={[codePreview, commands.fullscreen]}
                // @ts-ignore
                onChange={field.onChange}
                components={{
                  toolbar: (command) => {
                    // toolbar: (command, disabled, executeCommand) => {
                    // re-render these to nothing
                    if (
                      command.keyCommand === 'hr' ||
                      command.keyCommand === 'link' ||
                      command.keyCommand === 'quote' ||
                      command.keyCommand === 'image' ||
                      command.keyCommand === 'comment' ||
                      command.keyCommand === 'list' ||
                      // TODO: these aren't under command.keyCommand?
                      command.keyCommand === 'unordered-list' ||
                      command.keyCommand === 'ordered-list' ||
                      command.keyCommand === 'checked-list'
                    ) {
                      return <></>;
                    }
                    // custom code button option
                    if (command.keyCommand === 'code') {
                      // return (
                      //   <button
                      //     aria-label="Insert code"
                      //     disabled={disabled}
                      //     onClick={(evn) => {
                      //       evn.stopPropagation();
                      //       executeCommand(command, command.groupName);
                      //     }}
                      //   >
                      //     a
                      //   </button>
                      // );
                    }
                  },
                }}
              />
            )}
          />
        </div>
      </form>
    </Form>
  );
}
