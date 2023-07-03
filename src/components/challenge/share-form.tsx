'use client';

import { useCallback, useState } from 'react';
import { Clipboard as ClipboardIcon, CheckCircle2 as CheckCircle2Icon } from 'lucide-react';

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
      <code className="px-4 py-2 border dark:border-gray-300 rounded-md">{url}</code>
      <button
        className={`ml-auto mt-4 flex items-center justify-between space-x-2 rounded-lg px-3 py-2 duration-300 active:scale-75
        ${copied ? 'bg-green-500 dark:bg-green-700 dark:text-white' : 'text-black dark:bg-white'}`}
        onClick={() => void copyToClipboard()}
      >
        <span>{copied ? 'Copied!' : 'Copy'}</span>
        {copied ? <CheckCircle2Icon /> : <ClipboardIcon />}
      </button>
    </div>
  );
}
