import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Button } from '~/components/ui/button';
import { Markdown } from '~/components/ui/markdown';
import { Textarea } from '~/components/ui/textarea';

interface Props {
  mode: 'edit' | 'create';
  onCancel?: () => void;
  onChange: (text: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  value: string;
  onSubmit: () => Promise<void>;
}

export function CommentInput({ mode, onCancel, onChange, onKeyDown, value, onSubmit }: Props) {
  const [commentMode, setCommentMode] = useState<'editor' | 'preview'>('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef, value, commentMode);

  return (
    <div className="m-2 mt-0 flex flex-col rounded-xl rounded-br-lg bg-background/90 bg-neutral-100 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-700/90">
      <div>
        {commentMode === 'editor' && (
          <Textarea
            ref={textAreaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (isSubmitting) return;
              onKeyDown(e);
            }}
            className="resize-none border-0 px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter your comment here."
          />
        )}
        {commentMode === 'preview' && (
          <div className="p-2">
            <Markdown>{value}</Markdown>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <div className="flex gap-2 p-2">
          <Button
            variant={mode === 'create' ? 'secondary' : 'ghost'}
            className="h-8"
            onClick={() => setCommentMode(commentMode === 'editor' ? 'preview' : 'editor')}
          >
            {commentMode === 'editor' ? 'Preview' : 'Edit'}
          </Button>
          {mode === 'edit' && (
            <Button variant="secondary" className="h-8" onClick={() => onCancel?.()}>
              Cancel
            </Button>
          )}
          <Button
            disabled={value.length === 0 || isSubmitting}
            onClick={async () => {
              try {
                setIsSubmitting(true);

                await onSubmit();
              } catch (e) {
                console.error(e);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="h-8 w-[5.5rem] rounded-lg rounded-br-sm bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300"
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
      textAreaRef.current.style.height = scrollHeight + 'px';
    }
    // eslint-disable-next-line
  }, [textAreaRef.current, value, commentMode]);
}
