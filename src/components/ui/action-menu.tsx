/* eslint-disable import/namespace */
'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu';

import * as AllIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ActionMenuItem = {
  icon?: keyof typeof AllIcons;
  label: string;
  key: string;
};

export interface ActionMenuProps {
  items: ActionMenuItem[];
  onChange: (e: ActionMenuItem) => void;
}

type OptionalIcon = LucideIcon | null;

export function ActionMenu(props: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AllIcons.MoreHorizontal className="cursor-pointer" size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-full">
        {props.items.map((item) => {
          const Icon = (item.icon ? AllIcons[item.icon] : null) as OptionalIcon;
          return (
            <DropdownMenuItem
              onClick={() => props.onChange(item)}
              key={item.key}
              className="flex items-center gap-2 rounded-full"
            >
              <div>{Icon ? <Icon size={16} /> : null}</div>
              <div>{item.label}</div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
