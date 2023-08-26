'use client';

import { Button } from '@repo/ui';

interface EnrollButtonProps {
  action: () => Promise<void>;
  text: string;
}

export function EnrollButton({ action, text }: EnrollButtonProps) {
  return (
    <Button
      onClick={async () => {
        await action();
      }}
    >
      {text}
    </Button>
  );
}
