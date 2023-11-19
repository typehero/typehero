'use client';
import { cn } from '@repo/ui/cn';
import { buttonVariants } from '@repo/ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { Share } from '@repo/ui/icons';
import React from 'react';

export function ShareTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(buttonVariants({ variant: 'secondary', size: 'xs' }), 'rounded-full')}>
          <Share className="h-4 w-4" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Share</p>
      </TooltipContent>
    </Tooltip>
  );
}
