'use client';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DialogFooter } from '@repo/ui/components/dialog';
import { useToast } from '@repo/ui/components/use-toast';
import { CheckCircle2, Clipboard } from '@repo/ui/icons';
import lzstring from 'lz-string';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useLocalStorage } from '~/utils/useLocalStorage';

export function ShareUrl() {
  const { year, day } = useParams();
  const { toast } = useToast();
  const [state, setState] = useState<'copied' | 'idle' | 'loading'>('idle');
  // enable copy with code by default on playground, or we are provided with code
  const [copyWithCode, setCopyWithCode] = useState(false);
  const [localStorageCode] = useLocalStorage(`challenge-${year}-${day}`, '');
  const url = window.location.href;

  const genShortUrl = useCallback(async () => {
    let long = url;
    const code = localStorageCode;
    if (copyWithCode && code) {
      const compressedCode = lzstring.compressToEncodedURIComponent(code);
      long += `?code=${compressedCode}`;
    }
    return long;
  }, [url, localStorageCode, copyWithCode]);

  const copyToClipboard = useCallback(async () => {
    setState('loading');
    const short = await genShortUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(short);
        setState('copied');
        toast({
          title: 'URL Copied!!',
          description: 'Share url is copied to your clipboard.',
        });
        window.setTimeout(() => setState('idle'), 3000);
      }
    } catch (e) {
      console.error('copyToClipboard', e);
      setState('idle');
      toast({
        title: 'Copy Failed!!',
        variant: 'destructive',
      });
    }
  }, [genShortUrl, toast]);

  const onCopyWithCodeChange = useCallback((checked: boolean) => {
    setCopyWithCode(checked);
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <p>Copy this url to share with your friends!</p>
      <code
        aria-disabled={state === 'loading'}
        className="break-all rounded-lg border border-black/20 bg-white px-4 py-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:border-white/20 dark:bg-black"
      >
        {url}
      </code>
      <DialogFooter>
        <div className="flex items-center justify-end gap-2">
          {localStorageCode ? (
            <div className="flex h-fit items-center justify-center gap-2 text-xs">
              <Checkbox
                id="copy-with-code"
                checked={copyWithCode}
                onCheckedChange={onCopyWithCodeChange}
              />
              <label htmlFor="copy-with-code">Copy with code</label>
            </div>
          ) : null}
          <button
            disabled={state === 'loading'}
            className={`flex items-center justify-between space-x-2 rounded-lg px-2 py-1 duration-300 active:scale-75 disabled:cursor-not-allowed disabled:opacity-50
        ${
          state === 'copied'
            ? 'border border-green-500 text-green-500 dark:border-green-700 dark:bg-green-700 dark:text-white'
            : 'border border-black/20  text-black hover:bg-gray-100 dark:bg-white'
        }`}
            onClick={copyToClipboard}
          >
            <span>{state === 'copied' ? 'Copied!' : 'Copy'}</span>
            {state === 'copied' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
          </button>
        </div>
      </DialogFooter>
    </div>
  );
}
