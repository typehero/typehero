import { Loader2 } from '@repo/ui/icons';
import { useSession } from '@repo/auth/react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Button, Textarea, Markdown, ToastAction, useToast } from '@repo/ui';

interface Props {
  mode: 'create' | 'edit' | 'reply';
  onCancel?: () => void;
  onChange: (text: string) => void;
  value: string;
  placeholder?: string;
  onSubmit: () => Promise<void>;
}

export function CommentInput({ mode, onCancel, onChange, value, placeholder, onSubmit }: Props) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [commentMode, setCommentMode] = useState<'editor' | 'preview'>('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef, value, commentMode);

  const handleEnterKey = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isSubmitting) {
      e.preventDefault();
      return;
    }

    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      if (!session?.user) {
        toast({
          variant: 'destructive',
          title: 'You need to be logged in to comment.',
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        });

        return;
      }
      setIsSubmitting(true);
      await onSubmit();
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl rounded-br-lg bg-neutral-100 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-700/90">
      {commentMode === 'editor' && (
        <Textarea
          autoFocus
          className="resize-none border-0 px-3 py-2 focus-visible:ring-0 md:max-h-[calc(100vh_-_232px)]"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleEnterKey}
          placeholder={placeholder ?? 'Enter your comment here.'}
          ref={textAreaRef}
          value={value}
        />
      )}
      {commentMode === 'preview' && (
        <div className="min-h-[5rem] overflow-y-auto break-words px-3 pt-2 text-sm md:max-h-[calc(100vh_-_232px)]">
          <Markdown>{value}</Markdown>
        </div>
      )}
      <div className="flex justify-end">
        <div className="flex gap-2 p-2">
          <Button
            className="h-8"
            onClick={() => setCommentMode(commentMode === 'editor' ? 'preview' : 'editor')}
            variant={mode === 'create' ? 'secondary' : 'ghost'}
          >
            {commentMode === 'editor' ? 'Preview' : 'Edit'}
          </Button>
          {mode !== 'create' && (
            <Button className="h-8" onClick={() => onCancel?.()} variant="secondary">
              Cancel
            </Button>
          )}
          <Button
            className="h-8 w-[5.5rem] rounded-lg rounded-br-sm bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
            disabled={value.length === 0 || isSubmitting}
            onClick={async () => {
              try {
                if (!session?.user) {
                  toast({
                    variant: 'destructive',
                    title: 'You need to be logged in to comment.',
                    action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
                  });

                  return;
                }

                setIsSubmitting(true);

                await onSubmit();
              } catch (e) {
                console.error(e);
              } finally {
                setIsSubmitting(false);
                setCommentMode('editor');
              }
            }}
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Comment'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function useAutosizeTextArea(
  textAreaRef: RefObject<HTMLTextAreaElement>,
  value: string,
  commentMode: string,
) {
  useEffect(() => {
    if (textAreaRef.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = '0px';
      const scrollHeight = textAreaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.current.style.height = `${scrollHeight}px`;
    }
    // eslint-disable-next-line
  }, [textAreaRef.current, value, commentMode]);
}
