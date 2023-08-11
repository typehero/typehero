'use client';

import { CheckCircle2 as CheckCircle2Icon, Clipboard as ClipboardIcon } from 'lucide-react';
import lzstring from 'lz-string';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { DialogFooter } from '../ui/dialog';
import { useLocalStorage } from '~/utils/useLocalStorage';

export function ShareForm() {
  const { id: challengeId } = useParams();
  const [copied, setCopied] = useState(false);
  const [copiedWithCode, setCopiedWithCode] = useState(false);
  const [codeToCompress] = useLocalStorage(`challenge-${challengeId}`, '');
  const url = `${window.location.origin}/challenge/${challengeId}`;

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
  }, [copied]);

  const copyToClipboardWithCode = useCallback(async () => {
    const compressedCode = lzstring.compressToEncodedURIComponent(codeToCompress);
    const url = `${window.location.href}?code=${compressedCode}`;

    try {
      if (navigator.clipboard && !copiedWithCode) {
        await navigator.clipboard.writeText(url);
        setCopiedWithCode(true);
        window.setTimeout(() => setCopiedWithCode(false), 3000);
      }
    } catch (e) {
      console.error('copyToClipboard', e);
      setCopiedWithCode(false);
    }
  }, [copiedWithCode, codeToCompress]);

  return (
    <div className="flex flex-col space-y-4">
      <p>Copy this challenge url to share with your friends!</p>
      <code className="rounded-md border px-4 py-2 dark:border-gray-300">{url}</code>

      <DialogFooter>
        <button
          className={`flex items-center justify-between space-x-2 rounded-lg px-2 py-1 duration-300 active:scale-75 
        ${
          copiedWithCode
            ? 'border border-green-500 text-green-500 dark:border-green-700 dark:bg-green-700 dark:text-white'
            : 'border border-gray-100 text-black hover:bg-gray-100 dark:bg-white'
        }`}
          onClick={copyToClipboardWithCode}
        >
          <span>{copiedWithCode ? 'Copied!' : 'Share with Code'}</span>
          {copiedWithCode ? <CheckCircle2Icon /> : <ClipboardIcon />}
        </button>
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
