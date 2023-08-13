'use client';
import clsx from 'clsx';
import React from 'react';

export interface ExpandableProps extends React.HTMLProps<HTMLDetailsElement> {
  header: React.ReactNode;
}

export function Expandable({
  header,
  children,
  className,
  ...props
}: React.PropsWithChildren<ExpandableProps>) {
  return (
    <details className={clsx('expandable', className)} {...props}>
      <summary className="cursor-pointer [&::marker]:hidden [&::marker]:content-none">
        {header}
      </summary>
      <section>{children}</section>
    </details>
  );
}
