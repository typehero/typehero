/* eslint-disable import/namespace */
'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu';

import { MoreHorizontal, type LucideIcon } from 'lucide-react';

export type ActionMenuItem = {
  icon?: LucideIcon;
  label: string;
  key: string;
};

export interface ActionMenuProps {
  items: ActionMenuItem[];
  onChange: (e: ActionMenuItem) => void;
}

export function ActionMenu(props: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal className="cursor-pointer text-neutral-500" size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2 rounded-xl rounded-tr-sm p-0 invert">
        {props.items.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              onClick={() => props.onChange(item)}
              key={item.key}
              className="flex items-center gap-2 py-2 pl-3 pr-0"
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
