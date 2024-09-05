'use client';
import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import lzstring from 'lz-string';
import { createShortURL } from '~/app/share/_actions/create-url';
import { useLocalStorage } from '~/utils/useLocalStorage';
import { Checkbox } from '@repo/ui/components/checkbox';
import { CheckCircle2, Clipboard } from '@repo/ui/icons';
import { DialogFooter } from '@repo/ui/components/dialog';
import { useToast } from '@repo/ui/components/use-toast';

interface ShareShortUrlProps {
  desciprtion?: string;
  isChallenge?: boolean;
  code?: string;
  longUrl?: string;
}

export function ShareUrl({ desciprtion, isChallenge = false, code, longUrl }: ShareShortUrlProps) {
  const { slug } = useParams();
  const { toast } = useToast();
  const shareType = isChallenge ? 'challenge' : 'playground';
  const [state, setState] = useState<'copied' | 'idle' | 'loading'>('idle');
  // enable copy with code by default on playground, or we are provided with code
  const [copyWithCode, setCopyWithCode] = useState(shareType === 'playground' || Boolean(code));
  const [localStorageCode] = useLocalStorage(`${shareType}-${slug}`, '');
  const [shortUrl, setShortUrl] = useState('');
  const [previousCode, setPreviousCode] = useState('');
  const url = longUrl ?? `${window.location.origin}/${shareType}/${slug}`;

  const genShortUrl = useCallback(async () => {
    let long = url;
    const fullCode = code ?? localStorageCode;
    if (copyWithCode && fullCode) {
      const compressedCode = lzstring.compressToEncodedURIComponent(fullCode);
      long += `?code=${compressedCode}`;

      // Check if the code has changed
      if (fullCode !== previousCode) {
        const short = await createShortURL(long);
        setPreviousCode(fullCode);
        return short ?? long;
      }
      return shortUrl;
    }
    return long;
  }, [url, code, localStorageCode, copyWithCode, previousCode, shortUrl]);

  const copyToClipboard = useCallback(async () => {
    setState('loading');
    const short = await genShortUrl();
    setShortUrl(short);
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
      <p>{desciprtion ?? 'Copy this url to share with your friends!'}</p>
      <code
        aria-disabled={state === 'loading'}
        className="break-all rounded-lg border border-black/20 bg-white px-4 py-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:border-white/20 dark:bg-black"
      >
        {shortUrl.length === 0 ? (code ? 'Copy to Generate URL!' : url) : shortUrl}
      </code>
      <DialogFooter>
        <div className="flex items-center justify-end gap-2">
          {/* Checkbox not needed in playground, or we already are providing code */}
          {localStorageCode && isChallenge && !code ? (
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
