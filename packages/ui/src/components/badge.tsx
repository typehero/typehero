import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../cn';

const badgeVariants = cva(
  'inline-flex items-center border rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0',
  {
    variants: {
      variant: {
        default: 'bg-primary border-transparent text-primary-foreground',
        secondary: 'bg-secondary border-transparent text-secondary-foreground dark:bg-zinc-700',
        destructive: 'bg-destructive border-transparent text-destructive-foreground',
        outline: 'text-foreground',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        xs: 'px-0 py-0 text-xs',
        sm: 'px-1 text-xs',
        lg: 'px-2.5 py-0.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
