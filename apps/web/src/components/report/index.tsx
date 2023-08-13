import { type IssueType } from '@repo/db/types';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  Button,
  FormField,
  FormItem,
  Text,
  Checkbox,
  Textarea,
  toast,
} from '@repo/ui';
import {
  type ChallengeReport,
  type UserReport,
  type CommentReport,
  addReport,
  type SolutionReport,
} from '~/components/report/report.action';

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
  | ReportChallengeDialogProps
  | ReportCommentDialogProps
  | ReportSolutionDialogProps
  | ReportUserDialogProps
>) {
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
    setValue,
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
      <DialogTrigger asChild={triggerAsChild}>{children}</DialogTrigger>
      <DialogContent>
        <form
          onSubmit={handleSubmit(async (e) => {
            let args = {} as ChallengeReport | CommentReport | SolutionReport | UserReport;
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
            const issues = Object.entries(e).reduce<{ type: IssueType }[]>((all, [key, value]) => {
              if (key === 'comments') return all;
              if (value)
                all.push({
                  type: key.toUpperCase() as IssueType,
                });
              return all;
            }, []);

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
              control={control}
              name="derogatory"
              render={({ field }) => (
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
              render={({ field }) => (
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
              render={({ field }) => (
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
              render={({ field }) => (
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
              render={({ field }) => (
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
                render={({ field }) => (
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
              render={({ field }) => (
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
            <Button type="submit">Send report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
