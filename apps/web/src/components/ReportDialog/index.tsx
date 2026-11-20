import { type IssueType } from '@repo/db/types';
import { useMutation } from '@tanstack/react-query';
import { TRPCClientError } from '@trpc/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import { toast } from '@repo/ui/components/use-toast';
import { Text } from '@repo/ui/components/typography/typography';
import { FormField, FormItem } from '@repo/ui/components/form';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Textarea } from '@repo/ui/components/textarea';
import { Button } from '@repo/ui/components/button';
import { useTRPC } from '~/trpc/react';
import type { RouterInputs } from '~/trpc/types';
import { MAX_REPORT_TEXT_LENGTH } from './report-limits';

export interface ReportDialogPropsBase {
  triggerAsChild?: boolean;
}

export interface ReportUserDialogProps extends ReportDialogPropsBase {
  reportType: 'USER';
  userId: string;
}

export interface ReportChallengeDialogProps extends ReportDialogPropsBase {
  reportType: 'CHALLENGE';
  challengeId: number;
}

export interface ReportCommentDialogProps extends ReportDialogPropsBase {
  reportType: 'COMMENT';
  commentId: number;
}

export interface ReportSolutionDialogProps extends ReportDialogPropsBase {
  reportType: 'SOLUTION';
  solutionId: number;
}

export function ReportDialog({
  children,
  triggerAsChild = false,
  reportType = 'COMMENT',
  ...props
}: React.PropsWithChildren<
  | ReportChallengeDialogProps
  | ReportCommentDialogProps
  | ReportSolutionDialogProps
  | ReportUserDialogProps
>) {
  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      derogatory: false,
      unclear: false,
      bullying: false,
      spam: false,
      hateSpeech: false,
      threat: false,
      comments: '',
    },
  });

  const [show, setShow] = React.useState(false);
  const trpc = useTRPC();
  const createReport = useMutation(trpc.report.create.mutationOptions());
  // Blocks a second submit that fires before React re-renders with the button disabled.
  const isSubmittingRef = React.useRef(false);

  let desc = '';
  switch (reportType) {
    case 'CHALLENGE':
      desc = 'Report Challenge';
      break;
    case 'COMMENT':
      desc = 'Report Comment';
      break;
    case 'USER':
      desc = 'Report User';
      break;
    case 'SOLUTION':
      desc = 'Report Solution';
      break;
  }

  return (
    <Dialog
      onOpenChange={(e) => {
        setShow(e);
      }}
      open={show}
    >
      <DialogTrigger asChild={triggerAsChild} className="focus:outline-none focus-visible:ring-2">
        {children}
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={handleSubmit(async (e) => {
            if (isSubmittingRef.current) return;
            isSubmittingRef.current = true;

            // This shit is like... extra jank.
            const issues = Object.entries(e).reduce<{ type: IssueType }[]>((all, [key, value]) => {
              if (key === 'comments') return all;
              if (value)
                all.push({
                  type: key.toUpperCase() as IssueType,
                });
              return all;
            }, []);

            try {
              const value = await createReport.mutateAsync({
                ...props,
                type: reportType,
                text: e.comments,
                issues,
              } as RouterInputs['report']['create']);

              switch (value) {
                case 'already_exists':
                  toast({
                    title: 'Already reported',
                    description: <p>You have already made a report with this information.</p>,
                  });
                  break;
                case 'created':
                  toast({
                    title: 'Created',
                    variant: 'success',
                    description: <p>A report has been made.</p>,
                  });
                  break;
              }
            } catch (error) {
              if (error instanceof TRPCClientError && error.data?.code === 'UNAUTHORIZED') {
                toast({
                  title: 'Not Logged In',
                  variant: 'destructive',
                  description: <p>You must be logged in to make a report.</p>,
                });
              } else {
                toast({
                  title: 'Something went wrong',
                  variant: 'destructive',
                  description: <p>Your report could not be sent. Please try again.</p>,
                });
                // keep the dialog open so the report isn't lost
                return;
              }
            } finally {
              isSubmittingRef.current = false;
            }
            setShow(false);
          })}
        >
          <DialogHeader>
            <DialogTitle>{desc}</DialogTitle>
            <DialogDescription>Please be as thorough in your report as you can.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2">
            <Text intent="leading">Please select all that apply:</Text>
            <FormField
              control={control}
              name="derogatory"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="derogatory"
                      {...register('derogatory')}
                      onCheckedChange={(e) => setValue('derogatory', e as boolean)}
                    />
                    <label htmlFor="derogatory">Derogatory</label>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="derogatory"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="bullying"
                      {...register('bullying')}
                      onCheckedChange={(e) => setValue('bullying', e as boolean)}
                    />
                    <label htmlFor="bullying">Bullying</label>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="hateSpeech"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="hateSpeech"
                      {...register('hateSpeech')}
                      onCheckedChange={(e) => setValue('hateSpeech', e as boolean)}
                    />
                    <label htmlFor="hateSpeech">Hate speech</label>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="spam"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="spam"
                      {...register('spam')}
                      onCheckedChange={(e) => setValue('spam', e as boolean)}
                    />
                    <label htmlFor="spam">Spam</label>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="threat"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="threat"
                      {...register('threat')}
                      onCheckedChange={(e) => setValue('threat', e as boolean)}
                    />
                    <label htmlFor="threat">Threat of violence</label>
                  </div>
                </FormItem>
              )}
            />
            {reportType === 'CHALLENGE' && (
              <FormField
                control={control}
                name="unclear"
                render={() => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="unclear"
                        {...register('unclear')}
                        onCheckedChange={(e) => setValue('unclear', e as boolean)}
                      />
                      <label htmlFor="unclear">Unclear</label>
                    </div>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={control}
              name="comments"
              render={() => (
                <FormItem className="my-3">
                  <div className="flex flex-col gap-3">
                    <div>Other information</div>
                    <Textarea
                      {...register('comments', {
                        maxLength: {
                          value: MAX_REPORT_TEXT_LENGTH,
                          message: `Please keep your report under ${MAX_REPORT_TEXT_LENGTH.toLocaleString()} characters.`,
                        },
                      })}
                      placeholder="Any extra information to help our moderator team when reviewing this report."
                    />
                    {errors.comments ? (
                      <p role="alert" className="text-destructive dark:text-error-label text-sm">
                        {errors.comments.message}
                      </p>
                    ) : null}
                  </div>
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setShow(false);
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createReport.isPending}>
              Send report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
