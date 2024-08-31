'use client';
import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import lzstring from 'lz-string';
import { createShortURL } from '~/app/share/_actions/create-url';
import { useLocalStorage } from '~/utils/useLocalStorage';
import { Checkbox } from '@repo/ui/components/checkbox';
import { CheckCircle2, Clipboard } from '@repo/ui/icons';
import { DialogFooter } from '@repo/ui/components/dialog';

interface ShareShortUrlProps {
  longUrl?: string;
  desciprtion?: string;
  isChallenge: boolean;
}

export function ShareUrl({ longUrl, desciprtion, isChallenge }: ShareShortUrlProps) {
  const { slug } = useParams();
  const [state, setState] = useState<'copied' | 'idle' | 'loading'>('idle');
  const [copyWithCode, setCopyWithCode] = useState(false);
  const [codeToCompress] = useLocalStorage(`challenge-${slug}`, '');
  const [shortUrl, setShortUrl] = useState('');
  const challengeUrl = `${window.location.origin}/challenge/${slug}`;

  if (!isChallenge && !longUrl) {
    throw new Error("'longUrl' is required for non-challenge share url component.");
  }

  const genShortUrl = useCallback(async () => {
    let long = longUrl ?? challengeUrl;
    if (copyWithCode && codeToCompress) {
      const compressedCode = lzstring.compressToEncodedURIComponent(codeToCompress);
      long += `?code=${compressedCode}`;
    }
    // if it's a challenge, we don't need to create a short url
    if (copyWithCode || !isChallenge) {
      const url = await createShortURL(long);
      // if we can't create a short url, return the long url
      return url ?? long;
    }
    return long;
  }, [longUrl, challengeUrl, copyWithCode, codeToCompress, isChallenge]);

  const copyToClipboard = useCallback(async () => {
    setState('loading');
    const short = await genShortUrl();
    setShortUrl(short);
    try {
      if (navigator.clipboard && state !== 'copied') {
        await navigator.clipboard.writeText(shortUrl);
        setState('copied');
        window.setTimeout(() => setState('idle'), 3000);
      }
    } catch (e) {
      console.error('copyToClipboard', e);
      setState('idle');
    }
  }, [genShortUrl, state, shortUrl]);

  const onCopyWithCodeChange = useCallback((checked: boolean) => {
    setCopyWithCode(checked);
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <p>{desciprtion ?? 'Copy this url to share with your friends!'}</p>
      <code
        aria-disabled={state === 'loading'}
        className="rounded-lg border border-black/20 bg-white px-4 py-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:border-white/20 dark:bg-black"
      >
        {shortUrl.length === 0 ? challengeUrl : shortUrl}
      </code>
      <DialogFooter>
        <div className="flex items-center justify-end gap-2">
          {codeToCompress ? (
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
