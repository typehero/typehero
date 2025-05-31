'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import type { ComponentProps } from 'react';
import * as React from 'react';
import { cn } from '../cn';

const Avatar = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) => (
  <AvatarPrimitive.Root
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
);

const AvatarImage = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
);

const AvatarFallback = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback
    className={cn(
      'bg-muted flex h-full w-full items-center justify-center rounded-full',
      className,
    )}
    {...props}
  />
);

// million-ignore
function DefaultAvatar(props: ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      shapeRendering="auto"
      width={50}
      height={50}
      {...props}
    >
      <mask id="viewboxMask">
        <rect width="200" height="200" rx="0" ry="0" x="0" y="0" fill="#fff" />
      </mask>
      <g mask="url(#viewboxMask)">
        <rect fill="#71cf62" width="200" height="200" x="0" y="0" />
        <g transform="matrix(1.5625 0 0 1.5625 37.5 110.94)">
          <path
            d="M40.54 30h-.75c-9.7-.22-20.8-5.3-23.7-16.15a1.36 1.36 0 0 1 .44-1.55 1.41 1.41 0 0 1 2.26.86c2.55 9.46 12.42 13.89 21.06 14.08 8.24.16 19.04-3.84 22.46-14.57a1.47 1.47 0 0 1 1.65-.55A1.44 1.44 0 0 1 65 13.5C61.85 23.31 52.3 30 40.54 30Z"
            fill="#000"
          />
        </g>
        <g transform="matrix(1.5625 0 0 1.5625 31.25 59.38)">
          <path
            d="M75.84 21.11c-2.9.04-5.72-.89-8.04-2.63a13.47 13.47 0 0 1-4.85-7.03 1.75 1.75 0 0 1 1.1-2.26 1.68 1.68 0 0 1 1.86.61c.14.2.24.4.3.64.6 2.11 1.87 3.97 3.61 5.28a9.84 9.84 0 0 0 6.04 1.98c2.17.01 4.29-.68 6.03-2a10.17 10.17 0 0 0 3.65-5.26c.15-.42.46-.75.85-.95a1.68 1.68 0 0 1 2.23.7c.21.38.27.83.17 1.26a13.48 13.48 0 0 1-4.87 7.04 13.17 13.17 0 0 1-8.08 2.62ZM13.84 21.11c-2.9.03-5.73-.9-8.06-2.65a13.54 13.54 0 0 1-4.85-7.05 1.78 1.78 0 0 1 .51-1.88 1.67 1.67 0 0 1 2.4.22c.15.17.25.38.32.6.62 2.1 1.9 3.96 3.64 5.28a9.93 9.93 0 0 0 6.02 2c2.18.03 4.3-.67 6.06-1.99a10.21 10.21 0 0 0 3.66-5.3 1.68 1.68 0 0 1 3.08-.25c.21.4.27.85.17 1.27a13.57 13.57 0 0 1-4.86 7.1 13.19 13.19 0 0 1-8.1 2.65Z"
            fill="#000"
          />
        </g>
      </g>
    </svg>
  );
}

export { Avatar, AvatarFallback, AvatarImage, DefaultAvatar };
