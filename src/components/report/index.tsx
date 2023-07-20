import { type IssueType } from '@prisma/client';
import React from 'react';
import {
  type ChallengeReport,
  type UserReport,
  type CommentReport,
  addReport,
  type SolutionReport,
} from '~/components/report/report.action';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { useForm } from 'react-hook-form';
import { FormField, FormItem } from '~/components/ui/form';
import { Checkbox } from '~/components/ui/checkbox';
import { Textarea } from '~/components/ui/textarea';
import Text from '~/components/ui/typography/typography';
import { toast } from '~/components/ui/use-toast';

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

export default function ReportDialog({
  children,
  triggerAsChild = false,
  reportType = 'COMMENT',
  ...props
}: React.PropsWithChildren<
  | ReportUserDialogProps
  | ReportChallengeDialogProps
  | ReportCommentDialogProps
  | ReportSolutionDialogProps
>) {
  const { handleSubmit, register, control, setValue } = useForm({
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
      open={show}
      onOpenChange={(e) => {
        setShow(e);
      }}
    >
      <DialogTrigger asChild={triggerAsChild}>{children}</DialogTrigger>
      <DialogContent>
        <form
          onSubmit={handleSubmit(async (e) => {
            let args = {} as UserReport | ChallengeReport | CommentReport | SolutionReport;
            switch (reportType) {
              case 'CHALLENGE':
                args = {
                  ...props,
                  text: e.comments,
                  type: reportType,
                } as ChallengeReport;
                break;
              case 'COMMENT':
                args = {
                  ...props,
                  text: e.comments,
                  type: reportType,
                } as CommentReport;
                break;
              case 'USER':
                args = {
                  ...props,
                  text: e.comments,
                  type: reportType,
                } as UserReport;
                break;
              case 'SOLUTION':
                args = {
                  ...props,
                  text: e.comments,
                  type: reportType,
                } as SolutionReport;
            }

            // This shit is like... extra jank.
            const issues = Object.entries(e).reduce((all, [key, value]) => {
              if (key === 'comments') return all;
              if (value)
                all.push({
                  type: key.toUpperCase() as IssueType,
                });
              return all;
            }, [] as { type: IssueType }[]);

            const value = await addReport({
              ...args,
              issues,
            });

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
              case 'not_logged_in':
                toast({
                  title: 'Not Logged In',
                  variant: 'destructive',
                  description: <p>You must be logged in to make a report.</p>,
                });
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
              name="derogatory"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      {...register('derogatory')}
                      onCheckedChange={(e) => setValue('derogatory', e as boolean)}
                    />
                    <div>Derogatory</div>
                  </div>
                </FormItem>
              )}
              control={control}
            />
            <FormField
              name="derogatory"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      {...register('bullying')}
                      onCheckedChange={(e) => setValue('bullying', e as boolean)}
                    />
                    <div>Bullying</div>
                  </div>
                </FormItem>
              )}
              control={control}
            />
            <FormField
              name="hateSpeech"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      {...register('hateSpeech')}
                      onCheckedChange={(e) => setValue('hateSpeech', e as boolean)}
                    />
                    <div>Hate speech</div>
                  </div>
                </FormItem>
              )}
              control={control}
            />
            <FormField
              name="spam"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      {...register('spam')}
                      onCheckedChange={(e) => setValue('spam', e as boolean)}
                    />
                    <div>Spam</div>
                  </div>
                </FormItem>
              )}
              control={control}
            />
            <FormField
              name="threat"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      {...register('threat')}
                      onCheckedChange={(e) => setValue('threat', e as boolean)}
                    />
                    <div>Threat of violence</div>
                  </div>
                </FormItem>
              )}
              control={control}
            />
            {reportType === 'CHALLENGE' && (
              <FormField
                name="unclear"
                render={() => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        {...register('unclear')}
                        onCheckedChange={(e) => setValue('unclear', e as boolean)}
                      />
                      <div>Unclear</div>
                    </div>
                  </FormItem>
                )}
                control={control}
              />
            )}

            <FormField
              name="comments"
              render={() => (
                <FormItem className="my-3">
                  <div className="flex flex-col gap-3">
                    <div>Other information</div>
                    <Textarea
                      {...register('comments')}
                      placeholder="Any extra information to help our moderator team when reviewing this report."
                    />
                  </div>
                </FormItem>
              )}
              control={control}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setShow(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Send report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
