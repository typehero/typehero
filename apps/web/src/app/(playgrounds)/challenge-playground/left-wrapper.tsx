'use client';

import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function LeftWrapper({ children }: Props) {
  return <div className="flex h-full w-full flex-col">{children}</div>;
}
