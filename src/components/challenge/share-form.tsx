'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
export function ShareForm() {
  const url = window.location.href;

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div>
      <Input value={window.location.href} />
      <Button className="block ml-auto mt-4" onClick={copyToClipboard}>
        Copy to Clipboard
      </Button>
    </div>
  );
}
