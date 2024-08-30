import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import lzstring from 'lz-string';
import { createShortURL } from '~/app/share/_actions/create-url';
import { useLocalStorage } from '~/utils/useLocalStorage';
import { Checkbox } from '@repo/ui/components/checkbox';
import { CheckCircle2, Clipboard } from '@repo/ui/icons';
import { Dialog, DialogFooter, DialogTrigger, DialogContent } from '@repo/ui/components/dialog';

type ShareShortUrlProps = {
  children: React.ReactNode;
  longUrl?: string;
  desciprtion?: string;
  isChallenge: boolean;
};

export function ShareUrlWrapper({
  children,
  longUrl,
  desciprtion,
  isChallenge,
}: ShareShortUrlProps) {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const [copyWithCode, setCopyWithCode] = useState(false);
  const [codeToCompress] = useLocalStorage(`challenge-${slug}`, '');
  const [shortUrl, setShortUrl] = useState('');

  if (!isChallenge && !Boolean(longUrl)) {
    throw new Error("'longUrl' is required for non-challenge share url component.");
  }

  useEffect(() => {
    const generateShortUrl = async () => {
      let long = longUrl ?? `${window.location.origin}/challenge/${slug}`;
      if (copyWithCode && codeToCompress) {
        const compressedCode = lzstring.compressToEncodedURIComponent(codeToCompress);
        long += `?code=${compressedCode}`;
      }
      const url = await createShortURL(long);
      setShortUrl(url || long);
    };

    generateShortUrl();
  }, [copyWithCode, codeToCompress, longUrl, slug]);

  const copyToClipboard = useCallback(async () => {
    try {
      if (navigator.clipboard && !copied) {
        await navigator.clipboard.writeText(shortUrl ?? '');
        setCopied(true);
        window.setTimeout(() => setCopied(false), 3000);
      }
    } catch (e) {
      console.error('copyToClipboard', e);
      setCopied(false);
    }
  }, [copied, shortUrl, codeToCompress, copyWithCode]);

  const onCopyWithCodeChange = useCallback((checked: boolean) => {
    setCopyWithCode(checked);
  }, []);

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <div className="flex flex-col space-y-4">
          <p>{desciprtion ?? 'Copy this url to share with your friends!'}</p>
          <code className="rounded-lg border border-black/20 px-4 py-2 dark:border-white/20">
            {shortUrl}
          </code>
          <DialogFooter>
            <div className="flex items-center justify-end gap-2">
              {Boolean(codeToCompress) && (
                <div className="flex h-fit items-center justify-center gap-2 text-xs">
                  <Checkbox
                    id="copy-with-code"
                    checked={copyWithCode}
                    onCheckedChange={onCopyWithCodeChange}
                  />
                  <label htmlFor="copy-with-code">Copy with code</label>
                </div>
              )}
              <button
                className={`flex items-center justify-between space-x-2 rounded-lg px-2 py-1 duration-300 active:scale-75
        ${
          copied
            ? 'border border-green-500 text-green-500 dark:border-green-700 dark:bg-green-700 dark:text-white'
            : 'border border-black/20  text-black hover:bg-gray-100 dark:bg-white'
        }`}
                onClick={copyToClipboard}
              >
                <span>{copied ? 'Copied!' : 'Copy'}</span>
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              </button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
