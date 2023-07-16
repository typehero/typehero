/* eslint-disable import/namespace */
'use client';

import * as AllIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import React from 'react';
import { Button, type ButtonProps } from './button';

type IconNames = keyof typeof AllIcons;

export interface IconButtonProps extends ButtonProps {
  icon: IconNames;
  iconSize?: string | number;
}

export function IconButton({ icon, iconSize, ...props }: IconButtonProps) {
  const Icon = AllIcons[icon] as LucideIcon;
  return (
    <Button {...props}>
      <Icon size={iconSize} />
    </Button>
  );
}
