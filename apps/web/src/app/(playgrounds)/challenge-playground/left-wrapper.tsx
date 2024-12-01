'use client';

import { type ReactNode } from 'react';

interface LeftWrapperProps {
  children: ReactNode;
}

export function LeftWrapper({ children }: LeftWrapperProps) {
  return <div className="flex h-full w-full flex-col">{children}</div>;
}
