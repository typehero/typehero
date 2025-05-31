'use client';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '../cn';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>) => (
  <ToastPrimitives.Viewport
    className={cn(
      'fixed top-10 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-14 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
);
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto bg-white dark:bg-black/80 to-difficulty-easy border-white border-2 relative flex w-full overflow-hidden rounded-xl border gap-x-3 p-6 pl-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: '',
        destructive: '',
        success: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const bgToastVariants = cva('absolute -left-1 bottom-0 right-0 top-0', {
  variants: {
    variant: {
      default:
        'bg-[linear-gradient(to_right,#C4B5FD_1px,transparent_1px),linear-gradient(to_bottom,#C4B5FD,transparent_1px)] bg-[size:18px_18px] [mask-image:radial-gradient(ellipse_50%_70%_at_1%_30%,#000_20%,transparent_60%)]',
      destructive:
        'bg-[linear-gradient(to_right,#FCA5A5_1px,transparent_1px),linear-gradient(to_bottom,#FCA5A5_1px,transparent_1px)] bg-[size:18px_18px] [mask-image:radial-gradient(ellipse_50%_70%_at_1%_30%,#000_20%,transparent_60%)]',
      success:
        'bg-[linear-gradient(to_right,#86EFAC_1px,transparent_1px),linear-gradient(to_bottom,#86EFAC_1px,transparent_1px)] bg-[size:18px_18px] [mask-image:radial-gradient(ellipse_50%_70%_at_1%_30%,#000_20%,transparent_60%)]',
    },
    defaultVariants: {
      variant: 'default',
    },
  },
});

const Toast = ({ className, variant, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>) => {
  return (
    <ToastPrimitives.Root
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      <div className={cn(bgToastVariants({ variant }))} />
      <div className="z-50 inline-flex w-full gap-x-3">{props.children}</div>
    </ToastPrimitives.Root>
  );
};
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>) => (
  <ToastPrimitives.Action
    className={cn(
      'ring-offset-background focus:ring-ring group-[.destructive]:border-destructive-foreground group-[.destructive]:dark:hover:text-destructive-foreground group-[.destructive]:hover:bg-destructive-foreground group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-black bg-transparent px-3 text-sm font-medium transition-colors hover:bg-transparent/10 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:hover:bg-transparent/10 dark:border-white',
      className,
    )}
    {...props}
  />
);
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>) => (
  <ToastPrimitives.Close
    className={cn(
      'text-foreground/50 hover:text-foreground absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
);
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>) => (
  <ToastPrimitives.Title
    className={cn('z-10 text-sm font-semibold', className)}
    {...props}
  />
);

const ToastDescription = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>) => (
  <ToastPrimitives.Description
    className={cn('z-10 text-sm text-black/50 opacity-90 dark:text-white/50', className)}
    {...props}
  />
);

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
};
