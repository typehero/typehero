import { cn } from '@repo/ui/cn';
import { Loader2 } from '@repo/ui/icons';
import React from 'react';

export function Loader({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center" role="status">
      <Loader2 className={cn('h-6 w-6 animate-spin ', className)} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
