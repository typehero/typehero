'use client';

import { useCallback, useState } from 'react';
import { Clipboard as ClipboardIcon, CheckCircle2 as CheckCircle2Icon } from 'lucide-react';
import { Button } from '../ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { DialogFooter } from '../ui/dialog';

export function ShareForm() {
  const url = window.location.href;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    const url = window.location.href;

    try {
      if (navigator.clipboard && !copied) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 3000);
      }
    } catch (e) {
      console.error('copyToClipboard', e);
      setCopied(false);
    }
  }, [setCopied, copied]);

  return (
    <div className="flex flex-col space-y-4">
      <p>Copy this challenge url to share with your friends!</p>
      <code className="rounded-md border px-4 py-2 dark:border-gray-300">{url}</code>

      <DialogFooter>
        <button
          className={`flex items-center justify-between space-x-2 rounded-lg px-2 py-1 duration-300 active:scale-75 
        ${
          copied
            ? 'border border-green-500 text-green-500 dark:border-green-700 dark:bg-green-700 dark:text-white'
            : 'border border-gray-100 text-black hover:bg-gray-100 dark:bg-white'
        }`}
          onClick={copyToClipboard}
        >
          <span>{copied ? 'Copied!' : 'Copy'}</span>
          {copied ? <CheckCircle2Icon /> : <ClipboardIcon />}
        </button>
      </DialogFooter>
    </div>
  );
}
