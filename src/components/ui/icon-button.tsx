'use client';

import * as AllIcons from 'lucide-react';
import type { Icon } from 'lucide-react';
import React from 'react';
import { Button, type ButtonProps } from './button';

type IconNames = keyof typeof AllIcons;

export interface IconButtonProps extends ButtonProps {
  icon: IconNames;
  iconSize?: string | number;
}

export function IconButton({ icon, iconSize, ...props }: IconButtonProps) {
  const Icon = AllIcons[icon] as Icon;
  return (
    <Button {...props}>
      <Icon size={iconSize} />
    </Button>
  );
}
