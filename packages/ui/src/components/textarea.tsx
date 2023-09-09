import * as React from 'react';
import { cn } from '../cn';
import { containsProfanity } from 'web/src/utils/profanity';
import { toast } from './use-toast';
import { ToastAction } from './toast';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  setSubmittable?: (submittable: boolean) => void;
  submittable?: boolean;
};

const profanityMessage = "Don't use profanity.";

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, submittable, setSubmittable, ...props }, ref) => {
    const [error, setError] = React.useState(
      props.value ? (containsProfanity(props.value.toString()) ? profanityMessage : '') : '',
    );
    const lastText = React.useRef(props.value ? props.value.toString() : '');
    console.log(`content: ${props.value}`);

    function overrideOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      if (containsProfanity(e.target.value)) {
        if (error != profanityMessage) {
          setError(profanityMessage);
          if (setSubmittable) setSubmittable(false);
        }
      } else if (error != '') {
        setError('');
        if (!submittable && setSubmittable) setSubmittable(true);
      }
      lastText.current = e.target.value;
      if (props.onChange) props.onChange(e);
    }

    function overrideOnKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (e.shiftKey && e.key === 'Enter' && containsProfanity(lastText.current)) {
        toast({
          variant: 'destructive',
          title: profanityMessage,
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        });
        return;
      }
      if (props.onKeyDown) props.onKeyDown(e);
    }

    const temp = { ...props };
    delete temp.onChange;
    delete temp.onKeyDown;

    return (
      <div>
        <textarea
          className={cn(
            'border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 pb-8 text-sm focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...temp}
          onChange={overrideOnChange}
          onKeyDown={overrideOnKeyDown}
        />
        <div className="relative flex w-full items-center justify-between">
          <p className="pl-3 text-sm text-red-900 dark:text-red-400">{error ? error : ''}</p>
          <div className="pr-3">{props.children}</div>
        </div>
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
