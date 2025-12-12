'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from '@repo/ui/icons';
import { cn } from '@repo/ui/cn';
import { useChallengeNavigation } from '~/hooks/use-challenge-navigation';

export function ChallengeDropdownMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { isActive, challengeLinks } = useChallengeNavigation();

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'hover:text-foreground text-foreground/80 flex w-full items-center justify-between transition-colors',
          {
            '!text-foreground': isActive,
          },
        )}
      >
        <span>Challenges</span>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', {
            'rotate-180': isOpen,
          })}
        />
      </button>

      {isOpen ? (
        <div className="animate-in slide-in-from-top-2 ml-4 flex flex-col gap-2 duration-200">
          {challengeLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="text-foreground/60 hover:text-foreground flex items-center gap-2 text-sm transition-colors">
                <ChevronRight className="h-3 w-3" />
                {link.label}
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
