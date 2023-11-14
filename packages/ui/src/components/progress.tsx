'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';
import { cn } from '../cn';

interface ProgressIndicator {
  indicatorClassName?: string;
}

const Progress = React.forwardRef<
  ProgressIndicator & React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressIndicator & React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ indicatorClassName, className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('bg-secondary relative h-4 w-full overflow-hidden rounded-full', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn('bg-primary h-full w-full flex-1 transition-all', indicatorClassName)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
