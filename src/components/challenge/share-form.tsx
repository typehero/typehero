'use client';

import { Button } from '../ui/button';
export function ShareForm() {
  const url = window.location.href;

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div>
      <p>Copy this challenge url so to share with your friends!</p>
      <Button className="block ml-auto mt-4" onClick={copyToClipboard}>
        Copy to Clipboard
      </Button>
    </div>
  );
}
