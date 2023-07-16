'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Delete, Trash2, Reply } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { ChallengeRouteData } from '~/app/challenge/[id]/getChallengeRouteData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { getRelativeTime } from '~/utils/relativeTime';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Form, FormField, FormItem } from '~/components/ui/form';
import { Textarea } from '~/components/ui/textarea';
import { TypographyLarge } from '~/components/ui/typography/large';
import { toast } from '~/components/ui/use-toast';
import { reportChallengeComment } from './comment.action';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { UserBadge } from '~/components/ui/user-badge';
import { useSession } from 'next-auth/react';
// import { Markdown } from '~/components/ui/markdown';

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
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const loggedinUser = useSession();

  const isAuthor = loggedinUser.data?.user?.id === comment.user.id;

  return (
    <div className="flex flex-col gap-1 p-3 pt-2">
      <div className="flex justify-between pr-[0.4rem]">
        <div className="flex items-center gap-1">
          <UserBadge username={comment.user.name ?? ''} />
          <Tooltip delayDuration={0.05}>
            <TooltipTrigger asChild>
              <span className="text-sm text-neutral-500">{getRelativeTime(comment.createdAt)}</span>
            </TooltipTrigger>
            <TooltipContent align="start" className="rounded-xl">
              <span className="text-white-500 text-xs">{comment.createdAt.toLocaleString()}</span>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex gap-2">
          {/* TODO: make dis work */}
          <button className="flex cursor-pointer items-center gap-1 text-sm text-neutral-400 duration-200 hover:text-neutral-500 hover:underline dark:text-neutral-600 dark:hover:text-neutral-500">
            <Reply className="h-3 w-3" />
            Reply
          </button>
          {/* TODO: make dis work */}
          {isAuthor ? (
            <button className="flex cursor-pointer items-center gap-1 text-sm text-neutral-400 duration-200 hover:text-neutral-500 hover:underline dark:text-neutral-600 dark:hover:text-neutral-500">
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          ) : (
            <button
              onClick={() => {
                setDialogOpen(true);
              }}
              className="flex cursor-pointer items-center text-sm text-neutral-400 duration-200 hover:text-neutral-500 hover:underline dark:text-neutral-600 dark:hover:text-neutral-500"
            >
              Report
            </button>
          )}
        </div>
      </div>
      <p className="w-full break-words pl-[1px] text-sm">
        {/* TODO: <code></code> is <Markdown /> does not wrap long lines causing overflow */}
        {/* <Markdown>{comment.text}</Markdown> */}
        {comment.text}
      </p>
      <Dialog
        open={dialogOpen}
        onOpenChange={() => {
          setDialogOpen(!dialogOpen);
        }}
      >
        {/* TODO: make a separate component */}
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Report Comment</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div className="flex flex-col space-y-2 rounded-3xl border p-3 dark:bg-zinc-900">
              {/* TODO: use comment template component inside this new separate component */}
              <div className="flex items-center gap-1">
                <UserBadge username={comment.user.name} />
                <Tooltip>
                  <span className="text-sm text-neutral-500">
                    {getRelativeTime(comment.createdAt)}
                  </span>
                  <TooltipContent className="rounded-xl">
                    <span className="text-white-500 text-sm">
                      {comment.createdAt.toLocaleString()}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="max-h-[30vh] overflow-y-auto">{comment.text}</p>
            </div>
            <Form {...form}>
              {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
              <form onSubmit={form.handleSubmit(handleCommentReport)}>
                <div className="py-2">
                  <TypographyLarge>Issues</TypographyLarge>
                </div>
                <div className="flex flex-col space-y-2 px-2">
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
                            <label className="-ml-2" htmlFor="text">
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
