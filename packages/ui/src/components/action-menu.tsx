'use client';
import { type LucideIcon, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

export interface ActionMenuItem {
  icon?: LucideIcon;
  label: string;
  key: string;
}

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
              className="flex items-center gap-2 py-2 pr-0 pl-3"
              key={item.key}
              onClick={() => props.onChange(item)}
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
