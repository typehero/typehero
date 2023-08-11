'use client';

import type { LucideIcon } from 'lucide-react';
import React from 'react';
import { Button, type ButtonProps } from './button';

export interface IconButtonProps extends ButtonProps {
  icon: LucideIcon;
  iconSize?: number | string;
}

export function IconButton({ icon: Icon, iconSize, ...props }: IconButtonProps) {
  return (
    <Button {...props}>
      <Icon size={iconSize} />
    </Button>
  );
}
