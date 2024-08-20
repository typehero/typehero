'use client';

import { cn } from '@repo/ui/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Popover, PopoverAnchor, PopoverContent } from '@repo/ui/components/popover';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { searchUsers } from './actions';
import { useToast } from '@repo/ui/components/use-toast';

interface Props {
  isOpen: boolean;
  query: string;
  onFocusOutside: () => void;
  onSelectedUser: (user: string) => void;
}

export function UserResults({ isOpen, onFocusOutside, onSelectedUser, query }: Props) {
  const { toast } = useToast();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data: users, error } = useQuery({
    retry: false,
    staleTime: 10000,
    queryKey: ['search-users', query],
    queryFn: () => {
      return searchUsers(query);
    },
    enabled: Boolean(query),
  });

  // when we fetch new users or toggle the popover we want to reset the
  // index to 0
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Query limit exceeded!',
        description: 'Usernames are limited to 39 characters.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    const controller = new AbortController();
    const scrollTo = (index: number) => {
      const node = popoverRef.current?.children[0]?.children[index];
      node?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    };

    window.addEventListener(
      'keydown',
      (e) => {
        if (!users) {
          return;
        }

        if (e.key === 'ArrowDown') {
          setSelectedIndex((si) => {
            const index = (si + 1) % users.length;
            scrollTo(index);
            return index;
          });
        }
        if (e.key === 'ArrowUp') {
          setSelectedIndex((si) => {
            const index = si - 1 < 0 ? users.length - 1 : si - 1;
            scrollTo(index);
            return index % users.length;
          });
        }
      },
      { signal: controller.signal },
    );

    window.addEventListener(
      'keyup',
      (e) => {
        if ((e.key === 'Tab' || e.key === 'Enter') && isOpen) {
          const selectedUser = users?.[selectedIndex];
          if (selectedUser) {
            onSelectedUser(selectedUser.name);
          }
        }
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [onSelectedUser, selectedIndex, isOpen, users]);

  return (
    <Popover open={isOpen}>
      <PopoverAnchor className="absolute bottom-0 left-0" />
      <PopoverContent
        ref={popoverRef}
        className="absolute left-0 h-80 w-80 overflow-y-auto bg-zinc-100 p-0 shadow-lg shadow-neutral-500 dark:bg-zinc-900"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={onFocusOutside}
      >
        <ul>
          {users?.map((user, index) => {
            return (
              <li key={user.id}>
                <Button
                  className={cn(
                    selectedIndex === index ? 'bg-zinc-400/50 dark:bg-zinc-600/50' : '',
                    'flex w-full justify-start gap-2 rounded-none  hover:bg-zinc-400/50 dark:hover:bg-zinc-600/50',
                  )}
                  variant="ghost"
                  onClick={() => {
                    const selectedUser = users?.[index];
                    if (selectedUser) {
                      onSelectedUser(selectedUser.name);
                    }
                  }}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage alt="github profile picture" src={user?.image ?? ''} />
                    <AvatarFallback className="border border-zinc-300 dark:border-zinc-600">
                      {user?.name.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>{user.name}</div>
                </Button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
