'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from '@repo/ui/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { cn } from '@repo/ui/cn';
import { useChallengeNavigation } from '~/hooks/use-challenge-navigation';

export function ChallengeDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { isActive, challengeLinks } = useChallengeNavigation();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Open challenges menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={cn(
            'hover:text-foreground text-foreground/80 flex items-center gap-1 transition-colors',
            {
              '!text-foreground': isActive,
            },
          )}
        >
          Challenges
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', {
              'rotate-180': isOpen,
            })}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="mt-2 w-48 rounded-xl bg-white/50 backdrop-blur-sm dark:bg-neutral-950/50"
        role="menu"
      >
        {challengeLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <DropdownMenuItem
              className="focus:bg-accent rounded-lg p-2 duration-300 focus:outline-none dark:hover:bg-neutral-700/50"
              role="menuitem"
            >
              {link.label}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
