import type { ForwardRefExoticComponent } from 'react';

// For satisfying types when passing the next/link component to a UI component
export type NextjsLinkComponentType = ForwardRefExoticComponent<
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
    React.RefAttributes<HTMLAnchorElement> & {
      children?: React.ReactNode;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } & { href: any }
>;
