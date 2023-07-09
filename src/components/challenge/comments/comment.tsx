import { zodResolver } from '@hookform/resolvers/zod';
import { Delete } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { getRelativeTime } from '~/utils/relativeTime';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Form, FormField, FormItem } from '../../ui/form';
import { Textarea } from '../../ui/textarea';
import { TypographyLarge } from '../../ui/typography/large';
import { toast } from '../../ui/use-toast';
import { reportChallengeComment } from './comment.action';

interface CommentProps {
  comment: ChallengeRouteData['comment'][number];
}

const commentReportSchema = z
  .object({
    spam: z.boolean().optional(),
    threat: z.boolean().optional(),
    hate_speech: z.boolean().optional(),
    bullying: z.boolean().optional(),
    text: z.string().optional(),
  })
  .refine(
    (obj) => {
      const { spam, threat, hate_speech, bullying, text } = obj;
      return spam || threat || hate_speech || bullying || (text !== undefined && text !== '');
    },
    {
      path: ['text'],
      message: 'Your report should include an issue or a reason.',
    },
  );

export type CommentReportSchemaType = z.infer<typeof commentReportSchema>;

const Comment = ({ comment }: CommentProps) => {
  // State
  const [dialogOpen, setDialogOpen] = useState(false);

  // Hooks
  const form = useForm<CommentReportSchemaType>({
    resolver: zodResolver(commentReportSchema),
    mode: 'onChange',
    defaultValues: {
      bullying: false,
      hate_speech: false,
      spam: false,
      text: '',
      threat: false,
    },
  });

  // Functions
  async function handleCommentReport(data: CommentReportSchemaType) {
    try {
      const res = await reportChallengeComment(data, comment.id);
      if (res === 'unauthorized') {
        toast({
          title: 'Unauthorized',
          variant: 'destructive',
          description: <p>You&apos;re not authorized to perform the action.</p>,
        });
      } else if (res === 'already_exists') {
        toast({
          title: 'Already Reported',
          description: <p>The comment you&apos;re trying to report has already been reported.</p>,
        });
      } else {
        toast({
          title: 'Reported',
          variant: 'success',
          description: <p>The comment has successfully been reported.</p>,
        });
        setDialogOpen(false);
        form.reset();
      }
    } catch (e) {
      toast({
        title: 'Uh Oh!',
        variant: 'destructive',
        description: <p>There was an error while trying to report the comment.</p>,
      });
    }
  }

  const text = form.watch('text');

  return (
    <div className="flex cursor-pointer flex-col gap-2 p-4 pt-2 duration-300 hover:bg-neutral-100 dark:rounded-none dark:hover:bg-zinc-700/50">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <span className="my-auto max-w-fit rounded-full bg-neutral-200 p-1 px-2 text-xs font-bold text-neutral-500 dark:bg-zinc-700 dark:text-neutral-400">
            @&nbsp;{comment.user.name}
          </span>
          <span className="text-sm text-neutral-500">{getRelativeTime(comment.createdAt)}</span>
        </div>
        <button
          onClick={() => {
            setDialogOpen(true);
          }}
          className="flex text-sm text-neutral-400 hover:text-neutral-400 hover:underline dark:text-neutral-600"
        >
          Report
        </button>
      </div>
      <p>{comment.text}</p>
      <Dialog
        open={dialogOpen}
        onOpenChange={() => {
          setDialogOpen(!dialogOpen);
        }}
      >
        <DialogContent className="max-w-lg space-y-4">
          <DialogHeader>
            <DialogTitle>Report Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="flex flex-col space-y-2 rounded-md border-2 px-2 py-3">
              <div className="flex items-center gap-2">
                <span className="my-auto max-w-fit rounded-full bg-neutral-200 p-1 px-2 text-xs font-bold text-neutral-500 dark:bg-zinc-700 dark:text-neutral-400">
                  @&nbsp;{comment.user.name}
                </span>
                <span className="text-sm text-neutral-500">
                  {getRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p>{comment.text}</p>
            </div>
            <Form {...form}>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form onSubmit={form.handleSubmit(handleCommentReport)}>
                <div className="flex flex-col space-y-2">
                  <TypographyLarge>Issues</TypographyLarge>
                  <FormField
                    control={form.control}
                    name="bullying"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <Checkbox
                              id="bullying"
                              checked={field.value as boolean}
                              onCheckedChange={(e) => {
                                if (typeof e === 'boolean') {
                                  field.onChange(e);
                                }
                              }}
                            />
                            <label htmlFor="bullying">The comment suggests bullying.</label>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="hate_speech"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <Checkbox
                              id="hate_speech"
                              checked={field.value as boolean}
                              onCheckedChange={(e) => {
                                if (typeof e === 'boolean') {
                                  field.onChange(e);
                                }
                              }}
                            />
                            <label htmlFor="hate_speech">The comment suggests hate speech.</label>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="spam"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <Checkbox
                              id="spam"
                              checked={field.value as boolean}
                              onCheckedChange={(e) => {
                                if (typeof e === 'boolean') {
                                  field.onChange(e);
                                }
                              }}
                            />
                            <label htmlFor="spam">The comment suggests spam.</label>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="threat"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <div className="flex items-center gap-4">
                            <Checkbox
                              id="threat"
                              checked={field.value as boolean}
                              onCheckedChange={(e) => {
                                if (typeof e === 'boolean') {
                                  field.onChange(e);
                                }
                              }}
                            />
                            <label htmlFor="threat">The comment suggests threat/s.</label>
                          </div>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <div className="flex flex-row items-center gap-2">
                            <label htmlFor="text">
                              <TypographyLarge>Other</TypographyLarge>
                            </label>
                            {text !== undefined && text.length > 0 && (
                              <Delete
                                className="h-5 w-5 hover:cursor-pointer"
                                onClick={() => {
                                  form.setValue('text', '');
                                }}
                              />
                            )}
                          </div>
                          <Textarea value={field.value} onChange={field.onChange} />
                        </FormItem>
                      );
                    }}
                  />
                  {form.formState.errors.text?.message && (
                    <p className={'text-sm font-medium text-destructive'}>
                      {form.formState.errors.text.message}
                    </p>
                  )}
                </div>
                <div className="flex pt-4">
                  <Button type="submit" className="w-full">
                    Report
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Comment;
